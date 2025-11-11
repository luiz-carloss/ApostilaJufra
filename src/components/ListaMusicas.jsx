// src/components/ListaMusicas.jsx
import React from 'react';

// Recebendo a 'categoria' como prop (da nossa última mudança)
function ListaMusicas({ categoria, musicas, onMusicaClick }) {
  return (
    <div>
      <h2>{categoria}</h2> 

      {musicas.length > 0 ? (
        <ul>
          {musicas.map(musica => (
            <li key={musica.id} onClick={() => onMusicaClick(musica.id)}>
              {/* MUDANÇA AQUI: Mostra o número */}
              {musica.numero}. {musica.titulo}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma música cadastrada nesta categoria ainda.</p>
      )}

    </div>
  );
}

export default ListaMusicas;