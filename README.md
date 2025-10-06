# 🥗 Agenda Nutricional - Sistema de Gestão para Nutricionistas

<div align="center">

![Agenda Nutricional](https://img.shields.io/badge/Agenda-Nutricional-059669?style=for-the-badge&logo=heart&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

**Sistema profissional de gestão para consultório de nutrição desenvolvido especialmente para a nutricionista Priscila Dalbem**

[🚀 Demo Live](https://aquamarine-genie-b2afdd.netlify.app) • [📱 PWA Install](#-instalação-como-pwa) • [🔧 Setup](#-instalação-e-configuração)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Uso do Sistema](#-uso-do-sistema)
- [PWA - Progressive Web App](#-pwa---progressive-web-app)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 🎯 Sobre o Projeto

A **Agenda Nutricional** é um sistema completo de gestão desenvolvido especificamente para consultórios de nutrição. O projeto foi criado para a nutricionista **Priscila Dalbem**, oferecendo uma solução moderna, intuitiva e profissional para gerenciar pacientes, agendamentos, finanças e muito mais.

### 🌟 Diferenciais

- ✅ **100% Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- ✅ **PWA Completo** - Instalável como aplicativo nativo
- ✅ **Offline First** - Funciona mesmo sem internet
- ✅ **Interface Moderna** - Design clean e profissional
- ✅ **Dados Locais** - Privacidade e segurança garantidas
- ✅ **Performance Otimizada** - Carregamento rápido e fluido

---

## 🚀 Funcionalidades

### 📊 Dashboard Inteligente
- Visão geral do consultório em tempo real
- Estatísticas de pacientes, consultas e receitas
- Próximas consultas agendadas
- Análise por tipo de atendimento

### 📅 Gestão de Agendamentos
- Criação e edição de consultas
- 5 tipos de atendimento pré-configurados:
  - 🥗 **Emagrecimento e Reeducação Alimentar** (R$ 150)
  - 🤱 **Gestantes e Tentantes** (R$ 180)
  - 💪 **Hipertrofia/Definição** (R$ 160)
  - 📊 **Controle de Taxas** (R$ 170)
  - 👩 **Saúde da Mulher** (R$ 165)
- Status de consultas (Agendado, Concluído, Cancelado)
- Filtros avançados por status e data

### 👥 Cadastro de Pacientes
- Ficha completa com dados pessoais
- Histórico médico e objetivos
- Cálculo automático de IMC
- Acompanhamento de evolução

### 💰 Controle Financeiro
- Receitas automáticas dos agendamentos
- Registro manual de receitas e despesas
- Relatórios por período (semana, mês, ano)
- Categorização de movimentações
- Cálculo de lucro líquido

### ⚙️ Configurações Avançadas
- Perfil profissional personalizável
- Horários de funcionamento
- Preços dos tipos de atendimento
- Sistema de notificações
- Central de notificações

### 🔔 Sistema de Notificações
- Lembretes de consultas
- Notificações de novos agendamentos
- Alertas de cancelamentos
- Lembretes de pagamento
- Suporte a email, SMS e browser

---

## 🛠 Tecnologias

### Frontend
- **React 18.3.1** - Biblioteca principal
- **TypeScript 5.5.3** - Tipagem estática
- **Tailwind CSS 3.4.1** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **Vite 5.4.2** - Build tool e dev server

### PWA & Performance
- **Service Worker** - Cache inteligente e offline
- **Web App Manifest** - Instalação como app nativo
- **Code Splitting** - Carregamento otimizado
- **Tree Shaking** - Remoção de código não utilizado
- **Terser** - Minificação avançada

### Qualidade de Código
- **ESLint** - Linting e padronização
- **TypeScript** - Type checking
- **Prettier** - Formatação automática

### SEO & Analytics
- **Meta Tags** - SEO otimizado
- **Open Graph** - Compartilhamento social
- **Structured Data** - Schema.org
- **Google Analytics** - Métricas de uso
- **Sitemap.xml** - Indexação

---

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o Repositório
```bash
git clone https://github.com/dgkeven/priscila-dalbem.git
cd priscila-dalbem
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
VITE_APP_NAME=Agenda Nutricional
VITE_GA_MEASUREMENT_ID=seu-google-analytics-id
VITE_API_BASE_URL=https://vfjalruycckafefhytfj.supabase.co
```

### 4. Execute o Projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### 5. Credenciais de Acesso
- **Email:** `prisciladalbem@gmail.com`
- **Senha:** `Nutrição`

---

## 📱 Uso do Sistema

### Login
1. Acesse a aplicação
2. Use as credenciais fornecidas
3. Clique em "Entrar"

### Navegação
- **Desktop:** Use a sidebar lateral
- **Mobile:** Use o menu hambúrguer ou navegação inferior

### Primeiro Uso
1. **Configure seu perfil** em Configurações
2. **Ajuste os preços** dos tipos de atendimento
3. **Cadastre seus pacientes** na seção Pacientes
4. **Crie agendamentos** na seção Agendamentos

### Funcionalidades Principais
- **Dashboard:** Visão geral do consultório
- **Agendamentos:** Gerencie suas consultas
- **Pacientes:** Cadastro e acompanhamento
- **Financeiro:** Controle de receitas e despesas
- **Configurações:** Personalize o sistema

---

## 📱 PWA - Progressive Web App

### Instalação como App Nativo

#### No Mobile (Android/iOS)
1. Abra o site no navegador
2. Toque no menu do navegador (⋮)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

#### No Desktop 
1. Clique no ícone de instalação na barra de endereços
2. Ou vá em Menu → "Instalar Agenda Nutricional"
3. Confirme a instalação

### Recursos PWA
- ✅ **Funciona offline** - Cache inteligente
- ✅ **Ícone na tela inicial** - Como app nativo
- ✅ **Splash screen** - Experiência profissional
- ✅ **Notificações push** - Lembretes importantes
- ✅ **Atualizações automáticas** - Sempre atualizado

---

## 📁 Estrutura do Projeto

```
agenda-nutricional/
├── public/                 # Arquivos estáticos
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service Worker
│   ├── sitemap.xml       # SEO sitemap
│   └── robots.txt        # Crawlers control
├── src/
│   ├── components/        # Componentes React
│   │   ├── Auth/         # Autenticação
│   │   ├── Dashboard/    # Dashboard
│   │   ├── Appointments/ # Agendamentos
│   │   ├── Patients/     # Pacientes
│   │   ├── Financial/    # Financeiro
│   │   ├── Settings/     # Configurações
│   │   └── Layout/       # Layout e navegação
│   ├── data/             # Dados e configurações
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilitários
│   │   ├── storage.ts    # Persistência local
│   │   ├── notifications.ts # Sistema de notificações
│   │   ├── analytics.ts  # Analytics
│   │   └── performance.ts # Performance
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globais
├── supabase/             # Database (futuro)
│   └── migrations/       # Migrações SQL
├── package.json          # Dependências
├── vite.config.ts        # Configuração Vite
├── tailwind.config.js    # Configuração Tailwind
└── tsconfig.json         # Configuração TypeScript
```
---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

[⬆ Voltar ao topo](#-agenda-nutricional---sistema-de-gestão-para-nutricionistas)

</div>