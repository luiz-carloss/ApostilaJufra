// src/components/DetalheMusica.jsx
import React from 'react';

function DetalheMusica({ musica, onVoltar }) {
  return (
    <div>
      <button onClick={onVoltar}>&larr; Voltar</button>

      {/* MUDANÇA AQUI: Título principal */}
      <h2>{musica.titulo}</h2>

      {/* MUDANÇA AQUI: Informação de página e número */}
      <p className="info-pagina">(Pág. {musica.pagina}, N. {musica.numero})</p>

      <p className="letra-musica">
        {musica.letra}
      </p>
    </div>
  );
}

export default DetalheMusica;