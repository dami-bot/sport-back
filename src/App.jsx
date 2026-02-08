import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TiendaDeportiva from './pages/TiendaDeportiva';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TiendaDeportiva />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}