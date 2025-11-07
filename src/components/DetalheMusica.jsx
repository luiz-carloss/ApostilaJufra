// src/components/DetalheMusica.jsx
import React from 'react';

function DetalheMusica({ musica, onVoltar }) {
  return (
    <div>
      <button onClick={onVoltar}>&larr; Voltar</button>
      <h2>{musica.titulo}</h2>
      <p className="letra-musica">
        {musica.letra}
      </p>
    </div>
  );
}

export default DetalheMusica;