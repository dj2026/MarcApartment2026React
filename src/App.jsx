import React, {useState, useEffect, useCallback, useRef} from 'react';
import {BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {Hammer, Home, List, LayoutGrid, PlusCircle, Menu, X, Rocket, FolderOpen, FileCode, CheckCircle2, AlertTriangle, Map, Lock} from 'lucide-react';
import {Drawer} from '@mui/material';
import ApartmentView from './view/ApartmentView';
import ApartmentList from './view/ApartmentList';
import ApartmentPagination from './view/ApartmentPagination';
import ApartmentForm from './components/ApartmentForm';
import MapView from './view/MapView';
import Login from './pages/Login';
import SchoolForm from "./components/SchoolForm";
import RenovationForm from './components/RenovationForm';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProviders } from './providers/AppProviders';
import { AuthProvider } from './context/AuthContext'; 
import { ApartmentDataProvider } from './data/ApartmentDataContext'; 
import { SchoolDataProvider } from './data/SchoolDataContext';

import logo from './images/logo.webp';
import fonsImatge from './images/bc.webp'; 

import "./styles/Home.css";

const queryClient = new QueryClient();

function AppContent() {
  const [menu, setMenu] = useState(false);
  const [pas, setPas] = useState('comprovant');
  const [percentatge, setPercentatge] = useState(0);
  const [fitxerActual, setFitxerActual] = useState(""); 
  const [carpetaActual, setCarpetaActual] = useState(""); 
  const [carregaFinalitzada, setCarregaFinalitzada] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [fonsLlest, setFonsLlest] = useState(false);
  const [seleccionatMapa, setSeleccionatMapa] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMounted = useRef(true);
  const abortRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const img = new Image();
    img.src = fonsImatge;
    img.decode()
      .then(() => { if (isMounted.current) setFonsLlest(true); })
      .catch(() => { if (isMounted.current) setFonsLlest(true); });
    return () => {
      isMounted.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (pas === 'app') {document.body.classList.add('app-ready');} else {document.body.classList.remove('app-ready');}
  }, [pas]);

  const Arbre = [
    {nom: ".github/", fills: ["workflows/deploy.yml", "config.json"]},
    {nom: "apartment-predictor-frontend/",
      fills: [
        {nom: "docs/", fills: ["1.md", "Hooks.md", "Readme.md"]},
        {nom: "node_modules/", fills: ["react/", "lucide-react/", "sweetalert2/", "@mui/"]},
        {nom: "src/", fills: [
            {nom: "assets/", fills: ["react.svg"] },
            {nom: "components/", fills: ["ApartmentForm.jsx"]},
            {nom: "context/", fills: ["ApartmentContext.jsx"]},
            {nom: "images/", fills: ["bc.webp", "logo.webp"]},
            {nom: "view/", fills: ["ApartmentList.jsx", "ApartmentView.jsx", "MapView.jsx"]},
            "App.jsx", "index.css", "main.jsx"
          ]
        }
      ]
    }
  ];

  const motorRecursiu = useCallback(async (nivells) => {
    if (!nivells || !isMounted.current) return;
    let total = 0;
    const comptar = (nodes) => { if (!nodes) return; nodes.forEach(n => typeof n === 'string' ? total++ : comptar(n.fills));};
    comptar(nivells);
    let actual = 0;
    const escanejar = async (items) => {
      for (const item of items) {
        if (!isMounted.current) return;
        if (typeof item === 'string') {
          setFitxerActual(item);
          await new Promise(r => setTimeout(r, 60));
          actual++;
          setPercentatge(Math.min(100, Math.round((actual / (total || 1)) * 100)));
        } else {
          setCarpetaActual(item.nom);
          await new Promise(r => setTimeout(r, 300));
          if (item.fills) await escanejar(item.fills);
        }
      }
    };
    await escanejar(nivells);
    if (!isMounted.current) return;
    setCarregaFinalitzada(true);
    
    const checkReady = () => {
      if (fonsLlest) {
        document.body.classList.add('app-ready');
        setIsExiting(true);
        setTimeout(() => { if (isMounted.current) setPas('role-selection'); }, 800);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    setTimeout(checkReady, 1000);
  }, [fonsLlest]);

  const iniciarApp = useCallback(async () => {
    setPas('comprovant');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const resp = await fetch('http://localhost:8080/api/apartment/list', { signal: controller.signal });
      if (!resp.ok) throw new Error("Offline");
      setPas('loading');
      await motorRecursiu(Arbre);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setPas('error');
        Swal.fire({ icon: 'error', title: 'OFFLINE', text: "Backend Java no trobat.", background: '#000', color: '#0f0' });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motorRecursiu]);

  useEffect(() => { iniciarApp(); }, [iniciarApp]);

  if (pas === 'error') return (<div className="error-screen"><AlertTriangle size={80} /><h2 className="title">ERROR DE CONNEXIÓ</h2><button onClick={iniciarApp} className="btn-retry">REINTENTAR</button></div>);
  if (pas === 'comprovant') return null;
  if (pas === 'loading') return (
    <div className={`fullscreen-loading ${isExiting ? 'fade-out' : ''}`}>
      <div className="matrix-grid-bg">{Array(2500).fill(" PINTAPART 2026 ").map((t, i) => <span key={i}>{t}</span>)}</div>
      <div className="center-card">
        {!carregaFinalitzada ? <Rocket size={40} className="rocket-icon"/> : <CheckCircle2 size={40} className="check-icon" />}
        <h1 className="text-gradient1">PINT APART 2026</h1>
        <div className="progress-container"><div className="progress-fill" style={{ width: `${percentatge}%` }}></div></div>
        <div className="data-box">
          <div className="path-text"><FolderOpen size={20} /> <span>{carpetaActual ? carpetaActual.toUpperCase() : ""}</span></div>
          <div className="file-text"><FileCode size={20} /> <span>{fitxerActual || ""}</span></div>
        </div>
        <div className="footer-stats">
          <span className="text-gradient1">{!carregaFinalitzada ? "LOADING..." : "LLEST"}</span>
          <span className="percent-number">{percentatge}%</span>
        </div>
      </div>
    </div>
  );

 if (pas === 'role-selection') return (<Login onEnterAsVisitor={() => {setIsAdmin(false); setPas('app'); navigate('/');}} onAdminSuccess={() => {setIsAdmin(true); setPas('app'); navigate('/');}}/>);

  return (
    <div className={`main-wrapper ${menu ? "menu-active" : ""}`}><div className={`logo ${location.pathname === '/list' ? 'logo-small' : ''}`}><img src={logo} alt="Logo" /></div>
      <button className={`toggle-menu-btn ${menu ? "active" : ""}`} onClick={() => setMenu(!menu)}>
        {menu ? <X size={40} /> : <Menu size={40} />}
      </button>
      
      <Drawer anchor="right" open={menu} onClose={() => setMenu(false)} PaperProps={{ sx: { backgroundColor: "#0f0f0fdb", color: "#fff", width: 300, borderLeft: "2px solid #00ff00" } }}>
        <div className="drawer-content" style={{ padding: "50px 30px" }}>
          <h2 className="text-gradient1" style={{ fontSize: '1.5rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '30px' }}>MENÚ</h2>
          <nav>
            <ul style={{ listStyle: 'none' }}>
              {[
                {label: "Home", icon: <Home size={24} />, path: "/"},
                {label: "Apartments Stack", icon: <List size={24} />, path: "/pagination"},
                {label: "Apartment List", icon: <List size={24} />, path: "/list"},
                {label: "Apartment View", icon: <LayoutGrid size={24} />, path: "/view"},
                {label: "Apartment Form", icon: <PlusCircle size={24} />, path: "/form", adminOnly: true},
                {label: "Schools Form", icon: <PlusCircle size={24} />, path: "/schools", adminOnly: true},
                {label: "Reformes", icon: <Hammer size={24} />, path: "/renovations", adminOnly: true},
                {label: "Map View", icon: <Map size={24} />, path: "/map"},
              ].map(item => {
                const isLocked = item.adminOnly && !isAdmin;
                return (
                  <li key={item.path} onClick={() => { if (!isLocked) {setMenu(false); navigate(item.path);}}} className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${isLocked ? 'nav-item-red' : ''}`}>{isLocked ? <Lock size={24} /> : item.icon} <span>{item.label}</span></li>
                );
              })}
            </ul>
          </nav>
        </div>
      </Drawer>

      <main className="content">
        <Routes>
          <Route path="/" element={
            <div className="home-wrapper">
              <h1 className="title">🏠<span className="text-gradient2">PintApart</span>🏠</h1>
              <p className="slogan"><span className="special-font">PINT</span> els teus espais.<span className="gradient-text"><span className="special-font">APART</span> de la resta.</span></p>
              <button onClick={() => navigate("/list")} className="btn-explorar"><span>Explorar</span></button>
            </div>
          } />
          
          <Route element={<ProtectedRoute adminOnly={true} isAdmin={isAdmin} />}>
            <Route path="/form" element={<ApartmentForm isAdmin={isAdmin} />} />
            <Route path="/schools" element={<SchoolForm />} />
            <Route path="/renovations" element={<RenovationForm />}/>
          </Route>
          <Route path="/pagination" element={<ApartmentPagination setSeleccionatMapa={setSeleccionatMapa} />} />
          <Route path="/list" element={<ApartmentList setSeleccionatMapa={setSeleccionatMapa} />}/>
          <Route path="/view" element={<ApartmentView setSeleccionatMapa={setSeleccionatMapa} />}/>
          <Route path="/map" element={<MapView key={seleccionatMapa?.id || 'default-map'} pisFocus={seleccionatMapa}/>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ApartmentDataProvider> 
            <SchoolDataProvider>
              <AppProviders> 
                <AppContent />
              </AppProviders>
            </SchoolDataProvider>
          </ApartmentDataProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}