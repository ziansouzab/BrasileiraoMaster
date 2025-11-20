import { Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import MatchesPage from "./pages/MatchesPage.jsx";
import MatchDetailsPage from "./pages/MatchDetailsPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <img src="/Logo-BrasileiraoMaster.png" alt="Logo Brasileirão Master" className="app-logo" />
          <div>
            <h1 className="app-title">Brasileirão Master</h1>
            <p className="app-subtitle">Seu painel avançado do Brasileirão Série A</p>
          </div>
        </div>

        <nav className="top-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link-active" : "")
            }
          >
            Tabela
          </NavLink>
          <NavLink
            to="/matches"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link-active" : "")
            }
          >
            Todos os Jogos
          </NavLink>
          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link-active" : "")
            }
          >
            Estatísticas Individuais
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams/:teamName" element={<TeamPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:index" element={<MatchDetailsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

