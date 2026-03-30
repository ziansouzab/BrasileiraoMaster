##Brasileirão Master
O Brasileirão Master é uma plataforma completa para visualização de estatísticas detalhadas do Campeonato Brasileiro Série A. O projeto utiliza web scraping automatizado para coletar dados reais de desempenho de times e jogadores, expondo-os através de uma API robusta para uma interface moderna e responsiva.

##Estrutura do Projeto
O repositório está dividido em duas partes principais:

/backend: API desenvolvida em Python com FastAPI, responsável pela coleta (scraping), processamento e servimento dos dados.

/frontend: Aplicação SPA desenvolvida em React + Vite para consumo e exibição dos dados.

##Tecnologias Utilizadas
Backend
Python 3.11+

FastAPI: Framework web de alta performance.

Pandas: Processamento e normalização de dados.

Soccerdata (FBref): Biblioteca para coleta de dados futebolísticos.

Uvicorn: Servidor ASGI.

Frontend
React: Biblioteca UI.

Vite: Build tool rápida para desenvolvimento.

React Router DOM: Gerenciamento de rotas.

Tailwind CSS.

##Funcionalidades Principais
Backend (API)
Scraper Automatizado: Coleta e normaliza dados diretamente do FBref.

Armazenamento Local: Gera arquivos CSV para persistência de dados:

team_stats.csv: Estatísticas gerais das equipes.

players_stats.csv: Dados individuais de performance.

matches.csv: Resultados e detalhes das partidas.

##Cálculo de Classificação: Lógica interna para gerar a tabela de pontos, vitórias e saldo de gols em tempo real.

Endpoints REST: Disponibiliza os dados para o consumo do Frontend.

Frontend (Interface)
Dashboard: Tabela completa do Brasileirão com cards interativos.

Visão do Time: Detalhes da temporada e estatísticas do elenco.

Calendário de Jogos: Lista de partidas com filtros por data.

Página de Partida: Informações específicas sobre confrontos.

Leaderboards: Rankings de artilheiros, assistências e minutos jogados.

##**Como Executar**
#1. Configurando o Backend
Bash
cd backend
# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
# Instale as dependências
pip install -r requirements.txt
# Inicie o servidor
uvicorn app.main:app --reload
Nota: Para atualizar os dados manualmente, envie um POST para /api/admin/run-scraper.

#2. Configurando o Frontend
Bash
cd frontend
# Instale as dependências
npm install
# Inicie o modo de desenvolvimento
npm run dev


#Arquitetura de Pastas
Plaintext
BrasileiraoMaster/
├── backend/                # API FastAPI
│   ├── app/                # Lógica da aplicação
│   │   ├── scraper.py      # Script de coleta de dados
│   │   ├── services.py     # Processamento de lógica e cálculos
│   │   └── main.py         # Endpoints da API
│   └── data/csv/           # Persistência dos dados coletados
└── frontend/               # React + Vite
    ├── src/
    │   ├── components/     # Componentes reutilizáveis (Cards, Botões)
    │   └── pages/          # Páginas da aplicação (Home, Team, Matches)

    
#Melhorias Futuras
[ ] Autenticação: Implementar segurança nos endpoints administrativos.

[ ] Dockerização: Containerizar a aplicação para facilitar o deploy.

[ ] Redesign: Evoluir a identidade visual para um padrão de marca esportiva.

[ ] Banco de Dados: Migrar do CSV para PostgreSQL para maior escalabilidade.
