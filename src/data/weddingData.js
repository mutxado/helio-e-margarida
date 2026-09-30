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
      image: `${base}images/photo_braids.jpg`
    },
    heroBg: `${base}images/photo_hug.jpg`,
    hashtag: "#HelioEMargarida2026",
    tagline: "CELEBRAÇÃO DO NOSSO AMOR · MAPUTO",
    dateText: "Sábado, 28 de Novembro de 2026",
    targetDate: "2026-11-28T09:00:00",
    whatsappPhone: "258840000000", // atualizável
    flyerImage: `${base}images/photo_hug.jpg`
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
      image: `${base}images/photo_braids.jpg`
    }
  ],

  events: [
    {
      id: "ceremony",
      title: "Cerimónia Civil & Religiosa",
      time: "09:00 H",
      place: "Igreja & Registo Civil",
      address: "Cidade de Maputo, Moçambique",
      details: "A celebração solene do nosso matrimónio diante de Deus, familiares e amigos queridos.",
      mapUrl: "https://maps.google.com/?q=Maputo+Mozambique",
      icon: "Church"
    },
    {
      id: "reception",
      title: "Copo de Água & Recepção Festiva",
      time: "14:00 H",
      place: "Salão de Eventos",
      address: "Cidade de Maputo, Moçambique",
      details: "Um banquete inesquecível com almoço, boa música, brinde e muita celebração.",
      mapUrl: "https://maps.google.com/?q=Maputo+Mozambique",
      icon: "PartyPopper"
    }
  ],

  gallery: [
    {
      id: 1,
      title: "Hélio Nhamposse & Margarida Alfredo Guilima",
      url: `${base}images/photo_hug.jpg`
    },
    {
      id: 2,
      title: "Momentos de Ternura",
      url: `${base}images/photo_braids.jpg`
    },
    {
      id: 3,
      title: "Sorrisos & Cumplicidade",
      url: `${base}images/photo_blue_wall.jpg`
    },
    {
      id: 4,
      title: "Hélio Nhamposse",
      url: `${base}images/helio_portrait.jpg`
    }
  ],

  gifts: {
    intro: "A vossa presença e orações são o nosso maior presente. Para quem desejar nos abençoar com uma contribuição para o nosso novo lar e vida a dois:",
    paymentInfo: {
      mpesa: "M-Pesa: 84XXXXXXX (Hélio Nhamposse)",
      emola: "e-Mola: 86XXXXXXX / 87XXXXXXX (Margarida Guilima)"
    }
  }
};
