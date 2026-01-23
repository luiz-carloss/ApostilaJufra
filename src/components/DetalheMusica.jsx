// src/components/DetalheMusica.jsx
import React, { useState } from 'react'; // ADICIONADO useState AQUI
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import FormMusica from './FormMusica';

function DetalheMusica({ musica, onVoltar, isAdmin }) {
  // Agora o useState funcionará corretamente
  const [editando, setEditando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const salvarEdicao = async (dadosAtualizados) => {
    try {
      await updateDoc(doc(db, "musicas", musica.id), dadosAtualizados);
      setEditando(false);
      alert("Música atualizada!");
      onVoltar();
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar.");
    }
  };

  const formatarTexto = (texto) => {
    if (!texto) return "";

    // Essa regex procura tudo que está entre ** ** e coloca dentro de <strong>
    const partes = texto.split(/(\*\*.*?\*\*)/g);

    return partes.map((parte, index) => {
      if (parte.startsWith('**') && parte.endsWith('**')) {
        return <strong key={index}>{parte.slice(2, -2)}</strong>;
      }
      return parte;
    });
  };

  const confirmarExclusao = async () => {
    try {
      await deleteDoc(doc(db, "musicas", musica.id));
      onVoltar();
    } catch (e) {
      alert("Erro ao excluir. Verifique as permissões.");
    }
  };

  return (
    <div>
      <button onClick={onVoltar}>&larr; Voltar</button>
      <h2>{musica.titulo}</h2>
      <p className="info-pagina">(Pág. {musica.pagina}, N. {musica.numero} - {musica.categoria})</p>

      {isAdmin && (
        <div className="admin-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setEditando(true)}>Editar Tudo</button>
          <button onClick={() => setConfirmandoExclusao(true)} style={{ backgroundColor: '#e74c3c' }}>Excluir</button>
        </div>
      )}

      <p className="letra-musica" style={{ whiteSpace: 'pre-wrap' }}>
        {formatarTexto(musica.letra)}
      </p>

      {editando && (
        <FormMusica
          tituloModal="Editar Música"
          musicaInicial={musica}
          onSubmit={salvarEdicao}
          onCancel={() => setEditando(false)}
        />
      )}

      {confirmandoExclusao && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Excluir Música?</h3>
            <p>Tem certeza que deseja apagar "<strong>{musica.titulo}</strong>"?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmandoExclusao(false)}>Cancelar</button>
              <button className="btn-delete" onClick={confirmarExclusao}>Excluir permanentemente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetalheMusica;