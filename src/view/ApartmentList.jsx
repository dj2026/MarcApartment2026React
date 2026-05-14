import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  BedDouble, Bath, Layers, Users, Warehouse, Thermometer, 
  Wind, Car, Star, Sofa, GraduationCap, Mountain, 
  Waves, Flower2, Ruler, Map, AlertCircle, Search, Filter 
} from "lucide-react";
import "../styles/List.css";

const LOGOS_ESCOLES = {
  "Escola Gravi": "/src/images/gravi.png",
  "Escola Palcam": "/src/images/palcam.jpg",
  "Escola Paideia": "/src/images/paideia.jpg"
};

const ApartmentList = () => {
  const [llistaPisos, setLlistaPisos] = useState([]);
  const [carregant, setCarregant] = useState(true);
  const [tempFiltres, setTempFiltres] = useState({
    text: "", 
    minPrice: null, 
    minSchools: 0, 
    minParking: null, 
    minReviews: null, 
    reviewKeyword: '', 
    reviewerName: ''
  });
  const [filtresAplicats, setFiltresAplicats] = useState({ ...tempFiltres });

  const handleReset = () => {
    const initial = {text: "", minPrice: null, minSchools: 0, minParking: null, minReviews: null, reviewKeyword: '', reviewerName: ''}; 
    setTempFiltres(initial); 
    setFiltresAplicats(initial);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    setTempFiltres(prev => ({
      ...prev, 
      [name]: name === "text" || name === "reviewKeyword" || name === "reviewerName" 
        ? value 
        : value === "" ? null : parseFloat(value)
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault(); 
    setFiltresAplicats({ ...tempFiltres });
  };

  const calcularDistanciaReal = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
    return distancia < 1 ? `${(distancia * 1000).toFixed(0)} m` : `${distancia.toFixed(2)} km`;
  };

  const calcularMitjana = (ressenyes) => { 
    if (!ressenyes || ressenyes.length === 0) return 0; 
    const suma = ressenyes.reduce((acc, r) => {
      const valor = parseFloat(r.rating); 
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0); 
    return (suma / ressenyes.length).toFixed(1);
  };

  // --- LÒGICA D'ACTUALITZACIÓ AUTOMÀTICA (POLLING) ---
  useEffect(() => {
    const carregarDades = async () => {
      try {
        const [resApartments, resSchools] = await Promise.all([
          axios.get("http://localhost:8080/api/apartment/list"),
          axios.get("http://localhost:8080/api/escola/llistar")
        ]);

        const escolesDB = Array.isArray(resSchools.data) ? resSchools.data : [];
        const dataArray = Array.isArray(resApartments.data) ? resApartments.data : [];

        const dadesEnriquides = dataArray.map(pisApi => {
          let rawSchools = Array.isArray(pisApi.schools) ? pisApi.schools : [];
          return {
            ...pisApi,
            schools: rawSchools.map(s => {
              const infoAdmin = escolesDB.find(e => 
                String(e.id) === String(s.id) || 
                e.name.trim().toLowerCase() === s.name.trim().toLowerCase()
              );
              const logoDades = s.logo || s.logoUrl || infoAdmin?.logo || infoAdmin?.logoUrl || "";
              let logoFinal = LOGOS_ESCOLES[s.name] || (logoDades ? (logoDades.startsWith('http') ? logoDades : `/src/images/${logoDades}`) : null);

              return {
                ...s,
                logo: logoFinal,
                schoolType: infoAdmin?.schoolType || "Pública",
                lat: s.lat || infoAdmin?.lat,
                lng: s.lng || infoAdmin?.lng
              };
            })
          };
        });
        setLlistaPisos(dadesEnriquides);
      } catch (error) {
        console.error("Error carregar dades:", error);
      } finally {
        setCarregant(false);
      }
    };

    carregarDades();
    const interval = setInterval(carregarDades, 5000); // Actualitza cada 5 segons
    return () => clearInterval(interval);
  }, []);

  const reviewersList = useMemo(() => {
    const noms = new Set();
    llistaPisos.forEach(pis => {
      pis.reviews?.forEach(r => { if (r?.reviewer?.name) noms.add(r.reviewer.name); });
    });
    return Array.from(noms).sort();
  }, [llistaPisos]);

  const pisosFiltrats = llistaPisos.filter((pis) => {
    const mitjana = parseFloat(calcularMitjana(pis.reviews));
    const tipus = filtresAplicats.text?.toLowerCase() || "";
    const reviewKeyword = filtresAplicats.reviewKeyword?.toLowerCase() || "";
    const reviewerNameFilter = filtresAplicats.reviewerName?.toLowerCase() || "";

    let reviewMatch = true;
    if (reviewerNameFilter) reviewMatch = pis.reviews?.some(r => r?.reviewer?.name.toLowerCase().includes(reviewerNameFilter));
    if (reviewKeyword) reviewMatch = reviewMatch && pis.reviews?.some(r => r?.comment?.toLowerCase().includes(reviewKeyword));

    return (
      (tipus === "" || pis.propertyType?.toLowerCase().includes(tipus)) &&
      (filtresAplicats.minPrice == null || pis.price >= filtresAplicats.minPrice) &&
      (filtresAplicats.minSchools == null || (pis.schools?.length || 0) >= filtresAplicats.minSchools) &&
      (filtresAplicats.minParking == null || (pis.parking || 0) >= filtresAplicats.minParking) &&
      (filtresAplicats.minReviews == null || mitjana >= filtresAplicats.minReviews) &&
      reviewMatch
    );
  });

  if (carregant) return <div className="loading">Carregant propietats...</div>;

  return (
    <div className="list-page-layout">
      <aside className="filters-sidebar">
        <form onSubmit={handleFilterSubmit}>
          <div className="sidebar-header">
            <Filter size={20} className="text-green" />
            <h2 style={{fontFamily: 'Monoton'}}>CERCADOR</h2>
          </div>
          <div className="filter-group">
            <label><Search size={14}/> TIPUS</label>
            <input type="text" name="text" value={tempFiltres.text} onChange={handleInputChange}/>
          </div>
          <div className="filter-group">
            <label>PREU (€)</label>
            <input type="number" name="minPrice" value={tempFiltres.minPrice || ''} onChange={handleInputChange}/>
          </div>
          <div className="filter-group">
            <label>ESCOLES ({tempFiltres.minSchools})</label>
            <input type="range" name="minSchools" value={tempFiltres.minSchools} onChange={handleInputChange}/>
          </div>
          <div className="filter-group">
            <label>PÀRQUING</label>
            <select name="minParking" value={tempFiltres.minParking || ''} onChange={handleInputChange}>
              <option value="">Tots</option>
              <option value="1">1 o més</option>
              <option value="2">2 o més</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Review Key</label>
            <input type="text" name="reviewKeyword" value={tempFiltres.reviewKeyword} onChange={handleInputChange} placeholder="Escriu..."/>
          </div>
          <div className="filter-group">
            <label>Nom del reviewer</label>
            <select name="reviewerName" value={tempFiltres.reviewerName} onChange={handleInputChange}>
              <option value="">Tots</option>
              {reviewersList.map((nom, idx) => (
                <option key={idx} value={nom}>{nom}</option>
              ))}
            </select>
          </div>
          <div className="sidebar-actions">
            <button type="submit" className="filter-submit-btn">FILTRAR</button>
            <button type="button" className="reset-filters-btn" onClick={handleReset}>NETEJAR</button>
          </div>
        </form>
      </aside>

      <main className="list-main-content">
        <div className="apartment-cards-container">
          {pisosFiltrats.map((pis) => {
            const esVigent = pis.id < 4;
            const mitjanaReviews = calcularMitjana(pis.reviews);

            return (
              <div key={pis.id} className={`apartment-card ${esVigent ? 'vigent' : 'baixa'}`}>
                <div className={`ribbon ${esVigent ? 'vigent' : 'baixa'}`}>{esVigent ? "VIGENT" : "BAIXA"}</div>
                
                <div className={`apartment-image ${esVigent ? '' : 'not-vigent'}`}>
                  <img src={`/src/images/${pis.id}.webp`} alt={pis.propertyType} onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Apartment"; }}/>
                </div>

                <div className="apartment-header">
                  <h2 className={`apartment-title ${esVigent ? 'vigent' : 'baixa'}`}>{pis.propertyType}</h2>
                </div>

                {esVigent ? (
                  <>
                    <div className="apartment-specs">
                      <span className="spec-item"><BedDouble size={30}/> <strong>{pis.bedrooms}</strong></span>
                      <span className="spec-item"><Ruler size={30}/> <strong>{pis.area} m²</strong></span>
                      <span className="spec-item"><Bath size={30}/> <strong>{pis.bathrooms}</strong></span>
                      <span className="spec-item"><Layers size={30}/> <strong>{pis.stories}</strong></span>
                      <span className="spec-item"><Map size={30}/> <strong>{pis.mainroad}</strong></span>
                      <span className="spec-item"><Users size={30}/> <strong>{pis.guestroom}</strong></span>
                      <span className="spec-item"><Warehouse size={30}/> <strong>{pis.basement}</strong></span>
                      <span className="spec-item"><Thermometer size={30}/> <strong>{pis.hotwaterheating}</strong></span>
                      <span className="spec-item"><Wind size={30}/> <strong>{pis.airconditioning}</strong></span>
                      <span className="spec-item"><Car size={30}/> <strong>{pis.parking}</strong></span>
                      <span className="spec-item"><Star size={30}/> <strong>{pis.prefarea}</strong></span>
                      <span className="spec-item"><Sofa size={30}/> <strong>{pis.furnishingstatus}</strong></span>
                      
                      {/* ✅ ESPECIFICACIONS DINÀMIQUES SOL·LICITADES */}
                      {pis.propertyType?.toLowerCase().includes("duplex") && (
                        <>
                          <span className="spec-item"><Mountain size={30} color="#28a745" /><strong>{pis.balcony}</strong></span>
                          <span className="spec-item"><Layers size={30} color="#28a745" /><strong>{pis.elevator}</strong></span>
                        </>
                      )}
                      {pis.propertyType?.toLowerCase().includes("house") && (
                        <>
                          <span className="spec-item"><Flower2 size={30} color="#28a745" /><strong>{pis.yardSize}m²</strong></span>
                          <span className="spec-item"><Waves size={30} color="#28a745" /><strong>{pis.pool}</strong></span>
                        </>
                      )}
                    </div>

                    <div className="apartment-footer">
                      <span className="rating"><Star size={16}/> <strong>{mitjanaReviews}</strong></span>
                      <span className="owner"><Users size={16}/> <strong>{pis.owner?.name || "Marc"}</strong></span>
                    </div>

                    {pis.schools?.length > 0 && (
                      <div className="apartment-schools">
                        <div className="schools-header"><GraduationCap size={18}/> <strong>ESCOLES:</strong></div>
                        <div className="schools-scroll-container">
                          {pis.schools.map((s, index) => (
                            <div key={s.id || index} className="school-card">
                              {s.logo ? (
                                <img src={s.logo} alt="logo" onError={(e) => { e.target.src = "https://via.placeholder.com/40x40?text=ESC"; }} />
                              ) : (
                                <div className="school-icon-placeholder">🏫</div>
                              )}
                              <div className="school-info">
                                <div className="school-name">{s.name}</div>
                                <div className="school-distance">{calcularDistanciaReal(pis.lat, pis.lng, s.lat, s.lng)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </> 
                ) : (
                  <div className="not-available">
                    <AlertCircle size={32}/>
                    <span className="not-available-title">PROPIETAT NO DISPONIBLE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ApartmentList;