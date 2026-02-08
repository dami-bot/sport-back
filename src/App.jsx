import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importación limpia
import TiendaDeportiva from './pages/TiendaDeportiva';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TiendaDeportiva />} />
        <Route path="/admin" element={<Admin />} /> 
      </Routes>
    </BrowserRouter>
  );
}