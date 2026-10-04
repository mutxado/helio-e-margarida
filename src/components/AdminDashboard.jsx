import React, { useState, useEffect } from 'react';
import { 
  Lock, Users, User, CheckCircle, XCircle, Search, Download, Trash2, LogOut, 
  ArrowLeft, RefreshCw, Sparkles, LayoutGrid, Plus, Edit3, ArrowRightLeft, 
  Printer, UserPlus, UserMinus, Check, AlertCircle, X, ChevronRight, Hash,
  UserCheck, CornerDownRight
} from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { 
  subscribeToRsvps, 
  deleteRsvpFromFirestore, 
  subscribeToTables, 
  syncTablesToFirestore, 
  subscribeToSeatingAssignments, 
  syncSeatingAssignmentsToFirestore, 
  subscribeToManualGuests, 
  syncManualGuestsToFirestore 
} from '../firebase';

export function AdminDashboard({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState('rsvp'); // 'rsvp' | 'tables'

  // RSVP state
  const [confirmations, setConfirmations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Tables & Seating state
  const [tables, setTables] = useState([]);
  const [manualGuests, setManualGuests] = useState([]);
  const [seatingAssignments, setSeatingAssignments] = useState({}); // { guestId: tableId }
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState('todos'); // 'todos' | 'com_vagas' | 'lotadas'

  // Inline Quick Add inputs per table: { [tableId]: { name: '', seats: 1 } }
  const [quickInputs, setQuickInputs] = useState({});

  // Modal / Form states
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(10);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [batchCount, setBatchCount] = useState(5);
  const [batchCapacity, setBatchCapacity] = useState(10);

  const [isAddManualGuestOpen, setIsAddManualGuestOpen] = useState(false);
  const [manualGuestName, setManualGuestName] = useState('');
  const [manualGuestSeats, setManualGuestSeats] = useState(1);
  const [manualGuestTable, setManualGuestTable] = useState('');

  const [editingTable, setEditingTable] = useState(null);
  const [transferringGuest, setTransferringGuest] = useState(null);

  const ADMIN_PASSWORD = 'helio2026';

  // Load all local cached data
  const loadData = () => {
    try {
      const storedRsvp = JSON.parse(localStorage.getItem('helio_margarida_rsvp_confirmations') || '[]');
      setConfirmations(storedRsvp);

      const storedTables = JSON.parse(localStorage.getItem('helio_margarida_tables') || '[]');
      if (storedTables.length === 0) {
        const defaultTables = [
          { id: 'table-1', name: 'Mesa 1 - Noivos & Pais', capacity: 10 },
          { id: 'table-2', name: 'Mesa 2 - Padrinhos & Damas', capacity: 10 },
          { id: 'table-3', name: 'Mesa 3 - Família do Noivo', capacity: 10 },
          { id: 'table-4', name: 'Mesa 4 - Família da Noiva', capacity: 10 },
          { id: 'table-5', name: 'Mesa 5 - Amigos de Infância', capacity: 10 },
        ];
        setTables(defaultTables);
        localStorage.setItem('helio_margarida_tables', JSON.stringify(defaultTables));
        syncTablesToFirestore(defaultTables);
      } else {
        setTables(storedTables);
      }

      const storedManual = JSON.parse(localStorage.getItem('helio_margarida_manual_guests') || '[]');
      setManualGuests(storedManual);

      const storedAssignments = JSON.parse(localStorage.getItem('helio_margarida_seating_assignments') || '{}');
      setSeatingAssignments(storedAssignments);
    } catch (e) {
      console.log('Error loading admin data:', e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial cache load
    loadData();

    // Live Firebase Cloud Sync Listeners
    const unsubRsvp = subscribeToRsvps((cloudRsvps) => {
      if (cloudRsvps) {
        setConfirmations(cloudRsvps);
        try {
          localStorage.setItem('helio_margarida_rsvp_confirmations', JSON.stringify(cloudRsvps));
        } catch (e) {}
      }
    });

    const unsubTables = subscribeToTables((cloudTables) => {
      if (cloudTables && cloudTables.length > 0) {
        setTables(cloudTables);
        try {
          localStorage.setItem('helio_margarida_tables', JSON.stringify(cloudTables));
        } catch (e) {}
      }
    });

    const unsubSeating = subscribeToSeatingAssignments((cloudSeating) => {
      if (cloudSeating) {
        setSeatingAssignments(cloudSeating);
        try {
          localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(cloudSeating));
        } catch (e) {}
      }
    });

    const unsubManual = subscribeToManualGuests((cloudManual) => {
      if (cloudManual) {
        setManualGuests(cloudManual);
        try {
          localStorage.setItem('helio_margarida_manual_guests', JSON.stringify(cloudManual));
        } catch (e) {}
      }
    });

    return () => {
      unsubRsvp();
      unsubTables();
      unsubSeating();
      unsubManual();
    };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // RSVP Management
  const handleDeleteConfirmation = async (idToDelete) => {
    if (window.confirm('Tem a certeza que deseja remover esta confirmação?')) {
      const updated = confirmations.filter((item, idx) => (item.id || idx) !== idToDelete);
      setConfirmations(updated);
      localStorage.setItem('helio_margarida_rsvp_confirmations', JSON.stringify(updated));

      // Also remove assignment
      const newAssignments = { ...seatingAssignments };
      delete newAssignments[idToDelete];
      setSeatingAssignments(newAssignments);
      localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(newAssignments));

      // Delete from Firebase
      try {
        await deleteRsvpFromFirestore(idToDelete);
        await syncSeatingAssignmentsToFirestore(newAssignments);
      } catch (e) {
        console.log('Firebase delete error:', e);
      }
    }
  };

  const exportRsvpToCSV = () => {
    if (confirmations.length === 0) return;

    const headers = ['Data/Hora', 'Nome Completo', 'Lugares Reservados', 'Confirma Presença?', 'Restrições Alimentares', 'Mensagem'];
    const rows = confirmations.map(c => [
      `"${c.timestamp || ''}"`,
      `"${c.name || ''}"`,
      `"${c.guests || 1}"`,
      `"${c.attending === 'sim' ? 'Sim' : 'Não'}"`,
      `"${c.dietary || 'Nenhuma'}"`,
      `"${(c.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Confirmacoes_Casamento_Helio_e_Margarida_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table Management Actions
  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const newTable = {
      id: `table-${Date.now()}`,
      name: newTableName.trim(),
      capacity: parseInt(newTableCapacity, 10) || 10
    };

    const updated = [...tables, newTable];
    setTables(updated);
    localStorage.setItem('helio_margarida_tables', JSON.stringify(updated));
    syncTablesToFirestore(updated);
    setNewTableName('');
    setNewTableCapacity(10);
    setIsAddTableOpen(false);
  };

  const handleCreateBatchTables = async (e) => {
    e.preventDefault();
    const count = parseInt(batchCount, 10) || 1;
    const cap = parseInt(batchCapacity, 10) || 10;
    const startNumber = tables.length + 1;

    const created = [];
    for (let i = 0; i < count; i++) {
      created.push({
        id: `table-${Date.now()}-${i}`,
        name: `Mesa ${startNumber + i}`,
        capacity: cap
      });
    }

    const updated = [...tables, ...created];
    setTables(updated);
    localStorage.setItem('helio_margarida_tables', JSON.stringify(updated));
    syncTablesToFirestore(updated);
    setIsBatchOpen(false);
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    if (!editingTable || !editingTable.name.trim()) return;

    const updated = tables.map(t => t.id === editingTable.id ? {
      ...t,
      name: editingTable.name.trim(),
      capacity: parseInt(editingTable.capacity, 10) || 10
    } : t);

    setTables(updated);
    localStorage.setItem('helio_margarida_tables', JSON.stringify(updated));
    syncTablesToFirestore(updated);
    setEditingTable(null);
  };

  const handleDeleteTable = async (tableId) => {
    const assignedGuestsCount = Object.values(seatingAssignments).filter(tId => tId === tableId).length;
    if (assignedGuestsCount > 0) {
      if (!window.confirm(`Esta mesa tem ${assignedGuestsCount} convidados atribuídos. Se a apagar, os convidados voltarão a ficar sem mesa. Continuar?`)) {
        return;
      }
    } else if (!window.confirm('Tem a certeza que deseja remover esta mesa?')) {
      return;
    }

    const updatedTables = tables.filter(t => t.id !== tableId);
    setTables(updatedTables);
    localStorage.setItem('helio_margarida_tables', JSON.stringify(updatedTables));
    syncTablesToFirestore(updatedTables);

    // Clear assignments for this table
    const updatedAssignments = { ...seatingAssignments };
    Object.keys(updatedAssignments).forEach(gId => {
      if (updatedAssignments[gId] === tableId) {
        delete updatedAssignments[gId];
      }
    });
    setSeatingAssignments(updatedAssignments);
    localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(updatedAssignments));
    syncSeatingAssignmentsToFirestore(updatedAssignments);
  };

  const handleClearTable = async (tableId) => {
    const assignedGuests = allEligibleGuests.filter(g => seatingAssignments[g.id] === tableId);
    if (assignedGuests.length === 0) return;

    if (window.confirm(`Deseja remover todos os ${assignedGuests.length} convidados desta mesa?`)) {
      const updatedAssignments = { ...seatingAssignments };
      assignedGuests.forEach(g => {
        delete updatedAssignments[g.id];
      });
      setSeatingAssignments(updatedAssignments);
      localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(updatedAssignments));
      syncSeatingAssignmentsToFirestore(updatedAssignments);
    }
  };

  // Seating & Guests Actions
  const allEligibleGuests = [
    ...confirmations
      .filter(c => c.attending === 'sim')
      .map((c, idx) => ({
        id: c.id || `rsvp-${idx}`,
        name: c.name,
        seats: parseInt(c.guests || '1', 10),
        source: 'rsvp',
        dietary: c.dietary,
        tableId: seatingAssignments[c.id || `rsvp-${idx}`] || null
      })),
    ...manualGuests.map(m => ({
      id: m.id,
      name: m.name,
      seats: parseInt(m.seats || '1', 10),
      source: 'manual',
      dietary: m.dietary || '',
      tableId: seatingAssignments[m.id] || null
    }))
  ];

  // Quick Direct Add Guest to a Specific Table
  const handleQuickAddGuestToTable = async (e, tableId) => {
    e.preventDefault();
    const inputState = quickInputs[tableId] || { name: '', seats: 1 };
    const name = (inputState.name || '').trim();
    const seats = parseInt(inputState.seats, 10) || 1;

    if (!name) return;

    const newGuest = {
      id: `manual-${Date.now()}`,
      name: name,
      seats: seats
    };

    const updatedManual = [...manualGuests, newGuest];
    setManualGuests(updatedManual);
    localStorage.setItem('helio_margarida_manual_guests', JSON.stringify(updatedManual));
    syncManualGuestsToFirestore(updatedManual);

    const updatedAssignments = { ...seatingAssignments, [newGuest.id]: tableId };
    setSeatingAssignments(updatedAssignments);
    localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(updatedAssignments));
    syncSeatingAssignmentsToFirestore(updatedAssignments);

    // Reset input
    setQuickInputs({
      ...quickInputs,
      [tableId]: { name: '', seats: 1 }
    });
  };

  const handleAddManualGuest = async (e) => {
    e.preventDefault();
    if (!manualGuestName.trim()) return;

    const newGuest = {
      id: `manual-${Date.now()}`,
      name: manualGuestName.trim(),
      seats: parseInt(manualGuestSeats, 10) || 1
    };

    const updatedManual = [...manualGuests, newGuest];
    setManualGuests(updatedManual);
    localStorage.setItem('helio_margarida_manual_guests', JSON.stringify(updatedManual));
    syncManualGuestsToFirestore(updatedManual);

    if (manualGuestTable) {
      const updatedAssignments = { ...seatingAssignments, [newGuest.id]: manualGuestTable };
      setSeatingAssignments(updatedAssignments);
      localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(updatedAssignments));
      syncSeatingAssignmentsToFirestore(updatedAssignments);
    }

    setManualGuestName('');
    setManualGuestSeats(1);
    setManualGuestTable('');
    setIsAddManualGuestOpen(false);
  };

  const handleDeleteGuest = async (guest) => {
    if (guest.source === 'manual') {
      if (window.confirm(`Deseja apagar o convidado "${guest.name}" do sistema?`)) {
        const updated = manualGuests.filter(g => g.id !== guest.id);
        setManualGuests(updated);
        localStorage.setItem('helio_margarida_manual_guests', JSON.stringify(updated));
        syncManualGuestsToFirestore(updated);

        const updatedAssignments = { ...seatingAssignments };
        delete updatedAssignments[guest.id];
        setSeatingAssignments(updatedAssignments);
        localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(updatedAssignments));
        syncSeatingAssignmentsToFirestore(updatedAssignments);
      }
    } else {
      // RSVP guest: remove from table assignment
      if (window.confirm(`Remover "${guest.name}" desta mesa? (Ele continuará na lista RSVP de confirmações)`)) {
        const updatedAssignments = { ...seatingAssignments };
        delete updatedAssignments[guest.id];
        setSeatingAssignments(updatedAssignments);
        localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(updatedAssignments));
        syncSeatingAssignmentsToFirestore(updatedAssignments);
      }
    }
  };

  const handleAssignGuestToTable = async (guestId, tableId) => {
    const updated = { ...seatingAssignments };
    if (!tableId || tableId === 'none') {
      delete updated[guestId];
    } else {
      updated[guestId] = tableId;
    }
    setSeatingAssignments(updated);
    localStorage.setItem('helio_margarida_seating_assignments', JSON.stringify(updated));
    syncSeatingAssignmentsToFirestore(updated);
    setTransferringGuest(null);
  };

  // Helper to count occupied seats per table
  const getTableOccupancy = (tableId) => {
    const guestsInTable = allEligibleGuests.filter(g => seatingAssignments[g.id] === tableId);
    const occupiedSeats = guestsInTable.reduce((sum, g) => sum + g.seats, 0);
    return {
      guests: guestsInTable,
      occupiedSeats,
      totalGuestsCount: guestsInTable.length
    };
  };

  // Print Table Seating Layout
  const handlePrintTables = () => {
    window.print();
  };

  // Export Seating Chart to CSV
  const exportTablesToCSV = () => {
    if (tables.length === 0) return;

    const headers = ['Mesa', 'Capacidade', 'Lugares Ocupados', 'Lugares Livres', 'Convidados Sentados'];
    const rows = tables.map(t => {
      const { guests, occupiedSeats } = getTableOccupancy(t.id);
      const guestNames = guests.map(g => `${g.name} (${g.seats} lugar${g.seats > 1 ? 'es' : ''})`).join('; ');
      return [
        `"${t.name}"`,
        `"${t.capacity}"`,
        `"${occupiedSeats}"`,
        `"${Math.max(0, t.capacity - occupiedSeats)}"`,
        `"${guestNames}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mapa_de_Mesas_Casamento_Helio_e_Margarida_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for Table Stats
  const totalTablesCount = tables.length;
  const totalAvailableCapacity = tables.reduce((sum, t) => sum + (parseInt(t.capacity, 10) || 0), 0);
  const totalSeatedSeats = allEligibleGuests
    .filter(g => !!seatingAssignments[g.id])
    .reduce((sum, g) => sum + g.seats, 0);
  const totalFreeSeats = Math.max(0, totalAvailableCapacity - totalSeatedSeats);
  const unassignedGuests = allEligibleGuests.filter(g => !seatingAssignments[g.id]);

  // Filters
  const filteredConfirmations = confirmations.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'sim') return matchesSearch && item.attending === 'sim';
    if (filterStatus === 'nao') return matchesSearch && item.attending !== 'sim';
    return matchesSearch;
  });

  const filteredTables = tables.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(tableSearchQuery.toLowerCase());
    const { occupiedSeats } = getTableOccupancy(t.id);
    const isFull = occupiedSeats >= t.capacity;

    if (tableFilter === 'lotadas') return matchesSearch && isFull;
    if (tableFilter === 'com_vagas') return matchesSearch && !isFull;
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#F7F9F6] flex items-center justify-center">
        <div className="glass-card-emerald rounded-3xl p-8 sm:p-12 border border-[#2D6A4F]/20 shadow-xl max-w-md w-full text-center bg-white">
          <div className="w-16 h-16 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl text-[#1A2820] font-semibold mb-2">
            Painel Privado
          </h2>
          <p className="text-xs text-[#4D5E54] mb-8">
            Área de gestão reservada aos noivos (Hélio Nhamposse & Margarida Alfredo Guilima).
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Palavra-passe de acesso"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-5 py-3.5 rounded-2xl bg-[#F7F9F6] border ${
                  passwordError ? 'border-rose-500 focus:ring-rose-200' : 'border-[#2D6A4F]/30 focus:border-[#2D6A4F]'
                } focus:ring-2 outline-hidden text-sm text-center font-medium transition-all`}
              />
              {passwordError && (
                <p className="text-xs text-rose-600 mt-2 font-medium">Palavra-passe incorreta. Tente novamente.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              Entrar no Painel
            </button>
          </form>

          <button
            onClick={onBack}
            className="mt-6 text-xs text-[#6B7A70] hover:text-[#2D6A4F] inline-flex items-center gap-1 transition-colors uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Convite
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#F7F9F6]">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#2D6A4F]/20 shadow-sm">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#2D6A4F] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Painel de Gestão dos Noivos
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1A2820] font-semibold">
              Hélio Nhamposse & Margarida Alfredo Guilima
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <button
              onClick={loadData}
              className="p-3 rounded-2xl bg-[#F7F9F6] hover:bg-[#2D6A4F]/10 text-[#2D6A4F] transition-colors"
              title="Atualizar dados"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {activeTab === 'rsvp' ? (
              <button
                onClick={exportRsvpToCSV}
                disabled={confirmations.length === 0}
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#C5A059]" />
                Exportar RSVP (CSV)
              </button>
            ) : (
              <>
                <button
                  onClick={handlePrintTables}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-[#C5A059]" />
                  Imprimir Mapa de Mesas
                </button>
                <button
                  onClick={exportTablesToCSV}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-white border border-[#2D6A4F]/30 hover:bg-[#2D6A4F]/10 text-[#1B4332] text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  Exportar Mesas (CSV)
                </button>
              </>
            )}

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
              title="Sair do painel"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#2D6A4F]/20 pb-4">
          <button
            onClick={() => setActiveTab('rsvp')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'rsvp'
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'bg-white text-[#2D3A32] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/15'
            }`}
          >
            <Users className="w-4 h-4 text-[#C5A059]" />
            <span>Confirmações RSVP ({confirmations.filter(c => c.attending === 'sim').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'tables'
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'bg-white text-[#2D3A32] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/15'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#C5A059]" />
            <span>Gestão de Mesas & Lugares ({tables.length} Mesas)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: RSVP CONFIRMATIONS                                                */}
        {/* ========================================================================= */}
        {activeTab === 'rsvp' && (
          <div>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Total Lugares Confirmados</span>
                  <span className="font-serif text-3xl font-bold text-[#1B4332]">
                    {confirmations.filter(c => c.attending === 'sim').reduce((sum, c) => sum + parseInt(c.guests || '1', 10), 0)}
                  </span>
                  <span className="text-[10px] text-gray-500 block">Pessoas com presença confirmada</span>
                </div>
              </div>

              <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Confirmados (Sim)</span>
                  <span className="font-serif text-3xl font-bold text-emerald-700">
                    {confirmations.filter(c => c.attending === 'sim').length}
                  </span>
                  <span className="text-[10px] text-gray-500 block">Respostas positivas</span>
                </div>
              </div>

              <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Ausentes (Não)</span>
                  <span className="font-serif text-3xl font-bold text-rose-700">
                    {confirmations.filter(c => c.attending !== 'sim').length}
                  </span>
                  <span className="text-[10px] text-gray-500 block">Respostas de ausência</span>
                </div>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="glass-card-emerald rounded-3xl p-4 mb-6 border border-[#2D6A4F]/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#2D6A4F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar por convidado ou mensagem..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {['todos', 'sim', 'nao'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      filterStatus === st
                        ? 'bg-[#1B4332] text-white shadow-xs'
                        : 'bg-white text-[#2D3A32] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/20'
                    }`}
                  >
                    {st === 'todos' ? 'Todos' : st === 'sim' ? 'Confirmados' : 'Ausentes'}
                  </button>
                ))}
              </div>
            </div>

            {/* RSVP Table */}
            <div className="glass-card-emerald rounded-3xl border border-[#2D6A4F]/20 shadow-sm overflow-hidden bg-white">
              {filteredConfirmations.length === 0 ? (
                <div className="text-center py-14 text-gray-500">
                  <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-serif text-lg font-medium text-[#1A2820]">Nenhuma confirmação registada ainda</p>
                  <p className="text-xs text-gray-400">As confirmações enviadas pelos convidados aparecerão aqui.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1B4332]/5 border-b border-[#2D6A4F]/15 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                        <th className="p-4 sm:p-5">Data/Hora</th>
                        <th className="p-4 sm:p-5">Nome do Convidado</th>
                        <th className="p-4 sm:p-5 text-center">Lugares</th>
                        <th className="p-4 sm:p-5 text-center">Status</th>
                        <th className="p-4 sm:p-5">Mesa Atribuída</th>
                        <th className="p-4 sm:p-5">Restrições / Mensagem</th>
                        <th className="p-4 sm:p-5 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D6A4F]/10 text-xs">
                      {filteredConfirmations.map((c, idx) => {
                        const guestId = c.id || `rsvp-${idx}`;
                        const assignedTableId = seatingAssignments[guestId];
                        const assignedTable = tables.find(t => t.id === assignedTableId);

                        return (
                          <tr key={guestId} className="hover:bg-[#2D6A4F]/5 transition-colors">
                            <td className="p-4 sm:p-5 text-gray-500 whitespace-nowrap">{c.timestamp || 'Recent'}</td>
                            <td className="p-4 sm:p-5 font-bold text-[#1A2820]">
                              {c.name}
                              {c.dietary && c.dietary !== 'Nenhuma' && (
                                <span className="block text-[10px] text-amber-700 font-normal mt-0.5">
                                  Restrição: {c.dietary}
                                </span>
                              )}
                            </td>
                            <td className="p-4 sm:p-5 text-center font-bold text-[#1B4332]">{c.guests || 1}</td>
                            <td className="p-4 sm:p-5 text-center">
                              {c.attending === 'sim' ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                                  <Check className="w-3 h-3" /> Sim
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                                  <X className="w-3 h-3" /> Não
                                </span>
                              )}
                            </td>
                            <td className="p-4 sm:p-5">
                              {c.attending === 'sim' ? (
                                assignedTable ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] font-semibold text-xs border border-[#1B4332]/20">
                                    <LayoutGrid className="w-3 h-3 text-[#C5A059]" />
                                    {assignedTable.name}
                                  </span>
                                ) : (
                                  <span className="text-amber-700 text-xs italic">Sem mesa</span>
                                )
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                            </td>
                            <td className="p-4 sm:p-5 text-gray-600 max-w-xs truncate" title={c.message}>
                              {c.message || '—'}
                            </td>
                            <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteConfirmation(guestId)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Remover registo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TABLES & SEATING MANAGEMENT                                       */}
        {/* ========================================================================= */}
        {activeTab === 'tables' && (
          <div>
            {/* Table Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="glass-card-emerald rounded-3xl p-5 border border-[#2D6A4F]/20 shadow-sm bg-white">
                <span className="text-[10px] sm:text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Total de Mesas</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B4332]">{totalTablesCount}</span>
                <span className="text-[10px] text-gray-500 block">Criadas no sistema</span>
              </div>

              <div className="glass-card-emerald rounded-3xl p-5 border border-[#2D6A4F]/20 shadow-sm bg-white">
                <span className="text-[10px] sm:text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Capacidade Total</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B4332]">{totalAvailableCapacity}</span>
                <span className="text-[10px] text-gray-500 block">Lugares disponíveis</span>
              </div>

              <div className="glass-card-emerald rounded-3xl p-5 border border-[#2D6A4F]/20 shadow-sm bg-white">
                <span className="text-[10px] sm:text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Lugares Ocupados</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">{totalSeatedSeats}</span>
                <span className="text-[10px] text-gray-500 block">Convidados acomodados</span>
              </div>

              <div className="glass-card-emerald rounded-3xl p-5 border border-[#2D6A4F]/20 shadow-sm bg-white">
                <span className="text-[10px] sm:text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Sem Mesa Atribuída</span>
                <span className={`font-serif text-2xl sm:text-3xl font-bold ${unassignedGuests.length > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {unassignedGuests.length}
                </span>
                <span className="text-[10px] text-gray-500 block">Aguardando alocação</span>
              </div>
            </div>

            {/* Action Bar & Modal Triggers */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-6 rounded-3xl border border-[#2D6A4F]/20 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setIsAddTableOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#C5A059]" />
                  Criar Nova Mesa
                </button>

                <button
                  onClick={() => setIsBatchOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 hover:bg-[#2D6A4F]/10 text-[#1B4332] text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-[#C5A059]" />
                  Criar Lote de Mesas (Ex: 10 Mesas)
                </button>

                <button
                  onClick={() => setIsAddManualGuestOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-white border border-[#2D6A4F]/25 hover:bg-[#2D6A4F]/10 text-[#1B4332] text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-[#C5A059]" />
                  Adicionar Convidado Manual
                </button>
              </div>

              {/* Table Search & Filter */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="w-4 h-4 text-[#2D6A4F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar mesas por nome..."
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs focus:outline-hidden focus:border-[#2D6A4F]"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {['todos', 'com_vagas', 'lotadas'].map((flt) => (
                    <button
                      key={flt}
                      onClick={() => setTableFilter(flt)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                        tableFilter === flt
                          ? 'bg-[#1B4332] text-white shadow-xs'
                          : 'bg-[#F7F9F6] text-[#2D3A32] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/20'
                      }`}
                    >
                      {flt === 'todos' ? 'Todas' : flt === 'com_vagas' ? 'Vagas' : 'Lotadas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Unassigned Guests Pool Alert / Section */}
            {unassignedGuests.length > 0 && (
              <div className="mb-8 p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-amber-900 font-serif text-lg font-semibold">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Convidados Confirmados Sem Mesa ({unassignedGuests.length})</span>
                  </div>
                  <span className="text-xs text-amber-700 font-medium">
                    Atribua uma mesa para cada convidado abaixo:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unassignedGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col justify-between gap-3.5 hover:border-amber-400 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#1A2820] leading-snug break-words">
                              {guest.name}
                            </h4>
                            <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                              {guest.seats} {guest.seats > 1 ? 'lugares' : 'lugar'} {guest.source === 'manual' ? '• Manual' : '• RSVP Online'}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-amber-100/90 text-amber-900 text-[10px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">
                          {guest.seats} {guest.seats > 1 ? 'Lugares' : 'Lugar'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-amber-100">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          Alocar para a Mesa:
                        </label>
                        <select
                          onChange={(e) => handleAssignGuestToTable(guest.id, e.target.value)}
                          defaultValue=""
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-amber-50/70 border border-amber-300 font-semibold text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
                        >
                          <option value="" disabled>Selecionar Mesa do Casamento...</option>
                          {tables.map(t => {
                            const { occupiedSeats } = getTableOccupancy(t.id);
                            const remaining = t.capacity - occupiedSeats;
                            const hasSpace = remaining >= guest.seats;
                            return (
                              <option key={t.id} value={t.id} disabled={occupiedSeats >= t.capacity}>
                                {t.name} ({occupiedSeats}/{t.capacity} lugares) {!hasSpace ? '• [Poucas vagas]' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tables Grid */}
            {filteredTables.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#2D6A4F]/20 shadow-sm">
                <LayoutGrid className="w-14 h-14 mx-auto text-gray-300 mb-3" />
                <h3 className="font-serif text-xl font-medium text-[#1A2820] mb-1">Nenhuma mesa encontrada</h3>
                <p className="text-xs text-gray-500 mb-6">Comece criando a primeira mesa para os noivos e convidados.</p>
                <button
                  onClick={() => setIsAddTableOpen(true)}
                  className="px-6 py-3 rounded-full bg-[#1B4332] text-white text-xs uppercase tracking-wider font-bold shadow-md"
                >
                  Criar Mesa Agora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTables.map((table) => {
                  const { guests, occupiedSeats } = getTableOccupancy(table.id);
                  const isFull = occupiedSeats >= table.capacity;
                  const percentage = Math.min(100, Math.round((occupiedSeats / table.capacity) * 100));
                  const currentInput = quickInputs[table.id] || { name: '', seats: 1 };

                  return (
                    <div
                      key={table.id}
                      className="bg-white rounded-3xl border border-[#2D6A4F]/20 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div>
                        {/* Table Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                              MESA DO CASAMENTO
                            </span>
                            <h3 className="font-serif text-xl font-bold text-[#1A2820] leading-snug">
                              {table.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setEditingTable(table)}
                              className="p-1.5 text-gray-400 hover:text-[#1B4332] hover:bg-[#2D6A4F]/10 rounded-lg transition-colors"
                              title="Editar nome / capacidade"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTable(table.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remover mesa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span className={isFull ? 'text-rose-700' : 'text-[#2D6A4F]'}>
                              {occupiedSeats} de {table.capacity} Lugares Ocupados
                            </span>
                            <span className="text-gray-400">{percentage}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                isFull ? 'bg-rose-500' : percentage > 70 ? 'bg-[#C5A059]' : 'bg-[#2D6A4F]'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Guest List Inside Table */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                              CONVIDADOS SENTADOS ({guests.length})
                            </span>
                            {guests.length > 0 && (
                              <button
                                onClick={() => handleClearTable(table.id)}
                                className="text-[10px] text-rose-600 hover:underline font-bold uppercase tracking-wider"
                                title="Limpar todos os convidados desta mesa"
                              >
                                Limpar Mesa
                              </button>
                            )}
                          </div>

                          {guests.length === 0 ? (
                            <p className="text-xs text-gray-400 italic py-4 text-center bg-[#F7F9F6] rounded-2xl border border-dashed border-gray-200">
                              Mesa vazia. Adicione convidados abaixo.
                            </p>
                          ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                              {guests.map((g) => (
                                <div
                                  key={g.id}
                                  className="p-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/15 flex items-center justify-between gap-2.5 text-xs hover:border-[#2D6A4F]/40 transition-colors"
                                >
                                  <div className="min-w-0 flex-1">
                                    <span className="font-bold text-[#1A2820] block leading-snug break-words">{g.name}</span>
                                    <span className="text-[10px] text-gray-500 font-medium block mt-0.5">
                                      {g.seats} {g.seats > 1 ? 'lugares' : 'lugar'} {g.source === 'manual' ? '• Manual' : '• RSVP'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => setTransferringGuest(g)}
                                      className="p-1.5 text-gray-500 hover:text-[#1B4332] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                      title="Transferir para outra mesa"
                                    >
                                      <ArrowRightLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteGuest(g)}
                                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                                      title="Remover / Deletar convidado desta mesa"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Add Guest Section on this Specific Table */}
                      <div className="pt-4 border-t border-[#2D6A4F]/10 space-y-3">
                        {!isFull ? (
                          <>
                            {/* Direct Quick Add Form */}
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#2D6A4F] tracking-wider block mb-1.5 flex items-center gap-1">
                                <Plus className="w-3 h-3 text-[#C5A059]" />
                                Adicionar Convidado nesta Mesa
                              </span>
                              <form onSubmit={(e) => handleQuickAddGuestToTable(e, table.id)} className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Nome do convidado..."
                                  value={currentInput.name || ''}
                                  onChange={(e) => setQuickInputs({
                                    ...quickInputs,
                                    [table.id]: { ...currentInput, name: e.target.value }
                                  })}
                                  className="flex-1 px-3 py-2 rounded-xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                                />
                                <input
                                  type="number"
                                  min="1"
                                  max={Math.max(1, table.capacity - occupiedSeats)}
                                  title="Lugares ocupados"
                                  value={currentInput.seats || 1}
                                  onChange={(e) => setQuickInputs({
                                    ...quickInputs,
                                    [table.id]: { ...currentInput, seats: e.target.value }
                                  })}
                                  className="w-12 px-1.5 py-2 rounded-xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-center text-[#1A2820] font-bold focus:outline-hidden"
                                />
                                <button
                                  type="submit"
                                  className="px-3.5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                                  title="Adicionar à mesa"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                                  <span>Adicionar</span>
                                </button>
                              </form>
                            </div>

                            {/* Dropdown for Unassigned RSVPs if any */}
                            {unassignedGuests.length > 0 && (
                              <div className="pt-1">
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAssignGuestToTable(e.target.value, table.id);
                                      e.target.value = '';
                                    }
                                  }}
                                  defaultValue=""
                                  className="w-full text-xs px-3 py-2 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-900 font-semibold focus:outline-hidden cursor-pointer"
                                >
                                  <option value="" disabled>+ Ou puxar da lista RSVP pendente ({unassignedGuests.length})...</option>
                                  {unassignedGuests.map(ug => (
                                    <option key={ug.id} value={ug.id}>
                                      {ug.name} ({ug.seats} lug.)
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="py-2.5 px-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                              Mesa Totalmente Lotada ({table.capacity}/{table.capacity})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: CRIAR NOVA MESA                                                    */}
      {/* ========================================================================= */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 relative">
            <button
              onClick={() => setIsAddTableOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#1A2820] font-semibold">Criar Nova Mesa</h3>
                <p className="text-xs text-gray-500">Defina o nome e a capacidade de lugares</p>
              </div>
            </div>

            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Nome / Descrição da Mesa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mesa 1 - Família do Noivo, Mesa VIP..."
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Capacidade de Convidados (Lugares)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                />
                <span className="text-[10px] text-gray-400 block mt-1">O padrão para casamentos é de 10 lugares.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-md"
                >
                  Salvar Mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR LOTE DE MESAS                                               */}
      {/* ========================================================================= */}
      {isBatchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 relative">
            <button
              onClick={() => setIsBatchOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 text-[#A38038] flex items-center justify-center">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#1A2820] font-semibold">Criar Lote de Mesas</h3>
                <p className="text-xs text-gray-500">Gere várias mesas numeradas automaticamente</p>
              </div>
            </div>

            <form onSubmit={handleCreateBatchTables} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Quantas Mesas Deseja Adicionar?
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Capacidade por Mesa (Padrão 10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={batchCapacity}
                  onChange={(e) => setBatchCapacity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBatchOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-md"
                >
                  Criar Mesas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADICIONAR CONVIDADO MANUAL                                        */}
      {/* ========================================================================= */}
      {isAddManualGuestOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 relative">
            <button
              onClick={() => setIsAddManualGuestOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#1A2820] font-semibold">Convidado Manual</h3>
                <p className="text-xs text-gray-500">Adicione um convidado confirmado por telefone/presencial</p>
              </div>
            </div>

            <form onSubmit={handleAddManualGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pastor Silva, Tia Rosa..."
                  value={manualGuestName}
                  onChange={(e) => setManualGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Número de Lugares Reservados
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={manualGuestSeats}
                  onChange={(e) => setManualGuestSeats(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Mesa Opcional
                </label>
                <select
                  value={manualGuestTable}
                  onChange={(e) => setManualGuestTable(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                >
                  <option value="">Deixar pendente (Sem mesa por enquanto)</option>
                  {tables.map(t => {
                    const { occupiedSeats } = getTableOccupancy(t.id);
                    return (
                      <option key={t.id} value={t.id} disabled={occupiedSeats >= t.capacity}>
                        {t.name} ({occupiedSeats}/{t.capacity} ocupados)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddManualGuestOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-md"
                >
                  Salvar Convidado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR MESA                                                       */}
      {/* ========================================================================= */}
      {editingTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 relative">
            <button
              onClick={() => setEditingTable(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#1A2820] font-semibold">Editar Mesa</h3>
                <p className="text-xs text-gray-500">Altere o nome ou capacidade de lugares</p>
              </div>
            </div>

            <form onSubmit={handleUpdateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Nome da Mesa
                </label>
                <input
                  type="text"
                  required
                  value={editingTable.name}
                  onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                  Capacidade de Convidados
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={editingTable.capacity}
                  onChange={(e) => setEditingTable({ ...editingTable, capacity: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-sm focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingTable(null)}
                  className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-md"
                >
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TRANSFERIR CONVIDADO DE MESA                                      */}
      {/* ========================================================================= */}
      {transferringGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 relative">
            <button
              onClick={() => setTransferringGuest(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 text-[#A38038] flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#1A2820] font-semibold">Mudar de Mesa</h3>
                <p className="text-xs text-gray-500 font-medium text-[#1B4332]">{transferringGuest.name}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-[#1A2820] uppercase tracking-wider">
                Selecione a Nova Mesa de Destino:
              </label>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <button
                  onClick={() => handleAssignGuestToTable(transferringGuest.id, null)}
                  className="w-full p-3 rounded-2xl border border-dashed border-gray-300 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Deixar Sem Mesa (Pendente)</span>
                  <UserMinus className="w-4 h-4 text-gray-400" />
                </button>

                {tables.map(t => {
                  const { occupiedSeats } = getTableOccupancy(t.id);
                  const isCurrent = seatingAssignments[transferringGuest.id] === t.id;
                  const isFull = !isCurrent && occupiedSeats >= t.capacity;

                  return (
                    <button
                      key={t.id}
                      disabled={isFull || isCurrent}
                      onClick={() => handleAssignGuestToTable(transferringGuest.id, t.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs flex items-center justify-between transition-all ${
                        isCurrent 
                          ? 'border-[#1B4332] bg-[#1B4332]/10 font-bold text-[#1B4332]' 
                          : isFull
                          ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                          : 'border-[#2D6A4F]/20 hover:border-[#1B4332] hover:bg-[#2D6A4F]/5 text-[#1A2820]'
                      }`}
                    >
                      <div>
                        <span className="font-bold block">{t.name}</span>
                        <span className="text-[10px] text-gray-500">
                          {occupiedSeats} de {t.capacity} lugares ocupados
                        </span>
                      </div>
                      {isCurrent ? (
                        <span className="text-[10px] font-bold text-[#1B4332] uppercase">Mesa Atual</span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINT-ONLY VIEW: Clean Table Chart Ready for Paper or PDF                 */}
      {/* ========================================================================= */}
      <div className="hidden print:block fixed inset-0 bg-white p-8 text-black z-[9999]">
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-widest">
            Casamento de Hélio Nhamposse & Margarida Alfredo Guilima
          </h1>
          <p className="text-sm">Sábado, 28 de Novembro de 2026 — Mapa de Mesas & Lugares dos Convidados</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {tables.map((t) => {
            const { guests, occupiedSeats } = getTableOccupancy(t.id);
            return (
              <div key={t.id} className="border border-black p-4 rounded-lg break-inside-avoid">
                <div className="flex justify-between items-center border-b border-black pb-2 mb-2">
                  <h3 className="font-bold text-base">{t.name}</h3>
                  <span className="text-xs font-semibold">{occupiedSeats} / {t.capacity} Lugares</span>
                </div>
                {guests.length === 0 ? (
                  <p className="text-xs italic text-gray-500">Mesa Vazia</p>
                ) : (
                  <ol className="list-decimal list-inside text-xs space-y-1">
                    {guests.map((g) => (
                      <li key={g.id} className="font-medium">
                        {g.name} {g.seats > 1 && `(${g.seats} lugares)`}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
