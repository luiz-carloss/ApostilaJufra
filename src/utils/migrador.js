import { db } from '../firebaseConfig'; // Certifique-se que o caminho está correto
import musicas from '../data/musicas.json'; 
import { collection, addDoc } from "firebase/firestore";

export const migrarDadosParaFirebase = async () => {
  console.log("A iniciar migração...");
  
  try {
    for (const musica of musicas) {
      const { id, ...dadosMusica } = musica; 
      
      await addDoc(collection(db, "musicas"), dadosMusica);
      console.log(`Sucesso: ${musica.titulo}`);
    }
    alert("Migração concluída com sucesso!");
  } catch (error) {
    console.error("Erro durante a migração:", error);
    alert("Ocorreu um erro. Verifique a consola.");
  }
};