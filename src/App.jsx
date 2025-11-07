// src/App.jsx
import React, { useState } from 'react';
import musicas from './data/musicas.json';
import ListaMusicas from './components/ListaMusicas';
import DetalheMusica from './components/DetalheMusica';
import './App.css'; // Importando nosso CSS

function App() {
  // 1. Nosso novo 'estado'. Se for 'null', mostra a lista. 
  //    Se for um ID (ex: 1), mostra o detalhe.
  const [musicaIdSelecionada, setMusicaIdSelecionada] = useState(null);

  // 2. Funções para controlar o estado
  const handleMusicaClick = (id) => {
    setMusicaIdSelecionada(id);
  };

  const handleVoltar = () => {
    setMusicaIdSelecionada(null);
  };

  // 3. Lógica de renderização
  let conteudo;
  if (musicaIdSelecionada) {
    // Se temos um ID, achamos a música completa
    const musica = musicas.find(m => m.id === musicaIdSelecionada);
    conteudo = <DetalheMusica musica={musica} onVoltar={handleVoltar} />;
  } else {
    // Se não temos ID (é null), mostramos a lista
    conteudo = <ListaMusicas musicas={musicas} onMusicaClick={handleMusicaClick} />;
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