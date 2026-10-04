import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

// =========================================================================
// CONFIGURAÇÃO OFICIAL DO FIREBASE (Hélio & Margarida - Projeto Próprio)
// =========================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyArmHi35diuegNcCZbv7V0-LAsC1xQcefA",
  authDomain: "helio-e-margarida.firebaseapp.com",
  projectId: "helio-e-margarida",
  storageBucket: "helio-e-margarida.firebasestorage.app",
  messagingSenderId: "341458962991",
  appId: "1:341458962991:web:d5d3386e2e242b1901d4da",
  measurementId: "G-BBED9FZ772"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const isFirebaseReady = true;

console.log("🔥 Firebase Firestore conectado com sucesso para Hélio & Margarida!");

export { db, isFirebaseReady };

// =========================================================================
// 1. CONFIRMAÇÕES DE PRESENÇA (rsvps)
// =========================================================================

export async function saveRsvpToFirestore(rsvpData) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'rsvps'), {
      ...rsvpData,
      createdAt: serverTimestamp(),
      createdDate: new Date().toLocaleString('pt-MZ')
    });
    console.log("✅ RSVP gravado com sucesso no Firebase:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("❌ Erro ao guardar RSVP no Firebase Firestore:", err);
    throw err;
  }
}

export function subscribeToRsvps(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const rsvps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(rsvps);
    }, (err) => {
      console.error("❌ Erro na sincronização de RSVPs do Firebase:", err);
      // fallback to basic query without orderBy if index not ready
      const fallbackQ = collection(db, 'rsvps');
      return onSnapshot(fallbackQ, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(list);
      }, () => callback([]));
    });
  } catch (err) {
    console.error("❌ Erro ao inicializar subscrição de RSVPs:", err);
    callback([]);
    return () => {};
  }
}

export async function deleteRsvpFromFirestore(id) {
  if (!db || !id) return;
  try {
    await deleteDoc(doc(db, 'rsvps', id));
    console.log("✅ RSVP eliminado do Firebase:", id);
  } catch (err) {
    console.error("❌ Erro ao eliminar RSVP no Firebase:", err);
    throw err;
  }
}

// =========================================================================
// 2. MURAL DE MENSAGENS (messages)
// =========================================================================

export async function saveMessageToFirestore(messageData) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: serverTimestamp(),
      createdDate: new Date().toLocaleString('pt-MZ')
    });
    console.log("✅ Mensagem gravada no Firebase:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("❌ Erro ao guardar mensagem no Firebase:", err);
    throw err;
  }
}

export function subscribeToMessages(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    }, (err) => {
      console.error("❌ Erro na sincronização de Mensagens do Firebase:", err);
      const fallbackQ = collection(db, 'messages');
      return onSnapshot(fallbackQ, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(list);
      }, () => callback([]));
    });
  } catch (err) {
    console.error("❌ Erro ao subscrever mensagens:", err);
    callback([]);
    return () => {};
  }
}

// =========================================================================
// 3. GESTÃO DE MESAS E ALOCAÇÕES (settings)
// =========================================================================

export async function syncTablesToFirestore(tablesArray) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'settings', 'tables_data'), {
      tables: tablesArray,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("❌ Erro ao sincronizar mesas no Firebase:", err);
  }
}

export function subscribeToTables(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }

  return onSnapshot(doc(db, 'settings', 'tables_data'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().tables || []);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("❌ Erro ao ouvir mesas no Firebase:", err);
    callback(null);
  });
}

export async function syncSeatingAssignmentsToFirestore(assignmentsObj) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'settings', 'seating_assignments'), {
      assignments: assignmentsObj,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("❌ Erro ao sincronizar alocações no Firebase:", err);
  }
}

export function subscribeToSeatingAssignments(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }

  return onSnapshot(doc(db, 'settings', 'seating_assignments'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().assignments || {});
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("❌ Erro ao ouvir alocações no Firebase:", err);
    callback(null);
  });
}

export async function syncManualGuestsToFirestore(manualGuestsArray) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'settings', 'manual_guests'), {
      guests: manualGuestsArray,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("❌ Erro ao sincronizar convidados manuais no Firebase:", err);
  }
}

export function subscribeToManualGuests(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }

  return onSnapshot(doc(db, 'settings', 'manual_guests'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().guests || []);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("❌ Erro ao ouvir convidados manuais no Firebase:", err);
    callback(null);
  });
}
