// src/App.jsx
import React, { useState } from 'react';
import musicas from './data/musicas.json';
import ListaCategorias from './components/ListaCategorias'; // Importamos o novo
import ListaMusicas from './components/ListaMusicas';
import DetalheMusica from './components/DetalheMusica';
import './App.css';

function App() {
  // 1. Nossos DOIS estados de navegação
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [musicaIdSelecionada, setMusicaIdSelecionada] = useState(null);

  // 2. Funções de controle
  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categoria);
  };

  const handleMusicaClick = (id) => {
    setMusicaIdSelecionada(id);
  };

  // "Voltar" do Detalhe da Música (volta para a Lista de Músicas)
  const handleMusicaVoltar = () => {
    setMusicaIdSelecionada(null);
  };

  // "Voltar" da Lista de Músicas (volta para a Lista de Categorias)
  const handleCategoriaVoltar = () => {
    setCategoriaSelecionada(null);
    setMusicaIdSelecionada(null); // Garante que a música zere também
  };

  // 3. Lógica de renderização
  let conteudo;

  if (categoriaSelecionada && musicaIdSelecionada) {
    // NÍVEL 3: Mostra o detalhe da música
    const musica = musicas.find(m => m.id === musicaIdSelecionada);
    conteudo = <DetalheMusica musica={musica} onVoltar={handleMusicaVoltar} />;

  } else if (categoriaSelecionada && !musicaIdSelecionada) {
    // NÍVEL 2: Mostra a lista de músicas da categoria
    const musicasFiltradas = musicas.filter(m => m.categoria === categoriaSelecionada);

    conteudo = (
      <div>
        <button onClick={handleCategoriaVoltar}>&larr; Voltar para Categorias</button>
        <ListaMusicas musicas={musicasFiltradas} onMusicaClick={handleMusicaClick} />
      </div>
    );

  } else {
    // NÍVEL 1 (Inicial): Mostra a lista de categorias
    conteudo = <ListaCategorias musicas={musicas} onCategoriaClick={handleCategoriaClick} />;
  }

  return (
    <div>
      <header>
        <h1>APPostila Jufra</h1>
      </header>

      <main>
        {conteudo}
      </main>
    </div>
  );
}

export default App;