# Oportuna Conecta

> Plataforma web para conectar alunos de programas de qualificação profissional a oportunidades de emprego na indústria.

[![TypeScript](https://img.shields.io/badge/TypeScript-78%25-3178C6?style=flat&logo=typescript&logoColor=white)](https://github.com/Santozs2/oportuna-conecta)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

---

## Sobre o Projeto

O **Oportuna Conecta** centraliza o cadastro de alunos egressos de qualificação profissional, o gerenciamento de vagas industriais, a avaliação técnica e psicológica de competências e o matching inteligente entre perfis e oportunidades — tudo separado por usuário, com autenticação segura e banco de dados persistente.

---

## Funcionalidades

- **Autenticação** — Cadastro e login com senha criptografada (bcryptjs) e token JWT
- **Dashboard** — Métricas em tempo real: alunos, vagas, matches e taxa de colocação
- **Gestão de Alunos** — Cadastro completo com competências, programa de formação e disponibilidade
- **Avaliação de Competências** — Banco com 20+ competências industriais, pontuação técnica e psicológica
- **Gestão de Vagas** — Cadastro de oportunidades com filtragem e matching automático
- **Assistente de IA** — Interface conversacional para análise de dados e geração de matches
- **Dados por Usuário** — Cada usuário vê apenas seus próprios alunos, vagas e avaliações

---

## Tecnologias

### Frontend
| Tecnologia | Versão |
|---|---|
| React | 18 |
| TypeScript | 5 |
| Vite | 6 |
| Tailwind CSS | 3 |
| shadcn/ui | latest |
| Lucide React | latest |
| Sonner | latest |

### Backend
| Tecnologia | Versão |
|---|---|
| Node.js | 22+ |
| Express | 4 |
| MySQL2 | 3 |
| bcryptjs | 2 |
| jsonwebtoken | 9 |
| dotenv | 17 |

---

## Estrutura do Projeto

```
oportuna-conecta/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Login e cadastro de usuários
│   │   ├── candidates.js    # CRUD de alunos
│   │   ├── jobs.js          # CRUD de vagas
│   │   └── assessments.js   # CRUD de avaliações
│   ├── server.js            # Servidor Express + conexão MySQL
│   └── .env                 # Variáveis de ambiente (não versionado)
├── src/
│   ├── components/
│   │   ├── AIMatchingAssistant.tsx
│   │   ├── Auth.tsx
│   │   ├── CandidatesList.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── JobsList.tsx
│   │   ├── SkillAssessment.tsx
│   │   └── ThemeProvider.tsx
│   ├── api.ts               # Funções de comunicação com o backend
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- MySQL Workbench (opcional)

### 1. Clone o repositório

```bash
git clone https://github.com/Santozs2/oportuna-conecta.git
cd oportuna-conecta
```

### 2. Configure o banco de dados

Abra o MySQL Workbench e execute:

```sql
CREATE DATABASE oportuna;
USE oportuna;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  type VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  location VARCHAR(100),
  program VARCHAR(100),
  completion_date DATE,
  availability VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE candidate_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  skill VARCHAR(100) NOT NULL,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  location VARCHAR(100),
  salary VARCHAR(50),
  type VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'open',
  posted_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE job_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  skill VARCHAR(100) NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  skill VARCHAR(100) NOT NULL,
  status VARCHAR(20),
  technical_score INT,
  psychological_score INT,
  total_score INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);
```

### 3. Configure as variáveis de ambiente do backend

Crie o arquivo `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=oportuna
JWT_SECRET=oportuna_secret_key
PORT=5000
```

### 4. Inicie o backend

```bash
cd backend
npm install
node server.js
```

O terminal deve exibir:
```
Servidor rodando na porta 5000
Conectado ao MySQL!
```

### 5. Inicie o frontend

Em outro terminal, na raiz do projeto:

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

---

## Avaliação de Competências

O módulo cobre mais de 20 competências industriais divididas em 5 categorias:

- **Operação** — Operação de Equipamentos, Controle de Processos, Controle de Qualidade, Análises Laboratoriais
- **Manutenção** — Mecânica, Elétrica, Soldagem, Hidráulica, Pneumática
- **Instrumentação** — Instrumentação Industrial, Automação, CLP, Elétrica Industrial
- **Segurança** — NR-10, NR-35, NR-33, Gestão de Riscos, Primeiros Socorros
- **Gestão** — Leitura de Desenhos, Gestão de Projetos, Controle de Documentação

A aprovação exige pontuação total igual ou superior a **70%**.

---

## Créditos

- UI Components: [shadcn/ui](https://ui.shadcn.com/) — MIT License
- Ícones: [Lucide](https://lucide.dev/)
- Design: Figma — Conexão de Competências e Oportunidades

---

## Autor

Desenvolvido por [Santozs2](https://github.com/Santozs2)