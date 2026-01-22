import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Music, Search, ClipboardList } from 'lucide-react';

import ListaCategorias from './components/ListaCategorias';
import ListaMusicas from './components/ListaMusicas';
import DetalheMusica from './components/DetalheMusica';
import FormMusica from './components/FormMusica';
import BuscaMusica from './components/BuscaMusica';
import SecaoMissa from './components/SecaoMissa';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('categorias');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [musicaSelecionada, setMusicaSelecionada] = useState(null);
  const [musicasFiltradas, setMusicasFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mostrandoAdd, setMostrandoAdd] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

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
        alert("Logado!");
      } catch (error) { alert("Erro: " + error.message); }
    }
  };

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

  const handleTrocarAba = (novaAba) => {
    setAbaAtiva(novaAba);
    setMusicaSelecionada(null);
    setCategoriaSelecionada(null);
  };

  const salvarNovaMusica = async (novaMusica) => {
    try {
      await addDoc(collection(db, "musicas"), novaMusica);
      setMostrandoAdd(false);
      alert("Sucesso!");
    } catch (e) { alert("Erro ao salvar."); }
  };

  // LÓGICA DE CONTEÚDO
  let conteudo;
  if (musicaSelecionada) {
    conteudo = (
      <DetalheMusica
        musica={musicaSelecionada}
        onVoltar={() => setMusicaSelecionada(null)}
        isAdmin={!!usuario}
      />
    );
  } else if (abaAtiva === 'categorias') {
    if (categoriaSelecionada) {
      conteudo = (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button onClick={() => setCategoriaSelecionada(null)}>&larr; Categorias</button>
            {usuario && <button onClick={() => setMostrandoAdd(true)} className="btn-add">+ Música</button>}
          </div>
          {carregando ? <p>Carregando...</p> : (
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
  } else if (abaAtiva === 'missa') {
    conteudo = <SecaoMissa onVerMusica={(m) => setMusicaSelecionada(m)} />;
  }


  // No seu App.jsx

  useEffect(() => {
    // 1. Função que lida com o evento de "voltar" do navegador/celular
    const handlePopState = (event) => {
      if (musicaSelecionada) {
        // Se estiver numa música, volta para a lista
        setMusicaSelecionada(null);
      } else if (categoriaSelecionada) {
        // Se estiver numa categoria, volta para o menu principal
        setCategoriaSelecionada(null);
      }
    };

    // 2. Sempre que o usuário entra em uma "subtela", adicionamos um estado no histórico
    if (musicaSelecionada || categoriaSelecionada) {
      window.history.pushState({ step: 'detail' }, '');
    }

    // 3. Ouvinte para o botão de voltar do sistema
    window.addEventListener('popstate', handlePopState);

    // Limpeza ao desmontar
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [musicaSelecionada, categoriaSelecionada]);
  // Toda vez que um desses estados mudar, o efeito roda novamente

  return (
    <div className="app-container">
      {usuario && (
        <div className="admin-status-bar">
          <span>● Admin: {usuario.email}</span>
          <button onClick={() => signOut(auth)}>Sair</button>
        </div>
      )}
      <header>
        <h1>Notas Franciscanas</h1>
        {/* CORREÇÃO: Caminho relativo sem a barra inicial */}
        <img src="sao-francisco.png" alt="São Francisco" className="sao-francisco-violino" />

        <nav className="tabs-container">
          <button className={`tab-button ${abaAtiva === 'categorias' ? 'active' : ''}`} onClick={() => handleTrocarAba('categorias')}>
            <Music size={24} /> <span>Categorias</span>
          </button>
          <button className={`tab-button ${abaAtiva === 'busca' ? 'active' : ''}`} onClick={() => handleTrocarAba('busca')}>
            <Search size={24} /> <span>Busca</span>
          </button>
          <button
            className={`tab-button ${abaAtiva === 'missa' ? 'active' : ''}`}
            onClick={() => handleTrocarAba('missa')}
          >
            <ClipboardList size={24} />
            <span>Missa</span>
          </button>
        </nav>
      </header>
      <main>{conteudo}</main>
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