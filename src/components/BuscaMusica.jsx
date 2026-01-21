import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Search as SearchIcon, Hash, BookOpen, Type } from 'lucide-react';

function BuscaMusica({ onMusicaClick }) {
    const [todasMusicas, setTodasMusicas] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [resultados, setResultados] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // Carrega todas as músicas do Firebase uma única vez
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

    // Lógica de Filtro Triple-Match
    useEffect(() => {
        if (termoBusca.trim() === '') {
            setResultados([]);
            return;
        }

        const termo = termoBusca.toLowerCase();
        const filtrados = todasMusicas.filter(m => {
            const matchTitulo = m.titulo.toLowerCase().includes(termo);
            const matchLetra = m.letra.toLowerCase().includes(termo);
            // Busca por número ou página (tratando como string)
            const matchNumeroOuPagina =
                m.numero.toString() === termo ||
                m.pagina.toString() === termo;

            return matchTitulo || matchLetra || matchNumeroOuPagina;
        });

        setResultados(filtrados.sort((a, b) => a.numero - b.numero));
    }, [termoBusca, todasMusicas]);

    if (carregando) return <p>Carregando base de busca...</p>;

    return (
        <div className="busca-container">
            <div className="search-input-wrapper">
                <SearchIcon className="search-icon-inside" size={20} />
                <input
                    type="text"
                    placeholder="Título, número, página ou trecho..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    autoFocus
                />
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
                                            <BookOpen size={12} /> Pág. {musica.pagina} | {musica.categoria}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : termoBusca !== '' && (
                    <p className="no-results">Nenhuma música encontrada para "{termoBusca}"</p>
                )}
            </div>
        </div>
    );
}

export default BuscaMusica;