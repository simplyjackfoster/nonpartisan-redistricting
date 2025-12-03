import { Link, Route, Routes } from 'react-router-dom';
import National from './pages/National';
import StateDetail from './pages/StateDetail';

function App() {
  return (
    <div>
      <header className="top-bar">
        <div className="brand">Atlas of Redistricting</div>
        <nav className="nav-links">
          <Link to="/">National</Link>
          <Link to="/state/Example%20West">Example West</Link>
          <button className="ghost-button" type="button">
            Show current district boundaries
          </button>
        </nav>
      </header>
      <main className="main-shell">
        <Routes>
          <Route path="/" element={<National />} />
          <Route path="/state/:stateName" element={<StateDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
