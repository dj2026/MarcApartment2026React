import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Home, List, LayoutGrid, PlusCircle, Menu, X, Copyright } from 'lucide-react';
import ApartmentView from './view/ApartmentView';
import ApartmentList from './view/ApartmentList';
import ApartmentForm from './view/ApartmentForm';
import "./styles/Nav.css";

const queryClient = new QueryClient();

function App() {
  const [menu, setMenu] = useState(false); 
  const [veure, setVeure] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/apartment/getAll');
        if (response.ok) {

          // CUSTOM ALERTS
          Swal.fire({
            icon: 'success',
            title: 'Connexió activa 🚀',
            text: 'Backend sincronitzat correctament',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            position: 'center',
            backdrop: 'rgba(46, 204, 113, 0.1)',
          });
        } else {
          throw new Error("Error en la resposta del servidor");
        }
      } catch (err) {
        console.error("Detall de l'error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Sense connexió al Backend',
          html: `<hr>URL: http://localhost:8080/api/apartment/getAll</hr>`,
          confirmButtonText: 'Tornar a intentar',
          confirmButtonColor: 'red',
          position: 'center',
          allowOutsideClick: false ,
          backdrop: 'rgba(255, 0, 0, 0.25)',
        }).then((result) => {
          if (result.isConfirmed) window.location.reload(); 
        });
      }
    };
    checkBackend();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`main-wrapper ${menu ? "menu-active" : ""}`}>
        <div className="logo"><img src="./src/images/logo.webp" alt="Logo"/></div>
        
        {/* 2. Botón de menú con iconos dinámicos */}
        <button className={`toggle-menu-btn ${menu ? "active" : ""}`} onClick={() => setMenu(!menu)}>{menu ? <X size={40} /> : <Menu size={40} />}</button>

        <aside className={`sidebar ${menu ? "open" : ""}`}>
          <h2>Menú</h2>
          <nav>
            <ul>
              {/* 3. Iconos en la lista del Sidebar */}
              <li onClick={()=>{setMenu(false); setVeure(null);}}>
                <Home size={25} className="icon" /> Home
              </li>
              <li onClick={()=>{setMenu(false); setVeure("list"); }}>
                <List size={25} className="icon" /> ApartmentList
              </li>
              <li onClick={()=>{setMenu(false); setVeure(false);}}>
                <LayoutGrid size={25} className="icon" />ApartmentView
              </li>
              <li onClick={()=>{setMenu(false); setVeure(true);}}>
                <PlusCircle size={25} className="icon" />ApartmentForm
              </li>
            </ul>
          </nav>
        </aside>

        <main className="content">
          {veure === true &&   <ApartmentForm/>}
          {veure === "list" && <ApartmentList/>}
          {veure === false &&  <ApartmentView/>}
          {veure === null && (
            <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <br/><br/>
              <Home size={48} strokeWidth={1.5} />
              <span className="text-gradient">PintApart</span>
              <Home size={48} strokeWidth={1.5} />
            </h1>
          )}
        </main>

        <footer className="footer">
        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}> 
        <Copyright size={26} /> 2026 PintApart Project
        </h3>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;