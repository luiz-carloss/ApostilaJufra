import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Search as SearchIcon, Hash, BookOpen } from 'lucide-react';

function BuscaMusica({ onMusicaClick }) {
  const [todasMusicas, setTodasMusicas] = useState([]);
  const [termoTexto, setTermoTexto] = useState('');
  const [termoNumero, setTermoNumero] = useState('');
  const [termoPagina, setTermoPagina] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarTudo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "musicas"));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTodasMusicas(docs);
      } catch (e) {
        console.error("Erro na busca:", e);
      } finally {
        setCarregando(false);
      }
    };
    buscarTudo();
  }, []);

  useEffect(() => {
    // Só filtra se pelo menos um campo tiver conteúdo
    if (termoTexto === '' && termoNumero === '' && termoPagina === '') {
      setResultados([]);
      return;
    }

    const filtrados = todasMusicas.filter(m => {
      // Filtro de Texto (Título ou Letra)
      const matchTexto = termoTexto === '' || 
        m.titulo.toLowerCase().includes(termoTexto.toLowerCase()) ||
        m.letra.toLowerCase().includes(termoTexto.toLowerCase());

      // Filtro de Número (exato)
      const matchNumero = termoNumero === '' || m.numero.toString() === termoNumero;

      // Filtro de Página (exato)
      const matchPagina = termoPagina === '' || m.pagina.toString() === termoPagina;

      // A música deve passar em todos os filtros ativos (Lógica AND)
      return matchTexto && matchNumero && matchPagina;
    });

    setResultados(filtrados.sort((a, b) => a.numero - b.numero));
  }, [termoTexto, termoNumero, termoPagina, todasMusicas]);

  if (carregando) return <p>Carregando base de busca...</p>;

  return (
    <div className="busca-container">
      {/* Campo de Título/Trecho */}
      <div className="search-input-wrapper">
        <SearchIcon className="search-icon-inside" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por Título ou Trecho da letra..."
          value={termoTexto}
          onChange={(e) => setTermoTexto(e.target.value)}
        />
      </div>

      {/* Campos de Número e Página Lado a Lado */}
      <div className="search-row">
        <div className="search-input-wrapper small">
          <Hash className="search-icon-inside" size={18} />
          <input 
            type="number" 
            placeholder="Nº"
            value={termoNumero}
            onChange={(e) => setTermoNumero(e.target.value)}
          />
        </div>
        <div className="search-input-wrapper small">
          <BookOpen className="search-icon-inside" size={18} />
          <input 
            type="number" 
            placeholder="Página"
            value={termoPagina}
            onChange={(e) => setTermoPagina(e.target.value)}
          />
        </div>
      </div>

      <div className="search-results">
        {resultados.length > 0 ? (
          <ul>
            {resultados.map(musica => (
              <li key={musica.id} onClick={() => onMusicaClick(musica)}>
                <div className="result-item">
                  <span className="result-number">#{musica.numero}</span>
                  <div className="result-info">
                    <span className="result-title">{musica.titulo}</span>
                    <span className="result-meta">
                      Pág. {musica.pagina} | {musica.categoria}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (termoTexto !== '' || termoNumero !== '' || termoPagina !== '') && (
          <p className="no-results">Nenhuma música encontrada com esses critérios.</p>
        )}
      </div>
    </div>
  );
}

export default BuscaMusica;