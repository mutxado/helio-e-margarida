import React, { useState, useEffect } from 'react';
import { Heart, Send, Sparkles } from 'lucide-react';
import { saveMessageToFirestore, subscribeToMessages } from '../firebase';

export function MessageWall() {
  const initialMessages = [
    {
      id: 'default-1',
      author: 'Família Nhamposse',
      text: 'Que Deus derrame ricas bênçãos sobre o vosso lar e casamento. Estamos radiantes de alegria por vocês!',
      date: 'Recente'
    },
    {
      id: 'default-2',
      author: 'Amigos & Padrinhos',
      text: 'Hélio e Margarida, que a cumplicidade e o carinho cresçam a cada dia nesta linda caminhada a dois.',
      date: 'Recente'
    },
    {
      id: 'default-3',
      author: 'Família Guilima',
      text: 'Uma união selada por Deus! Desejamos sabedoria, paz e prosperidade para o vosso futuro juntos.',
      date: 'Recente'
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Carregar do localStorage se existir
    try {
      const saved = localStorage.getItem('helio_margarida_messages');
      if (saved) setMessages(JSON.parse(saved));
    } catch (e) {
      console.log('Using default messages');
    }

    // 2. Ouvir atualizações em tempo real do Firebase Firestore
    const unsubscribe = subscribeToMessages((cloudMessages) => {
      if (cloudMessages && cloudMessages.length > 0) {
        setMessages(cloudMessages);
        try {
          localStorage.setItem('helio_margarida_messages', JSON.stringify(cloudMessages));
        } catch (e) {}
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    setIsSubmitting(true);

    const newMsg = {
      author: author.trim(),
      text: text.trim(),
      date: new Date().toLocaleDateString('pt-MZ')
    };

    try {
      await saveMessageToFirestore(newMsg);
    } catch (err) {
      console.log('Firebase message error, saving locally:', err);
      const localUpdated = [{ ...newMsg, id: Date.now() }, ...messages];
      setMessages(localUpdated);
      try {
        localStorage.setItem('helio_margarida_messages', JSON.stringify(localUpdated));
      } catch (e) {}
    }

    setAuthor('');
    setText('');
    setIsSubmitting(false);
  };

  return (
    <section id="messages" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#2D6A4F] block mb-2 font-normal">
            Bênçãos & Felicitações
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A2820] font-normal tracking-wide">
            Mural de Mensagens
          </h2>
          <div className="w-20 h-0.5 bg-[#C5A059] mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#4D5E54] max-w-xl mx-auto">
            Deixe uma mensagem de amor e votos de bênção aos noivos.
          </p>
        </div>

        {/* Input Form Box */}
        <div className="glass-card-emerald rounded-3xl p-6 sm:p-8 border border-[#2D6A4F]/20 shadow-md mb-14 max-w-3xl mx-auto">
          <form onSubmit={handleAddMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Seu Nome / Família"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-white border border-[#2D6A4F]/25 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-hidden text-sm text-[#1A2820] transition-all"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-medium text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#C5A059]" />
                  {isSubmitting ? 'A publicar...' : 'Publicar Voto'}
                </button>
              </div>
            </div>
            <div>
              <textarea
                rows={2}
                required
                placeholder="Escreva a sua mensagem especial para Hélio & Margarida..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-white border border-[#2D6A4F]/25 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-hidden text-sm text-[#1A2820] transition-all"
              />
            </div>
          </form>
        </div>

        {/* Message Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className="glass-card-emerald rounded-2xl p-6 border border-[#2D6A4F]/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-lg font-semibold text-[#1A2820]">
                    {msg.author}
                  </h4>
                  <Heart className="w-4 h-4 text-[#2D6A4F] fill-[#2D6A4F]" />
                </div>
                <p className="text-sm text-[#4D5E54] italic leading-relaxed mb-4 font-light">
                  "{msg.text}"
                </p>
              </div>
              <span className="text-[10px] text-[#6B7A70] uppercase tracking-wider font-bold">
                {msg.date || 'Recente'}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
