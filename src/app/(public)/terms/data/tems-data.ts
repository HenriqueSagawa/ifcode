export interface TermSection {
    id: string;
    title: string;
    content: string | string[];
  }
  
  export const termsData: TermSection[] = [
    {
      id: "introducao",
      title: "Quem somos e objeto",
      content: "O IFCode é uma plataforma educacional voltada à programação e à tecnologia, com recursos de publicação (fórum), interação entre usuários e um chatbot de apoio a estudos. A plataforma atende, em especial, a comunidade do IFPR – Câmpus Assis Chateaubriand, podendo ser utilizada por outros interessados. O objetivo é apoiar o aprendizado, a colaboração e o desenvolvimento de projetos."
    },
    {
      id: "cadastro",
      title: "Cadastro, conta e autenticação",
      content: [
        "Para acessar as funcionalidades como publicar conteúdos, comentar e usar o chatbot, é necessário criar uma conta e realizar o login.",
        "Você é responsável por manter a confidencialidade de suas credenciais e por toda atividade realizada em sua conta."
      ]
    },
    {
      id: "funcionalidades",
      title: "Funcionalidades e áreas do site",
      content: [
        "Fórum e publicações: espaço para criar e interagir com artigos, tutoriais, perguntas, discussões e projetos.",
        "Comentários e interação: possibilidade de comentar e responder conteúdos de outros usuários.",
        "Quem somos: apresentação da equipe responsável e perfis dos membros.",
        "Contato: formulário para dúvidas, relatos de falhas (bugs) e sugestões.",
        "Chatbot (IA): assistente virtual treinado para sanar dúvidas técnicas, disponível 24/7, com limitações (ver Seção 7)."
      ]
    },
    {
      id: "conduta",
      title: "Regras de conduta",
      content: [
        "Ao usar o IFCode, você se compromete a não:",
        "• violar leis aplicáveis, direitos de terceiros ou estes Termos;",
        "• publicar conteúdo ilegal, ofensivo, discriminatório, difamatório, violento ou que incite ódio;",
        "• infringir direitos autorais, marcas ou segredos comerciais;",
        "• compartilhar dados pessoais sensíveis de terceiros sem consentimento;",
        "• praticar spam, engenharia social, phishing, scraping, varredura de vulnerabilidades ou atividades que afetem a segurança e a disponibilidade da ferramenta;",
        "• burlar ou tentar burlar mecanismos de autenticação, registro de consentimento ou restrições técnicas.",
        "Moderação: conteúdos e contas podem ser removidos/suspensos quando violarem estas regras, mediante avaliação da equipe."
      ]
    },
    {
      id: "conteudo",
      title: "Conteúdo do usuário e licenças",
      content: [
        "Você mantém os direitos sobre o conteúdo que publicar, concedendo ao IFCode licença não exclusiva, mundial e gratuita para armazenar, exibir e disponibilizar seus conteúdos dentro da plataforma, apenas para fins de operação, promoção institucional do projeto e preservação de acervo.",
        "Você declara possuir os direitos necessários sobre o que publicar. Caso use materiais de terceiros, cite fontes e respeite licenças.",
        "Podemos remover ou bloquear conteúdos que violem estes Termos ou leis aplicáveis."
      ]
    },
    {
      id: "propriedade",
      title: "Propriedade intelectual da plataforma",
      content: "O código, identidade visual, marcas, textos institucionais, diagramas e demais ativos do IFCode são protegidos por direitos autorais e outras leis. Exceto quando expressamente permitido, é vedado copiar, modificar, distribuir, realizar engenharia reversa ou criar obras derivadas."
    },
    {
      id: "chatbot",
      title: "Avisos sobre o Chatbot com IA",
      content: "O chatbot é um recurso de apoio, sujeito a erros, lacunas e imprecisões. Ele não substitui a mediação humana nem a orientação de docentes/tutores. Use senso crítico ao aplicar as respostas; verifique fontes e exemplos práticos. Em dúvidas não resolvidas ou críticas, procure a equipe do projeto pelos canais de contato (ver Seção 13)."
    },
    {
      id: "disponibilidade",
      title: "Disponibilidade, alterações e manutenção",
      content: "A plataforma é fornecida no estado em que se encontra (\"as is\") e pode passar por manutenção, atualizações e melhorias. Esforçamo-nos para manter a disponibilidade e o desempenho, sem garantias de funcionamento ininterrupto. Funcionalidades podem ser alteradas ou descontinuadas a qualquer tempo."
    },
    {
      id: "responsabilidade",
      title: "Isenções e limitações de responsabilidade",
      content: [
        "O IFCode não se responsabiliza por danos indiretos, lucros cessantes, perda de dados ou prejuízos decorrentes do uso ou impossibilidade de uso da plataforma.",
        "As opiniões e conteúdos publicados por usuários são de responsabilidade de seus autores.",
        "Exercícios, códigos e respostas do chatbot devem ser revisados antes de uso em ambiente produtivo, avaliações acadêmicas ou projetos sensíveis."
      ]
    },
    {
      id: "lgpd",
      title: "Proteção de dados (LGPD)",
      content: [
        "Controlador: IFCode.",
        "Dados coletados: nome, e‑mail, foto de perfil (quando aplicável), dados de autenticação, conteúdos publicados, comentários, registros de consentimento (versão, data/hora, IP, user agent), métricas de uso, e dados técnicos para segurança e auditoria.",
        "Finalidades: operar a plataforma (login, fórum, contato), oferecer suporte, melhorar a experiência, garantir segurança, cumprir obrigações legais e comunicar alterações relevantes.",
        "Bases legais: execução de contrato, legítimo interesse (segurança, melhoria e estatísticas) e consentimento quando exigido (p. ex., comunicações opcionais e certas funcionalidades).",
        "Compartilhamento e operadores: provedores de infraestrutura, armazenamento e serviços de IA, exclusivamente para operar os recursos.",
        "Retenção: pelo tempo necessário às finalidades declaradas e conforme prazos legais. Conteúdos e logs podem ser retidos para auditoria e defesa de direitos.",
        "Direitos do titular: confirmação de tratamento, acesso, correção, anonimização/eliminação, portabilidade, informação sobre compartilhamento e revogação do consentimento. Solicitações podem exigir verificação de identidade.",
        "Segurança: medidas técnicas e administrativas proporcionais aos riscos (criptografia em trânsito, controle de acesso, monitoramento).",
        "Crianças e adolescentes: uso deve observar autorização e acompanhamento de responsável, conforme normas institucionais aplicáveis."
      ]
    },
    {
      id: "cookies",
      title: "Cookies e tecnologias semelhantes",
      content: "Utilizamos cookies/armazenamento local para autenticação, preferências, análise de uso e segurança. Você pode gerenciá‑los no navegador, ciente de que certas funções podem não operar sem eles."
    },
    {
      id: "comunicacoes",
      title: "Comunicações",
      content: "Podemos enviar avisos operacionais (mudanças nos Termos, privacidade, incidentes, interrupções programadas). Comunicados promocionais dependem de opt‑in e podem ser cancelados a qualquer momento (opt‑out)."
    },
    {
      id: "contato",
      title: "Suporte e contato",
      content: "Use a página Contato para enviar dúvidas, relatar bugs e propor melhorias. Informe dados suficientes (curso/área, descrição do problema, prints se possível). Alternativamente, utilize o e‑mail institucional informado no site."
    },
    {
      id: "alteracoes",
      title: "Alterações destes Termos",
      content: "Podemos atualizar estes Termos para refletir mudanças legais, técnicas ou operacionais. Publicaremos a nova versão com data de vigência e, quando alterações forem relevantes, adotaremos meios razoáveis de notificação. O uso contínuo após a vigência implica aceite da nova versão."
    },
    {
      id: "finais",
      title: "Disposições finais",
      content: [
        "Se qualquer cláusula for considerada inválida, as demais permanecem válidas.",
        "A tolerância quanto a descumprimento não implica renúncia de direito.",
        "Foro: para dirimir controvérsias, fica eleito o foro do domicílio do usuário, salvo norma legal em contrário."
      ]
    }
  ];
  
  export const termsMetadata = {
    title: "Termos de Uso da Plataforma IFCode",
    effectiveDate: "28 de agosto de 2025",
    lastUpdate: "28 de agosto de 2025",
    description: "Bem‑vindo à plataforma IFCode. Estes Termos de Uso regulam o acesso e a utilização do site e dos recursos disponibilizados aos usuários. Ao criar uma conta, fazer login ou utilizar qualquer funcionalidade, você concorda integralmente com estes Termos."
  };