import React, { useEffect, useState } from "react";
import axios from "axios";
import { BedDouble, Square, Car, Bath, Layers, Map, Users, Warehouse, Thermometer, Wind, Star, Sofa, Info, X, Home, List, PlusCircle, CheckCircle2 } from "lucide-react";
import Form from "./ApartmentForm";
import "../styles/App.css";

// --- 1. EL TEU CUSTOM HOOK (Lògica i Console Logs) ---
const useApartments = () => {
  const [apartments, setApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAxiosError, setIsAxiosError] = useState(false);

  useEffect(() => {
    const fetchApartments = async () => {
      // 1. Iniciem el cronòmetre aquí
      const t0 = performance.now(); 
      
      try {
        const response = await axios.get("/api/apartment/getAll");

        // 2. Calculem el final just en rebre la resposta
        const t1 = performance.now();

        /* CONSOLE LOGS */
        console.group("--- 🚀 DEBUG PINAPART ---");
        console.log("👤 Autor:", "Marc Monfort");
        console.log("📅 Data Sistema:", new Date().toLocaleString());
        console.log("📡 Estado API:", response.status);
        console.log("⏱️ Temps de càrrega:", (t1 - t0).toFixed(2) + " ms");
        console.log("📊 Total Apartaments:", response.data?.length);

        if (response.data && response.data.length > 0) {
          console.table(response.data.slice(0, 3)); 
          console.log("📦 Objecte 1:", response.data[0]);
          console.log("📦 Objecte 2:", response.data[1]);
          console.log("📦 Objecte 3:", response.data[2]);
        } else {
          console.warn("⚠️ Atenció: La llista d'apartaments està buida.");
        }
        console.groupEnd();

        // 3. Guardem les dades a l'estat
        setApartments(response.data);
        setIsLoading(false);

      } catch (error) {
        console.error("❌ Error carregant apartaments:", error);
        setIsAxiosError(true);
        setIsLoading(false);
      }
    };

    fetchApartments();
  }, []);

  return { apartments, isLoading, isAxiosError };
};

// --- 2. COMPONENT PRINCIPAL ---
const fonsDefault = "./src/images/bc.webp";

const ApartmentList = () => {
  // Cridem al hook que hem definit a sobre
  const { apartments, isLoading, isAxiosError } = useApartments();
  
  const [pisTriat, setPisTriat] = useState(null);
  const [imatgeFons, setImatgeFons] = useState(fonsDefault);
  const [menuObert, setMenuObert] = useState(false);
  const [veureForm, setVeureForm] = useState(false);

  return (
    <div className={`main-wrapper ${menuObert ? "menu-active" : ""}`}>
      <aside className={`sidebar ${menuObert ? "open" : ""}`}>
        <h2>Menú</h2>
        <nav>
          <ul>
            <li onClick={() => { setMenuObert(false); setVeureForm(null); }}><Home size={40} /> </li>
            <li onClick={() => { setMenuObert(false); setVeureForm(false); }}><List size={40} /> Veure Cards</li>
            <li onClick={() => { setMenuObert(false); setVeureForm(true); }}><PlusCircle size={40} />PintApart Form</li>
          </ul>
        </nav>
      </aside>

      <div className="logo"><img src="./src/images/logo.webp" alt="Logo" /></div>

      <div
        className="app-container"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${imatgeFons})`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
          width: '100vw', minHeight: '100vh', transition: 'background-image 0.8s ease'
        }}>

        <div className="wrap" onClick={() => menuObert && setMenuObert(false)}>

          {veureForm ? (
            <div className="form-view-wrapper" style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>
              <Form />
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="loading-state">Carregant dades...</div>
              ) : isAxiosError ? (
                <div className="error-state" style={{color: 'white', textAlign: 'center', paddingTop: '100px'}}>
                  <h2>Error de connexió amb l'API</h2>
                  <p>Revisa la consola (F12) per a més detalls.</p>
                </div>
              ) : (
                <div className="grid">
                  {apartments.map((pis, index) => (
                    <div
                      className="card"
                      key={pis.id}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onMouseEnter={() => setImatgeFons(`./src/images/${pis.id}.webp`)}
                      onMouseLeave={() => setImatgeFons(fonsDefault)}
                    >
                      <div className="card-header">
                        <div className="avatar-icon">
                          {pis.propertyType ? pis.propertyType[0] : <Home size={50} />}
                        </div>
                        <div className="header-info">
                          <span className="prop-type">{pis.propertyType}</span>
                          <span className="prop-id">ID: {pis.id}</span>
                        </div>
                      </div>
                      <div className="card-media">
                        <img src={`./src/images/${pis.id}.webp`} alt="Apartment" />
                      </div>
                      <div className="card-content">
                        <div className="price-label">{pis.price?.toLocaleString('es-ES')} €</div>
                        <div className="specs-bar">
                          <span><BedDouble size={40} /> {pis.bedrooms}</span>
                          <span><Square size={40} /> {pis.area} m²</span>
                          <span><Car size={40} /> {pis.parking}</span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button className="btn-action" onClick={() => setPisTriat(pis)}> + DETALLS</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL DETALLES */}
      {pisTriat && (
        <div className="modal-overlay" onClick={() => setPisTriat(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="header-wrapper">
              <button className="close-btn" onClick={() => setPisTriat(null)}><X size={30} />X</button>
            </div>
            <div className="modal-body">
              <div className="modal-image">
                <img src={`./src/images/${pisTriat.id}.webp`} alt="Main View" />
              </div>
              <div className="modal-info">
                <h2 className="spec-item">{pisTriat.propertyType}</h2>
                <div className="modal-price spec-item">{pisTriat.price?.toLocaleString('es-ES')}€</div>

                <div className="modal-specs-4-columns">
                  <span className="spec-item"><BedDouble size={40} color="#28a745" /> {pisTriat.bedrooms}</span>
                  <span className="spec-item"><Square size={40} color="#28a745" /> {pisTriat.area} m²</span>
                  <span className="spec-item"><Bath size={40} color="#28a745" /> {pisTriat.bathrooms}</span>
                  <span className="spec-item"><Layers size={40} color="#28a745" /> {pisTriat.stories}</span>
                  <span className="spec-item"><Map size={40} color="#28a745" /> {pisTriat.mainroad}</span>
                  <span className="spec-item"><Users size={40} color="#28a745" /> {pisTriat.guestroom}</span>
                  <span className="spec-item"><Warehouse size={40} color="#28a745" /> {pisTriat.basement}</span>
                  <span className="spec-item"><Thermometer size={40} color="#28a745" /> {pisTriat.hotwaterheating}</span>
                  <span className="spec-item"><Wind size={40} color="#28a745" /> {pisTriat.airconditioning}</span>
                  <span className="spec-item"><Car size={40} color="#28a745" /> {pisTriat.parking}</span>
                  <span className="spec-item"><Star size={40} color="#28a745" /> {pisTriat.prefarea}</span>
                  <span className="spec-item"><Sofa size={40} color="#28a745" /> {pisTriat.furnishingstatus}</span>
                </div>

                <div className="modal-description spec-item">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={30} color="#28a745" /> Descripció</h3>
                  <h4>{pisTriat.description || "Sense descripció disponible."}</h4>

                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={30} color="#28a745" /> Reviewer & Review</h3>
                  <h4>{pisTriat.reviewer || "Anònim"}: {pisTriat.review || "Cap review encara."}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentList;