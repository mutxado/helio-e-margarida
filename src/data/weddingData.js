const base = import.meta.env.BASE_URL || '/';

export const weddingData = {
  couple: {
    groom: {
      name: "Hélio",
      fullName: "Hélio Nhamposse",
      role: "O Noivo",
      bio: "Focado, carinhoso e com um coração dedicado à família. O Hélio encontrou na Margarida a sua companheira ideal, confidente e o amor da sua vida.",
      quote: "Amar é caminhar lado a lado, construindo juntos um futuro abençoado.",
      image: `${base}images/helio_portrait.jpg`
    },
    bride: {
      name: "Margarida",
      fullName: "Margarida Alfredo Guilima",
      role: "A Noiva",
      bio: "Com a sua ternura, alegria radiante e elegância natural. A Margarida ilumina cada momento, vendo no Hélio o seu porto seguro e parceiro de todos os sonhos.",
      quote: "Onde o amor e a fé habitam, nenhuma tempestade abala a nossa união.",
      image: `${base}images/margarida_portrait.jpg`
    },
    heroBg: `${base}images/photo_emerald_couple.jpg`,
    hashtag: "#MargaridaEHelio2026",
    tagline: "CELEBRAÇÃO DO NOSSO AMOR · MAPUTO",
    dateText: "Sábado, 28 de Novembro de 2026",
    targetDate: "2026-11-28T09:00:00",
    whatsappPhone: "258845585442",
    flyerImage: `${base}images/photo_emerald_couple.jpg`
  },

  story: [
    {
      year: "2023",
      title: "O Nosso Primeiro Encontro",
      description: "Foi onde os nossos caminhos se cruzaram de forma especial. Entre conversas sinceras e olhares de cumplicidade, começámos a escrever a nossa história de amor.",
      image: `${base}images/photo_blue_wall.jpg`
    },
    {
      year: "2024",
      title: "Crescimento & Cumplicidade",
      description: "Cada momento juntos foi fortalecendo os nossos laços, planos e a certeza de que Deus preparava um lindo propósito para as nossas vidas.",
      image: `${base}images/photo_hug.jpg`
    },
    {
      year: "2026",
      title: "O SIM Para Sempre",
      description: "Com o coração transbordando de gratidão e alegria, decidimos dar o passo mais importante: celebrar a nossa união matrimonial!",
      image: `${base}images/photo_emerald_couple.jpg`
    }
  ],

  events: [
    {
      id: "church",
      title: "Cerimónia Religiosa",
      time: "09:00 H",
      place: "Igreja Embaixada de Cristo",
      address: "Maxaquene, ao lado do Comando da Polícia Municipal, Maputo",
      details: "A celebração solene e bênção do nosso matrimónio diante de Deus e dos nossos entes queridos.",
      mapUrl: "https://maps.google.com/?q=Embaixada+de+Cristo+Maxaquene+Maputo",
      icon: "Church"
    },
    {
      id: "civil",
      title: "Registo Civil",
      time: "A Seguir",
      place: "Conservatória da Costa do Sol",
      address: "Costa do Sol, Cidade de Maputo",
      details: "A oficialização legal do nosso matrimónio perante a lei e testemunhas.",
      mapUrl: "https://maps.google.com/?q=Conservatoria+Registo+Civil+Costa+do+Sol+Maputo",
      icon: "FileCheck"
    },
    {
      id: "reception",
      title: "Copo de Água & Recepção",
      time: "14:00 H",
      place: "Salão Eliana Eventos",
      address: "Perto da FACIM, Paragem Dona Nhelete",
      details: "Banquete festivo, brinde, corte do bolo e celebração com todos os convidados.",
      mapUrl: "https://maps.google.com/?q=FACIM+Ricatla+Maputo",
      icon: "PartyPopper"
    }
  ],

  gallery: [
    {
      id: 1,
      title: "Margarida & Hélio — Traje de Celebração",
      url: `${base}images/photo_emerald_couple.jpg`
    },
    {
      id: 2,
      title: "A Noiva: Margarida Alfredo Guilima",
      url: `${base}images/margarida_portrait.jpg`
    },
    {
      id: 3,
      title: "O Noivo: Hélio Nhamposse",
      url: `${base}images/helio_portrait.jpg`
    },
    {
      id: 4,
      title: "Sorrisos & Cumplicidade",
      url: `${base}images/photo_couple_closeup.jpg`
    },
    {
      id: 5,
      title: "Abraço de Ternura",
      url: `${base}images/photo_hug.jpg`
    },
    {
      id: 6,
      title: "Momentos Especiais",
      url: `${base}images/photo_braids.jpg`
    },
    {
      id: 7,
      title: "O Nosso Começo",
      url: `${base}images/photo_blue_wall.jpg`
    }
  ],

  gifts: {
    intro: "A vossa presença no nosso casamento é o maior presente que poderíamos desejar. Para quem desejar nos abençoar com qualquer contribuição:",
    paymentInfo: {
      mpesa: "M-Pesa: 845585442 (Hélio Nhamposse)",
      emola: "e-Mola: 866091899 (Hélio Nhamposse)",
      mpesaRaw: "845585442",
      emolaRaw: "866091899"
    }
  }
};
