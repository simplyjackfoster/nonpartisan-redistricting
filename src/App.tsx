import { Link, Route, Routes } from 'react-router-dom';
import National from './pages/National';
import StateDetail from './pages/StateDetail';

function App() {
  return (
    <div>
      <header>
        <h1>Atlas of Redistricting</h1>
        <nav className="nav-links">
          <Link to="/">National</Link>
          <Link to="/state/Example%20West">Example West</Link>
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
