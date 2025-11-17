# Brasileirão Master – Frontend

Aplicação web em **React + Vite** para visualizar estatísticas do **Brasileirão Série A**.

O frontend consome a API do backend em FastAPI (projeto `BrasileiraoMaster/backend`) e exibe:

- Tabela completa do Brasileirão em cards clicáveis por time  
- Página detalhada de cada time com resumo da temporada e estatísticas dos jogadores  
- Lista completa de partidas com filtro por data  
- Detalhe de cada jogo com informações da partida  

---

## Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/en/main)

---

## Estrutura do projeto

Assumindo o seguinte layout de pastas:

```text
BrasileiraoMaster/
├── backend/
│   └── ... (API FastAPI)
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── config.js
        ├── components/
        │   ├── BackButton.jsx
        │   ├── TeamCard.jsx
        │   ├── PlayerCard.jsx
        │   └── MatchCard.jsx
        └── pages/
            ├── HomePage.jsx
            ├── TeamPage.jsx
            ├── MatchesPage.jsx
            └── MatchDetailsPage.jsx
