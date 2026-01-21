import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Music, Search, Book } from 'lucide-react';

import ListaCategorias from './components/ListaCategorias';
import ListaMusicas from './components/ListaMusicas';
import DetalheMusica from './components/DetalheMusica';
import FormMusica from './components/FormMusica';
import BuscaMusica from './components/BuscaMusica';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('categorias');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [musicaSelecionada, setMusicaSelecionada] = useState(null);
  const [musicasFiltradas, setMusicasFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mostrandoAdd, setMostrandoAdd] = useState(false);

  // Monitorar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

  // Atalho de Teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        fazerLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Buscar músicas por categoria
  useEffect(() => {
    if (categoriaSelecionada) {
      const buscarMusicas = async () => {
        setCarregando(true);
        try {
          const q = query(
            collection(db, "musicas"),
            where("categoria", "==", categoriaSelecionada)
          );
          const querySnapshot = await getDocs(q);
          const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMusicasFiltradas(docs.sort((a, b) => a.numero - b.numero));
        } catch (error) {
          console.error("Erro ao buscar músicas:", error);
        }
        setCarregando(false);
      };
      buscarMusicas();
    }
  }, [categoriaSelecionada]);

  const fazerLogin = async () => {
    const email = prompt("E-mail do Administrador:");
    const senha = prompt("Senha:");
    if (email && senha) {
      try {
        await signInWithEmailAndPassword(auth, email, senha);
        alert("Logado como administrador!");
      } catch (error) {
        alert("Falha no login: " + error.message);
      }
    }
  };

  const salvarNovaMusica = async (novaMusica) => {
    try {
      await addDoc(collection(db, "musicas"), novaMusica);
      setMostrandoAdd(false);
      alert("Música adicionada com sucesso!");
    } catch (e) { alert("Erro ao salvar."); }
  };

  const handleTrocarAba = (novaAba) => {
    setAbaAtiva(novaAba);
    setMusicaSelecionada(null);
    setCategoriaSelecionada(null);
  };

  // LÓGICA DE CONTEÚDO (CONSOLIDADA)
  let conteudo;

  if (musicaSelecionada) {
    // Se uma música estiver selecionada, ela domina a tela idependente da aba
    conteudo = (
      <DetalheMusica
        musica={musicaSelecionada}
        onVoltar={() => setMusicaSelecionada(null)}
        isAdmin={!!usuario}
      />
    );
  } else {
    // Caso contrário, decide o que mostrar baseado na aba
    if (abaAtiva === 'categorias') {
      if (categoriaSelecionada) {
        conteudo = (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <button onClick={() => setCategoriaSelecionada(null)}>&larr; Categorias</button>
              {usuario && (
                <button onClick={() => setMostrandoAdd(true)} className="btn-add">+ Música</button>
              )}
            </div>
            {carregando ? (
              <p>Carregando músicas...</p>
            ) : (
              <ListaMusicas
                categoria={categoriaSelecionada}
                musicas={musicasFiltradas}
                onMusicaClick={(id) => setMusicaSelecionada(musicasFiltradas.find(m => m.id === id))}
              />
            )}
          </div>
        );
      } else {
        conteudo = <ListaCategorias onCategoriaClick={(cat) => setCategoriaSelecionada(cat)} />;
      }
    } else if (abaAtiva === 'busca') {
      conteudo = <BuscaMusica onMusicaClick={(m) => setMusicaSelecionada(m)} />;
    } else if (abaAtiva === 'caderno') {
      conteudo = <div className="placeholder-section"><h2>Em breve: Meu Caderno</h2><p>Aqui você poderá salvar suas músicas favoritas.</p></div>;
    }
  }

  return (
    <div className="app-container">
      {usuario && (
        <div className="admin-status-bar">
          <span>● Modo Administrador Ativo ({usuario.email})</span>
          <button onClick={() => signOut(auth)}>Sair</button>
        </div>
      )}
      
      <header>
        <h1>Notas Franciscanas</h1>
        <img src="public/sao-francisco.png" alt="São Francisco" className="sao-francisco-violino" />

        <nav className="tabs-container">
          <button 
            className={`tab-button ${abaAtiva === 'categorias' ? 'active' : ''}`}
            onClick={() => handleTrocarAba('categorias')}
          >
            <Music size={24} />
            <span>Categorias</span>
          </button>
          <button 
            className={`tab-button ${abaAtiva === 'busca' ? 'active' : ''}`}
            onClick={() => handleTrocarAba('busca')}
          >
            <Search size={24} />
            <span>Busca</span>
          </button>
          <button 
            className={`tab-button ${abaAtiva === 'caderno' ? 'active' : ''}`}
            onClick={() => handleTrocarAba('caderno')}
          >
            <Book size={24} />
            <span>Caderno</span>
          </button>
        </nav>
      </header>

      <main>
        {conteudo}
      </main>

      {mostrandoAdd && (
        <FormMusica
          tituloModal="Nova Música"
          musicaInicial={{ categoria: categoriaSelecionada || 'Mantra' }}
          onSubmit={salvarNovaMusica}
          onCancel={() => setMostrandoAdd(false)}
        />
      )}
    </div>
  );
}

export default App;