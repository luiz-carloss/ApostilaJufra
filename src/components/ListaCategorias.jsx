// src/components/ListaCategorias.jsx
import React from 'react';
import categorias from '../data/categorias.json'; // 1. Importa a nova lista fixa

// 2. Não precisa mais receber 'musicas' como prop
function ListaCategorias({ onCategoriaClick }) {

  // 3. A lógica de 'Set' foi removida.
  //    Agora ele apenas lê a lista do JSON.

  return (
    <div>
      <h2>Categorias</h2>
      <ul>
        {/* 4. Mapeia a lista fixa */}
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