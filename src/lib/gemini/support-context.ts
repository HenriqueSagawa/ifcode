export const PLATFORM_CONTEXT = {
  name: "IFCode",
  description: "Plataforma educacional do Instituto Federal do Paraná para ensino de programação",
  mission: "Democratizar o acesso ao ensino de programação no Brasil",
  
  pages: {
    home: { path: "/", description: "Página inicial com apresentação da plataforma" },
    about: { path: "/sobre", description: "História e missão do IFCode" },
    team: { path: "/equipe", description: "Membros da equipe de desenvolvimento" },
    contact: { path: "/contato", description: "Informações de contato" },
    posts: { path: "/posts", description: "Artigos e tutoriais de programação" },
    chat: { path: "/chat", description: "Assistente de programação com IA" },
    login: { path: "/login", description: "Acesso à conta" },
    register: { path: "/register", description: "Criação de nova conta" }
  },

  contact: {
    email: "ifcodeprojeto@gmail.com",
    phone: "(44) 99805-0846",
    address: "Instituto Federal do Paraná - Campus Assis Chateaubriand",
    website: "https://ifcode.com.br"
  },

  features: [
    "Cursos gratuitos de programação",
    "Chatbot inteligente para dúvidas técnicas",
    "Artigos e tutoriais educacionais",
    "Comunidade de estudantes",
    "Suporte técnico especializado"
  ],

  quickAnswers: {
    publications: "Para encontrar publicações e artigos, acesse a página 'Posts' no menu principal. Lá você encontrará artigos sobre programação, tutoriais passo a passo, dicas e guias de desenvolvimento.",
    registration: "Para se cadastrar na plataforma, clique em 'Cadastrar' no menu superior, preencha o formulário com seus dados e confirme seu email. A plataforma é totalmente gratuita!",
    login: "Para fazer login, clique em 'Entrar' no menu superior, digite seu email e senha. Se esqueceu sua senha, use a opção 'Esqueci minha senha'.",
    contact: "Você pode entrar em contato pelo email contato@ifcode.com.br, telefone (41) 99999-9999, ou preenchendo o formulário na página de contato.",
    free: "Sim! O IFCode é uma plataforma 100% gratuita. Não cobramos nada pelos nossos cursos, recursos ou funcionalidades."
  }
} as const;
