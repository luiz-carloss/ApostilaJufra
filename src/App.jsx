// src/App.jsx
import React, { useState } from 'react';
import musicas from './data/musicas.json';
import categorias from './data/categorias.json'; // Importa a lista de categorias
import ListaCategorias from './components/ListaCategorias';
import ListaMusicas from './components/ListaMusicas';
import DetalheMusica from './components/DetalheMusica';
import './App.css';

function App() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [musicaIdSelecionada, setMusicaIdSelecionada] = useState(null);

  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categoria);
  };

  const handleMusicaClick = (id) => {
    setMusicaIdSelecionada(id);
  };

  const handleMusicaVoltar = () => {
    setMusicaIdSelecionada(null);
  };

  const handleCategoriaVoltar = () => {
    setCategoriaSelecionada(null);
    setMusicaIdSelecionada(null); 
  };

  let conteudo;

  if (categoriaSelecionada && musicaIdSelecionada) {
    const musica = musicas.find(m => m.id === musicaIdSelecionada);
    conteudo = <DetalheMusica musica={musica} onVoltar={handleMusicaVoltar} />;

  } else if (categoriaSelecionada && !musicaIdSelecionada) {
    const musicasFiltradas = musicas.filter(m => m.categoria === categoriaSelecionada);
    
    conteudo = (
      <div>
        <button onClick={handleCategoriaVoltar}>&larr; Voltar para Categorias</button>
        <ListaMusicas musicas={musicasFiltradas} onMusicaClick={handleMusicaClick} />
      </div>
    );

  } else {
    // A prop 'musicas' foi removida daqui
    conteudo = <ListaCategorias onCategoriaClick={handleCategoriaClick} />;
  }

  return (
    // 👇 ADICIONAMOS ESTE CONTAINER PARA CENTRALIZAR TUDO
    <div className="app-container"> 
      <header>
        {/* 👇 MUDAMOS O TÍTULO AQUI */}
        <h1>Notas Franciscanas</h1>
        <img src="/sao-francisco.png" alt="São Francisco com violino de gravetos" className="sao-francisco-violino" />
      </header>
      
      <main>
        {conteudo}
      </main>
    </div>
  );
}

export default App;