# Brasileirão Série A – Backend (FastAPI)

Backend em **Python + FastAPI** para expor, via API, dados do Brasileirão Série A
coletados do FBref usando a biblioteca **soccerdata**.

Ele:

- Roda um **scraper** que baixa e normaliza os dados da liga;
- Salva 3 arquivos CSV locais:
  - `*_team_stats.csv`
  - `*_players_stats.csv`
  - `*_matches.csv`
- Calcula a **classificação (pontos, vitórias, saldo, etc.)** a partir dos jogos;
- Expõe tudo em endpoints REST para o front-end em React.

---

## Tecnologias

- Python 3.11+
- FastAPI
- Uvicorn
- Pandas
- Soccerdata (FBref)

---

## Instruções

Para atualizar as tabelas, basta enviar uma requisição POST para o endpoint: 
"/api/admin/run-scraper"

---

## Futuras Melhorias
- Adicionar métodos de autenticação nos endpoints
- Dockerizar a aplicação para replicação fácil em qualquer ambiente

---

## Estrutura de pastas (backend)

```text
backend/
  app/
    __init__.py
    config.py
    scraper.py
    services.py
    main.py
  data/
    csv/
      bra_serie_a_2025_team_stats.csv
      bra_serie_a_2025_players_stats.csv
      bra_serie_a_2025_matches.csv


