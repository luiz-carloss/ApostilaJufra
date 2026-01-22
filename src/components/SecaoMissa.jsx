import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Hash, BookOpen, Type, Eye, ExternalLink } from 'lucide-react';

const camposMissa = [
  "Mantra", "Entrada", "Ato Penitencial", "Glória", "Aclamação", 
  "Ofertório", "Santo", "Amém", "Cordeiro", "Comunhão", "Comunhão 2", "Final"
];

function SecaoMissa({ onVerMusica }) {
  const [todasMusicas, setTodasMusicas] = useState([]);
  const [anotacoes, setAnotacoes] = useState(() => {
    const salvo = localStorage.getItem('anotacoesMissa');
    return salvo ? JSON.parse(salvo) : camposMissa.reduce((acc, campo) => {
      acc[campo] = { texto: '', numero: '', pagina: '', tipo: 'texto' };
      return acc;
    }, {});
  });

  // Carrega músicas para o "Link Inteligente"
  useEffect(() => {
    const carregar = async () => {
      const snap = await getDocs(collection(db, "musicas"));
      setTodasMusicas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    carregar();
  }, []);

  useEffect(() => {
    localStorage.setItem('anotacoesMissa', JSON.stringify(anotacoes));
  }, [anotacoes]);

  const handleChange = (campo, chave, valor) => {
    setAnotacoes(prev => ({ ...prev, [campo]: { ...prev[campo], [chave]: valor } }));
  };

  // Função que encontra a música correspondente
  const encontrarMusica = (n, p) => {
    return todasMusicas.find(m => m.numero.toString() === n && m.pagina.toString() === p);
  };

  return (
    <div className="missa-container">
      <div className="missa-header">
        <h2>Papel na Parede</h2>
        <button onClick={() => setAnotacoes(camposMissa.reduce((acc, c) => {
          acc[c] = { texto: '', numero: '', pagina: '', tipo: 'texto' }; return acc;
        }, {}))} className="btn-limpar">Limpar</button>
      </div>

      <div className="missa-grid">
        {camposMissa.map(campo => {
          const musicaEncontrada = encontrarMusica(anotacoes[campo].numero, anotacoes[campo].pagina);
          
          return (
            <div key={campo} className="missa-row">
              <div className="missa-label">
                <label>{campo}:</label>
                <button onClick={() => handleChange(campo, 'tipo', anotacoes[campo].tipo === 'texto' ? 'numero' : 'texto')} className="btn-toggle">
                  {anotacoes[campo].tipo === 'texto' ? <Type size={16}/> : <Hash size={16}/>}
                </button>
              </div>

              <div className="missa-inputs">
                {anotacoes[campo].tipo === 'texto' ? (
                  <input
                    type="text"
                    placeholder="Nome da música..."
                    value={anotacoes[campo].texto}
                    onChange={(e) => handleChange(campo, 'texto', e.target.value)}
                  />
                ) : (
                  <div className="input-group-missa">
                    <input
                      type="number"
                      placeholder="Pág"
                      className="input-missa-small"
                      value={anotacoes[campo].pagina}
                      onChange={(e) => handleChange(campo, 'pagina', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Nº"
                      className="input-missa-small"
                      value={anotacoes[campo].numero}
                      onChange={(e) => handleChange(campo, 'numero', e.target.value)}
                    />
                    
                    {/* LINK INTELIGENTE */}
                    {musicaEncontrada && (
                      <button 
                        className="btn-ver-musica"
                        onClick={() => onVerMusica(musicaEncontrada)}
                        title={musicaEncontrada.titulo}
                      >
                        <Eye size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SecaoMissa;