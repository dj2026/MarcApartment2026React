// Importem la funció createRoot de la llibreria react-dom per connectar React amb el DOM).
import { createRoot } from 'react-dom/client'

// IMPORT CSS
import './index.css'

// Importem el component principal de la nostra aplicació.
import App from './App.jsx'

// Execució:
// - Busca el <div> a index.html.
// - Crea el punt d'entrada de React en aquest element.
// - Pinta el component App dins del div seleccionat.
createRoot(document.getElementById('root')).render(<App/>)