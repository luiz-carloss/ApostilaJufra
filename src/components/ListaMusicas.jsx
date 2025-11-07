// src/components/ListaMusicas.jsx
import React from 'react';

function ListaMusicas({ musicas, onMusicaClick }) {
  return (
    <div>
      <h2>Músicas</h2>

      {/* Verifica se a lista de musicas tem 0 itens */}
      {musicas.length > 0 ? (
        <ul>
          {musicas.map(musica => (
            <li key={musica.id} onClick={() => onMusicaClick(musica.id)}>
              {musica.titulo}
            </li>
          ))}
        </ul>
      ) : (
        // Mostra essa mensagem se a lista estiver vazia
        <p>Nenhuma música cadastrada nesta categoria ainda.</p>
      )}

    </div>
  );
}

export default ListaMusicas;