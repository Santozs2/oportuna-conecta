# Oportuna Conecta

> Plataforma de conexão entre alunos qualificados e oportunidades de emprego na indústria

---

## Sobre o Projeto

O **Oportuna Conecta** é uma aplicação web desenvolvida para facilitar a gestão e o encaminhamento de alunos egressos de programas de qualificação profissional para vagas na indústria química, de manutenção, automação e segurança do trabalho.

A plataforma centraliza o cadastro de alunos, o gerenciamento de vagas, a avaliação técnica e psicológica de competências, e o cruzamento inteligente entre perfis e oportunidades — tudo em uma interface moderna e acessível.

---

## Funcionalidades

### Dashboard
- Visão geral com total de alunos, vagas abertas, matches realizados e taxa de colocação
- Ranking das competências mais presentes no banco de talentos
- Histórico de matches recentes com pontuação de compatibilidade

### Gestão de Alunos
- Cadastro completo com nome, contato, localização, programa de formação e disponibilidade
- Seleção de até 5 competências por aluno, organizadas por categoria
- Indicador visual de progresso de avaliações por aluno

### Avaliação de Competências
- Banco de questões técnicas para mais de 20 competências industriais (NR-10, NR-35, Soldagem, CLP, Automação, entre outras)
- Avaliação psicológica universal com perguntas sobre autoconhecimento e postura profissional
- Pontuação técnica e psicológica separadas, com score total e status de aprovação
- Histórico completo de avaliações com data, pontuação e resultado

### Gestão de Vagas
- Cadastro de vagas com título, empresa, localização, faixa salarial e competências requeridas
- Busca e filtragem por título, empresa ou competência
- Visualização imediata dos alunos compatíveis com cada vaga

### Assistente de IA
- Interface conversacional para análise dos dados da plataforma
- Análise de desempenho geral dos alunos avaliados
- Geração automática de matches com score de compatibilidade (≥ 60%)
- Estatísticas gerais: alunos, vagas, avaliações e top competências aprovadas

---

## Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Estilização | Tailwind CSS |
| Componentes | shadcn/ui + Radix UI |
| Ícones | Lucide React |
| Notificações | Sonner |
| Formulários | React Hook Form |

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── AIMatchingAssistant.tsx   # Assistente conversacional de análise e matching
│   ├── Auth.tsx                  # Tela de login e cadastro
│   ├── CandidatesList.tsx        # Listagem e gestão de alunos
│   ├── Dashboard.tsx             # Painel com métricas e resumo
│   ├── Header.tsx                # Navegação principal
│   ├── JobsList.tsx              # Listagem e gestão de vagas
│   ├── SkillAssessment.tsx       # Motor de avaliação de competências
│   └── ThemeProvider.tsx         # Contexto de tema
├── App.tsx                       # Componente raiz e estado global
├── main.tsx                      # Ponto de entrada
└── index.css                     # Estilos globais e variáveis de tema
```

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/oportuna-conecta.git

# Acesse a pasta do projeto
cd oportuna-conecta

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Build para Produção

```bash
npm run build
```

Os arquivos gerados estarão na pasta `build/`.

---

## Avaliação de Competências

O módulo de avaliação cobre as seguintes áreas:

**Operação:** Operação de Equipamentos, Controle de Processos, Controle de Qualidade, Análises Laboratoriais

**Manutenção:** Manutenção Mecânica, Manutenção Elétrica, Soldagem, Hidráulica, Pneumática

**Instrumentação:** Instrumentação Industrial, Automação, CLP, Elétrica Industrial

**Segurança:** NR-10, NR-35, NR-33, Gestão de Riscos, Primeiros Socorros, Segurança Industrial

**Gestão:** Leitura de Desenhos, Gestão de Projetos, Controle de Documentação

Cada avaliação é composta por questões técnicas específicas da competência e questões psicológicas universais. A aprovação exige pontuação total igual ou superior a 70%.

---

## Créditos

- Componentes de UI: [shadcn/ui](https://ui.shadcn.com/) — licença MIT
- Ícones: [Lucide](https://lucide.dev/)
- Design original: Figma — Conexão de Competências e Oportunidades

---

## Licença

Este projeto foi desenvolvido com fins educacionais e de impacto social, voltado à empregabilidade de trabalhadores da indústria.