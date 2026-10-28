import { db } from "./firebase-init.js";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const col = collection(db, 'reservas');
export function observarReservas(userId, callback){
  const q = query(col, where('userId', '==', userId));
  return onSnapshot(q, snap => callback(
    snap.docs.map(d => ({ id:d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  ));
}
export function criarReserva(user, dados){
  return addDoc(col, { ...dados, userId:user.uid, userEmail:user.email, estado: dados.estado || 'Pendente', createdAt:serverTimestamp(), updatedAt:serverTimestamp() });
}
export function atualizarReserva(id, dados){ return updateDoc(doc(db, 'reservas', id), { ...dados, updatedAt:serverTimestamp() }); }
export function apagarReserva(id){ return deleteDoc(doc(db, 'reservas', id)); }

