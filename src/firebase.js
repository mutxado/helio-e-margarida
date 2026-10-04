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
// 1. CLOUD STORAGE ENGINE (High-Availability REST Cloud DB)
// =========================================================================
const MASTER_CLOUD_ID = 'ff808181a09d98f701a1073296b573bd';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${MASTER_CLOUD_ID}`;

// In-memory cache
let memoryCache = {
  rsvps: [],
  messages: [],
  tables: [
    { id: 'table-1', name: 'Mesa 1 - Noivos & Pais', capacity: 10 },
    { id: 'table-2', name: 'Mesa 2 - Padrinhos & Damas', capacity: 10 },
    { id: 'table-3', name: 'Mesa 3 - Família do Noivo', capacity: 10 },
    { id: 'table-4', name: 'Mesa 4 - Família da Noiva', capacity: 10 },
    { id: 'table-5', name: 'Mesa 5 - Amigos de Infância', capacity: 10 }
  ],
  seatingAssignments: {},
  manualGuests: []
};

// Fetch latest master store from cloud
async function fetchCloudStore() {
  try {
    const res = await fetch(CLOUD_API_URL, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        memoryCache = {
          ...memoryCache,
          ...json.data
        };
        return memoryCache;
      }
    }
  } catch (err) {
    console.warn('Cloud store fetch warning:', err.message);
  }
  return memoryCache;
}

// Update master store in cloud
async function updateCloudStore(partialData) {
  try {
    const current = await fetchCloudStore();
    const updated = {
      ...current,
      ...partialData
    };
    memoryCache = updated;

    await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Helio e Margarida Wedding Cloud Database',
        data: updated
      })
    });
    return updated;
  } catch (err) {
    console.warn('Cloud store update warning:', err.message);
    return memoryCache;
  }
}

// =========================================================================
// 2. FIREBASE FIRESTORE ENGINE (Optional / Complementary)
// =========================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyBCUfbXDZss5-9vsHz-y7mh-PLfjq-bd2g",
  authDomain: "alberto-e-liesa.firebaseapp.com",
  projectId: "alberto-e-liesa",
  storageBucket: "alberto-e-liesa.firebasestorage.app",
  messagingSenderId: "943796554139",
  appId: "1:943796554139:web:2dc1ce59f701b20861f93e",
  measurementId: "G-CCML3HQB9E"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.log('Firebase init notice:', e.message);
}

const isFirebaseReady = true;
export { db, isFirebaseReady };

// =========================================================================
// 3. RSVP CONFIRMATIONS
// =========================================================================

export async function saveRsvpToFirestore(rsvpData) {
  const rsvpId = `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const item = {
    id: rsvpId,
    ...rsvpData,
    createdDate: new Date().toLocaleString('pt-MZ')
  };

  // 1. Save to Cloud API
  try {
    const current = await fetchCloudStore();
    const existing = current.rsvps || [];
    const updatedRsvps = [item, ...existing.filter(r => r.name !== item.name || r.id !== item.id)];
    await updateCloudStore({ rsvps: updatedRsvps });
  } catch (e) {
    console.warn('Error saving RSVP to Cloud Store:', e);
  }

  // 2. Try Firestore as well
  if (db) {
    try {
      await addDoc(collection(db, 'helio_rsvps'), {
        ...rsvpData,
        createdAt: serverTimestamp(),
        createdDate: new Date().toLocaleString('pt-MZ')
      });
    } catch (err) {
      // Ignored silently if rules restricted
    }
  }

  return rsvpId;
}

export function subscribeToRsvps(callback) {
  let isMounted = true;

  const pullLatest = async () => {
    if (!isMounted) return;
    const store = await fetchCloudStore();
    const rsvps = store.rsvps || [];
    callback(rsvps);
  };

  // Initial pull
  pullLatest();

  // Real-time polling every 3 seconds
  const interval = setInterval(pullLatest, 3000);

  // Poll on tab focus
  const handleFocus = () => pullLatest();
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);

  return () => {
    isMounted = false;
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleFocus);
  };
}

export async function deleteRsvpFromFirestore(id) {
  if (!id) return;

  // Delete from Cloud Store
  try {
    const current = await fetchCloudStore();
    const updated = (current.rsvps || []).filter(r => r.id !== id);
    await updateCloudStore({ rsvps: updated });
  } catch (e) {
    console.warn('Error deleting RSVP from Cloud Store:', e);
  }

  // Try Firestore delete
  if (db) {
    try {
      await deleteDoc(doc(db, 'helio_rsvps', id));
    } catch (err) {
      // Ignore
    }
  }
}

