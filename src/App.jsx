import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import ListaCategorias from './components/ListaCategorias';
import ListaMusicas from './components/ListaMusicas';
import DetalheMusica from './components/DetalheMusica';
import FormMusica from './components/FormMusica';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [musicaSelecionada, setMusicaSelecionada] = useState(null); // Usando este nome
  const [musicasFiltradas, setMusicasFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mostrandoAdd, setMostrandoAdd] = useState(false);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

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

  // 2. Atalho de Teclado (Ctrl + Alt + L)
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Verifica se Ctrl e Alt estão pressionados junto com a tecla 'l'
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault(); // Evita comportamentos padrão do navegador
        fazerLogin();
      }
    };

    // Adiciona o evento ao carregar o componente
    window.addEventListener('keydown', handleKeyDown);

    // Remove o evento ao desmontar o componente (limpeza)
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categoria);
  };

  const handleMusicaClick = (id) => {
    const musica = musicasFiltradas.find(m => m.id === id);
    setMusicaSelecionada(musica);
  };

  const handleMusicaVoltar = () => {
    setMusicaSelecionada(null); // Corrigido o nome da função
  };

  const handleCategoriaVoltar = () => {
    setCategoriaSelecionada(null);
    setMusicaSelecionada(null); // Corrigido o nome da função
  };

  const salvarNovaMusica = async (novaMusica) => {
    try {
      await addDoc(collection(db, "musicas"), novaMusica);
      setMostrandoAdd(false);
      alert("Música adicionada com sucesso!");
      // Opcional: recarregar músicas da categoria atual
    } catch (e) { alert("Erro ao salvar."); }
  };

  const adicionarMusica = async () => {
    const titulo = prompt("Título da música:");
    const numero = parseInt(prompt("Número da música:"));
    const pagina = parseInt(prompt("Página na apostila:"));
    const letra = prompt("Letra da música:");

    if (titulo && numero && categoriaSelecionada) {
      try {
        await addDoc(collection(db, "musicas"), {
          titulo,
          numero,
          pagina,
          letra,
          categoria: categoriaSelecionada // Salva na categoria que você está visualizando
        });
        alert("Música adicionada!");
        // Opcional: recarregar a lista ou buscar novamente
      } catch (error) {
        alert("Erro ao adicionar: " + error.message);
      }
    }
  };

  let conteudo;

  if (categoriaSelecionada && musicaSelecionada) {
    conteudo = (
      <DetalheMusica
        musica={musicaSelecionada}
        onVoltar={handleMusicaVoltar}
        isAdmin={!!usuario} // Adicione esta linha para enviar a permissão
      />
    );

  } else if (categoriaSelecionada && !musicaSelecionada) {
    conteudo = (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <button onClick={handleCategoriaVoltar}>&larr; Voltar para Categorias</button>

          {/* Botão de Adicionar que só aparece para Admin */}
          {usuario && (
            <button
              onClick={() => setMostrandoAdd(true)} // MUDADO: agora ele ativa o Modal
              style={{ backgroundColor: '#2ecc71', color: 'white', margin: '0' }}
            >
              + Adicionar Música
            </button>
          )}
        </div>

        {carregando ? (
          <p>Carregando músicas...</p>
        ) : (
          <ListaMusicas
            categoria={categoriaSelecionada}
            musicas={musicasFiltradas}
            onMusicaClick={handleMusicaClick}
          />

        )}
        {mostrandoAdd && (
          <FormMusica
            tituloModal="Nova Música"
            musicaInicial={{ categoria: categoriaSelecionada }}
            onSubmit={salvarNovaMusica}
            onCancel={() => setMostrandoAdd(false)}
          />
        )}
      </div>
    );

  } else {
    conteudo = <ListaCategorias onCategoriaClick={handleCategoriaClick} />;
  }

  return (
    <div className="app-container">
      {/* Barra de Status do Administrador */}
      {usuario && (
        <div className="admin-status-bar">
          <span>● Modo Administrador Ativo ({usuario.email})</span>
          <button onClick={() => signOut(auth)}>Sair</button>
        </div>
      )}
      <header>
        <h1>Notas Franciscanas</h1>
        <img src="public/sao-francisco.png" alt="São Francisco" className="sao-francisco-violino" />
      </header>
      <main>
        {conteudo}
      </main>
    </div>
  );
}

export default App;