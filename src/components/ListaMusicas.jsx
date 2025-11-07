// src/components/ListaMusicas.jsx
import React from 'react';

function ListaMusicas({ musicas, onMusicaClick }) {
  return (
    <div>
      <h2>Músicas</h2>
      <ul>
        {musicas.map(musica => (
          <li key={musica.id} onClick={() => onMusicaClick(musica.id)}>
            {musica.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaMusicas;