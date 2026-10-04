import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDocs,
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase Firestore Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBCUfbXDZss5-9vsHz-y7mh-PLfjq-bd2g",
  authDomain: "alberto-e-liesa.firebaseapp.com",
  projectId: "alberto-e-liesa",
  storageBucket: "alberto-e-liesa.firebasestorage.app",
  messagingSenderId: "943796554139",
  appId: "1:943796554139:web:2dc1ce59f701b20861f93e",
  measurementId: "G-CCML3HQB9E"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const isFirebaseReady = true;

console.log("🔥 Firebase Firestore connected successfully for Hélio & Margarida!");

export { db, isFirebaseReady };

// =========================================================================
// 1. RSVP CONFIRMATIONS (helio_rsvps)
// =========================================================================

export async function saveRsvpToFirestore(rsvpData) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'helio_rsvps'), {
      ...rsvpData,
      createdAt: serverTimestamp(),
      createdDate: new Date().toLocaleString('pt-MZ')
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao guardar RSVP no Firebase Firestore:", err);
    throw err;
  }
}

export function subscribeToRsvps(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, 'helio_rsvps'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const rsvps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(rsvps);
  }, (err) => {
    console.error("Erro na sincronização de RSVPs do Firebase:", err);
    // Fallback gracefully to empty array
    callback([]);
  });
}

export async function deleteRsvpFromFirestore(id) {
  if (!db || !id) return;
  try {
    await deleteDoc(doc(db, 'helio_rsvps', id));
  } catch (err) {
    console.error("Erro ao eliminar RSVP no Firebase:", err);
    throw err;
  }
}

// =========================================================================
// 2. MESSAGE WALL (helio_messages)
// =========================================================================

export async function saveMessageToFirestore(messageData) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'helio_messages'), {
      ...messageData,
      createdAt: serverTimestamp(),
      createdDate: new Date().toLocaleString('pt-MZ')
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao guardar mensagem no Firebase:", err);
    throw err;
  }
}

export function subscribeToMessages(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, 'helio_messages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  }, (err) => {
    console.error("Erro na sincronização de Mensagens do Firebase:", err);
    callback([]);
  });
}

// =========================================================================
// 3. TABLES & SEATING MANAGEMENT (helio_tables & helio_seating)
// =========================================================================

export async function syncTablesToFirestore(tablesArray) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'helio_settings', 'tables_data'), {
      tables: tablesArray,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Erro ao sincronizar mesas no Firebase:", err);
  }
}

export function subscribeToTables(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }

  return onSnapshot(doc(db, 'helio_settings', 'tables_data'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().tables || []);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("Erro ao ouvir mesas no Firebase:", err);
    callback(null);
  });
}

export async function syncSeatingAssignmentsToFirestore(assignmentsObj) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'helio_settings', 'seating_assignments'), {
      assignments: assignmentsObj,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Erro ao sincronizar alocações no Firebase:", err);
  }
}

export function subscribeToSeatingAssignments(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }

  return onSnapshot(doc(db, 'helio_settings', 'seating_assignments'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().assignments || {});
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("Erro ao ouvir alocações no Firebase:", err);
    callback(null);
  });
}

export async function syncManualGuestsToFirestore(manualGuestsArray) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'helio_settings', 'manual_guests'), {
      guests: manualGuestsArray,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Erro ao sincronizar convidados manuais no Firebase:", err);
  }
}

export function subscribeToManualGuests(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }

  return onSnapshot(doc(db, 'helio_settings', 'manual_guests'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().guests || []);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("Erro ao ouvir convidados manuais no Firebase:", err);
    callback(null);
  });
}
