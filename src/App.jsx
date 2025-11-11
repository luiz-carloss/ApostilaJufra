// src/App.jsx
import React, { useState } from 'react';
import musicas from './data/musicas.json';
import categorias from './data/categorias.json';
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
    
    // Pegando o ajuste que fizemos na mensagem anterior
    // para mostrar o título da categoria
    conteudo = (
      <div>
        <button onClick={handleCategoriaVoltar}>&larr; Voltar para Categorias</button>
        <ListaMusicas 
          categoria={categoriaSelecionada} 
          musicas={musicasFiltradas} 
          onMusicaClick={handleMusicaClick} 
        />
      </div>
    );

  } else {
    conteudo = <ListaCategorias onCategoriaClick={handleCategoriaClick} />;
  }

  return (
    <div className="app-container"> 
      <header>
        <h1>Notas Franciscanas</h1>
        
        <img src="public/sao-francisco.png" alt="São Francisco com violino de gravetos" className="sao-francisco-violino" />
      
      </header>
      
      <main>
        {conteudo}
      </main>
    </div>
  );
}

export default App;