// =========================================================================
// 4. MESSAGE WALL
// =========================================================================

export async function saveMessageToFirestore(messageData) {
  const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const item = {
    id: msgId,
    ...messageData,
    createdDate: new Date().toLocaleString('pt-MZ')
  };

  try {
    const current = await fetchCloudStore();
    const existing = current.messages || [];
    const updatedMessages = [item, ...existing];
    await updateCloudStore({ messages: updatedMessages });
  } catch (e) {
    console.warn('Error saving message to Cloud Store:', e);
  }

  if (db) {
    try {
      await addDoc(collection(db, 'helio_messages'), {
        ...messageData,
        createdAt: serverTimestamp(),
        createdDate: new Date().toLocaleString('pt-MZ')
      });
    } catch (err) {}
  }

  return msgId;
}

export function subscribeToMessages(callback) {
  let isMounted = true;

  const pullLatest = async () => {
    if (!isMounted) return;
    const store = await fetchCloudStore();
    const messages = store.messages || [];
    callback(messages);
  };

  pullLatest();
  const interval = setInterval(pullLatest, 4000);

  const handleFocus = () => pullLatest();
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);

  return () => {
    isMounted = false;
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleFocus);
  };
}

// =========================================================================
// 5. TABLES & SEATING MANAGEMENT
// =========================================================================

export async function syncTablesToFirestore(tablesArray) {
  try {
    await updateCloudStore({ tables: tablesArray });
  } catch (err) {
    console.warn('Error syncing tables to Cloud Store:', err);
  }

  if (db) {
    try {
      await setDoc(doc(db, 'helio_settings', 'tables_data'), {
        tables: tablesArray,
        updatedAt: serverTimestamp()
      });
    } catch (err) {}
  }
}

export function subscribeToTables(callback) {
  let isMounted = true;

  const pullLatest = async () => {
    if (!isMounted) return;
    const store = await fetchCloudStore();
    if (store.tables && store.tables.length > 0) {
      callback(store.tables);
    }
  };

  pullLatest();
  const interval = setInterval(pullLatest, 4000);

  const handleFocus = () => pullLatest();
  window.addEventListener('focus', handleFocus);

  return () => {
    isMounted = false;
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
  };
}

export async function syncSeatingAssignmentsToFirestore(assignmentsObj) {
  try {
    await updateCloudStore({ seatingAssignments: assignmentsObj });
  } catch (err) {
    console.warn('Error syncing seating assignments to Cloud Store:', err);
  }

  if (db) {
    try {
      await setDoc(doc(db, 'helio_settings', 'seating_assignments'), {
        assignments: assignmentsObj,
        updatedAt: serverTimestamp()
      });
    } catch (err) {}
  }
}

export function subscribeToSeatingAssignments(callback) {
  let isMounted = true;

  const pullLatest = async () => {
    if (!isMounted) return;
    const store = await fetchCloudStore();
    if (store.seatingAssignments) {
      callback(store.seatingAssignments);
    }
  };

  pullLatest();
  const interval = setInterval(pullLatest, 4000);

  const handleFocus = () => pullLatest();
  window.addEventListener('focus', handleFocus);

  return () => {
    isMounted = false;
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
  };
}

export async function syncManualGuestsToFirestore(manualGuestsArray) {
  try {
    await updateCloudStore({ manualGuests: manualGuestsArray });
  } catch (err) {
    console.warn('Error syncing manual guests to Cloud Store:', err);
  }

  if (db) {
    try {
      await setDoc(doc(db, 'helio_settings', 'manual_guests'), {
        guests: manualGuestsArray,
        updatedAt: serverTimestamp()
      });
    } catch (err) {}
  }
}

export function subscribeToManualGuests(callback) {
  let isMounted = true;

  const pullLatest = async () => {
    if (!isMounted) return;
    const store = await fetchCloudStore();
    if (store.manualGuests) {
      callback(store.manualGuests);
    }
  };

  pullLatest();
  const interval = setInterval(pullLatest, 4000);

  const handleFocus = () => pullLatest();
  window.addEventListener('focus', handleFocus);

  return () => {
    isMounted = false;
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
  };
}
