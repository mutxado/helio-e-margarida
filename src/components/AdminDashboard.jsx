import React, { useState, useEffect } from 'react';
import { Lock, Users, CheckCircle, XCircle, Search, Download, Trash2, LogOut, Heart, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

export function AdminDashboard({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmations, setConfirmations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const ADMIN_PASSWORD = 'helio2026';

  const loadConfirmations = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('helio_margarida_rsvp_confirmations') || '[]');
      setConfirmations(stored);
    } catch (e) {
      console.log('Error loading confirmations:', e);
      setConfirmations([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadConfirmations();
    }
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

  const handleDelete = (idToDelete) => {
    if (window.confirm('Tem a certeza que deseja remover este registo?')) {
      const updated = confirmations.filter((item, idx) => (item.id || idx) !== idToDelete);
      setConfirmations(updated);
      localStorage.setItem('helio_margarida_rsvp_confirmations', JSON.stringify(updated));
    }
  };

  const exportToCSV = () => {
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

  const filteredConfirmations = confirmations.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'sim') return matchesSearch && item.attending === 'sim';
    if (filterStatus === 'nao') return matchesSearch && item.attending !== 'sim';
    return matchesSearch;
  });

  const totalConfirmedGuests = confirmations
    .filter(c => c.attending === 'sim')
    .reduce((sum, c) => sum + parseInt(c.guests || '1', 10), 0);
  const totalConfirmedResponses = confirmations.filter(c => c.attending === 'sim').length;
  const totalDeclinedResponses = confirmations.filter(c => c.attending !== 'sim').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#F7F9F6] flex items-center justify-center">
        <div className="glass-card-emerald rounded-3xl p-8 sm:p-12 border border-[#2D6A4F]/20 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl text-[#1A2820] font-semibold mb-2">
            Painel Privado
          </h2>
          <p className="text-xs text-[#4D5E54] mb-8">
            Área reservada aos noivos (Hélio Nhamposse & Margarida Alfredo Guilima).
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Palavra-passe de acesso"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-5 py-3.5 rounded-2xl bg-white border ${
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
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#2D6A4F]/20 shadow-sm">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#2D6A4F] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Painel de Gestão dos Noivos
            </span>
            <h1 className="font-serif text-3xl text-[#1A2820] font-semibold">
              Confirmações de Presença (RSVP)
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadConfirmations}
              className="p-3 rounded-2xl bg-[#F7F9F6] hover:bg-[#2D6A4F]/10 text-[#2D6A4F] transition-colors"
              title="Atualizar lista"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={exportToCSV}
              disabled={confirmations.length === 0}
              className="px-5 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              Exportar para Excel (CSV)
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Total Lugares Confirmados</span>
              <span className="font-serif text-3xl font-bold text-[#1B4332]">{totalConfirmedGuests}</span>
              <span className="text-[10px] text-gray-500 block">Pessoas com presença confirmada</span>
            </div>
          </div>

          <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Confirmados (Sim)</span>
              <span className="font-serif text-3xl font-bold text-emerald-700">{totalConfirmedResponses}</span>
              <span className="text-[10px] text-gray-500 block">Respostas positivas</span>
            </div>
          </div>

          <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <XCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Ausentes (Não)</span>
              <span className="font-serif text-3xl font-bold text-rose-700">{totalDeclinedResponses}</span>
              <span className="text-[10px] text-gray-500 block">Respostas de ausência</span>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="glass-card-emerald rounded-3xl p-4 mb-6 border border-[#2D6A4F]/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#2D6A4F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por convidado ou mensagem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-[#2D6A4F]/25 text-xs focus:outline-hidden focus:border-[#2D6A4F]"
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

        {/* Table */}
        <div className="glass-card-emerald rounded-3xl border border-[#2D6A4F]/20 shadow-sm overflow-hidden bg-white">
          {filteredConfirmations.length === 0 ? (
            <div className="text-center py-14 text-gray-500">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-serif text-lg font-medium text-[#1A2820]">Nenhuma confirmação registada ainda</p>
              <p className="text-xs text-gray-400">As confirmações enviadas pelos convidados aparecerão aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F9F6] border-b border-[#2D6A4F]/15 text-[#2D3A32] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Data/Hora</th>
                    <th className="p-4">Nome do Convidado</th>
                    <th className="p-4 text-center">Lugares</th>
                    <th className="p-4 text-center">Estado</th>
                    <th className="p-4">Restrições Alimentares</th>
                    <th className="p-4">Mensagem</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D6A4F]/10">
                  {filteredConfirmations.map((c, idx) => (
                    <tr key={c.id || idx} className="hover:bg-[#F7F9F6]/60 transition-colors">
                      <td className="p-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        {c.timestamp || 'Hoje'}
                      </td>
                      <td className="p-4 font-semibold text-[#1A2820]">
                        {c.name}
                      </td>
                      <td className="p-4 text-center font-bold text-[#2D6A4F]">
                        {c.guests || 1}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          c.attending === 'sim'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {c.attending === 'sim' ? 'Confirmado' : 'Ausente'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 italic">
                        {c.dietary || 'Nenhuma'}
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs truncate">
                        {c.message || '-'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(c.id || idx)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remover registo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
