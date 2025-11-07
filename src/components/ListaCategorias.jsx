// src/components/ListaCategorias.jsx
import React from 'react';

function ListaCategorias({ musicas, onCategoriaClick }) {

  // "Magia": Pega todas as músicas, mapeia para pegar só a categoria,
  // e o 'Set' remove as duplicadas. O '...' transforma de volta em array.
  const categorias = [...new Set(musicas.map(m => m.categoria))];

  return (
    <div>
      <h2>Categorias</h2>
      <ul>
        {categorias.map(categoria => (
          <li key={categoria} onClick={() => onCategoriaClick(categoria)}>
            {categoria}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaCategorias;