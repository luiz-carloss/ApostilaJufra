import React, { useState } from 'react';
import categorias from '../data/categorias.json';

function FormMusica({ musicaInicial, onSubmit, onCancel, tituloModal }) {
  const [formData, setFormData] = useState(musicaInicial || {
    titulo: '',
    numero: '',
    pagina: '',
    categoria: categorias[0],
    letra: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      numero: Number(formData.numero),
      pagina: Number(formData.pagina)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{tituloModal}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} required />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Número</label>
              <input type="number" name="numero" value={formData.numero} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Página</label>
              <input type="number" name="pagina" value={formData.pagina} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange}>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Letra</label>
            <textarea name="letra" rows="8" value={formData.letra} onChange={handleChange} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn-confirm">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormMusica;