import React, { useEffect, useState } from "react";
import { useApartmentData } from "../data/ApartmentDataContext";
import { useSchoolData } from "../data/SchoolDataContext";
import { Apartments } from "../data/data";
import { 
    BedDouble, Square, Car, Bath, Layers, Map, Users, Warehouse, 
    Thermometer, Wind, Star, Sofa, Info, X, Home, Hash, 
    GraduationCap, Mountain, Waves, Flower2, Hammer, Plus 
} from "lucide-react";
import 'leaflet/dist/leaflet.css';
import "../styles/View.css";

const imatgeFonsDefault = "./images/bc.webp";

// --- LES TEVES FUNCIONS DE LÒGICA (MANTINGUDES) ---
const mergeApartmentsWithSchools = (apartments, schools, staticApartments) => {
    return apartments.map(pis => {
        const staticInfo = staticApartments.find(a => Number(a.id) === Number(pis.id));
        const escolesReals = schools.filter(e => {
            const pId = String(pis.id).trim();
            if (e.apartments && Array.isArray(e.apartments)) { 
                return e.apartments.some(a => String(a.id).trim() === pId); 
            }
            if (e.apartment && e.apartment.id) { 
                return String(e.apartment.id).trim() === pId; 
            }
            const idDirecte = e.apartmentId || e.idApartment;
            return idDirecte && String(idDirecte).trim() === pId;
        });
        const totes = [...(staticInfo?.schools || []), ...escolesReals];
        const senseDuplicats = totes.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
        return { 
            ...pis, 
            lat: pis.lat || staticInfo?.lat || 41.3851, 
            lng: pis.lng || staticInfo?.lng || 2.1734, 
            description: pis.description || staticInfo?.review || "Sense descripció", 
            schools: senseDuplicats, 
            contractVigent: pis.contractVigent !== undefined ? pis.contractVigent : true 
        };
    });
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

const ApartmentView = () => {
    const { apartments: apartmentsAPI, isLoading: aptLoading, isAxiosError: aptError, refetch: refetchApt } = useApartmentData();
    const { schools, isLoading: schoolLoading, isAxiosError: schoolError, refetch: refetchSchool } = useSchoolData();
    
    const apartments = mergeApartmentsWithSchools(apartmentsAPI || [], schools || [], Apartments);
    const isLoading = aptLoading || schoolLoading;
    const isAxiosError = aptError || schoolError;

    const [pisTriat, setPisTriat] = useState(null);
    const [activeTab, setActiveTab] = useState("detalls");
    const [novaReview, setNovaReview] = useState("");
    const [rating, setRating] = useState(5);
    const [reviewerName, setReviewerName] = useState("");
    const [operationType, setOperationType] = useState("LLOGAT");
    const [imatgeFons, setImatgeFons] = useState(imatgeFonsDefault);

    useEffect(() => { 
        document.body.style.overflow = pisTriat ? 'hidden' : 'auto'; 
        return () => { document.body.style.overflow = 'auto'; }; 
    }, [pisTriat]);

    const calcularMitjana = (reviews) => { 
        if (!reviews || reviews.length === 0) return "0.0"; 
        const suma = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0); 
        return (suma / reviews.length).toFixed(1); 
    };

    const handlePublicar = async () => {
        if (!novaReview.trim() || !reviewerName.trim()) { 
            alert("Si us plau, omple el teu nom i el comentari."); 
            return; 
        }
        const reviewData = {
            title: "Opinió",
            comment: novaReview || "",
            rating: Number(rating),
            date: new Date().toISOString().split('T')[0],
            apartment: { id: String(pisTriat.id), propertyType: pisTriat.propertyType ? pisTriat.propertyType.toUpperCase() : "APARTMENT" },
            reviewer: {
                id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                name: reviewerName || "",
                email: `${reviewerName.toLowerCase().replace(/\s/g, "")}@test.com`,
                operation: operationType,
                description: "Usuari registrat",
                experienceYears: 1
            }
        };
        try {
            const response = await fetch("http://localhost:8080/api/review/save", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(reviewData) 
            });
            if (response.ok) {
                const savedReview = await response.json();
                refetchApt();
                refetchSchool();
                setPisTriat(prev => ({ ...prev, reviews: [...(prev.reviews || []), savedReview] }));
                setNovaReview("");
                setReviewerName("");
                setRating(5);
                setActiveTab("reviews");
            } else {
                const errorText = await response.text();
                alert("No s'ha pogut guardar: " + errorText);
            }
        } catch (error) { 
            console.error("❌ Error de xarxa:", error); 
        }
    };

    const tancarModal = () => { 
        setPisTriat(null); 
        setActiveTab("detalls"); 
        setNovaReview(""); 
    };

    const tabStyle = (tab) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 40px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bolder',
        transition: 'all 0.5s ease',
        borderRadius: '0px',
        backgroundColor: activeTab === tab ? '#ff000069' : 'transparent',
        color: 'black',
        border: 'none',
        fontFamily: '"Monoton", sans-serif'
    });

    if (isLoading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Carregant la base de dades...</div>;
    if (isAxiosError) return <div style={{ color: 'red', textAlign: 'center', marginTop: '20%' }}>Error en connectar amb el servidor.</div>;

    return (
        <div className="main-wrapper" style={{ width: '100vw', margin: 0, padding: 0, overflowX: 'hidden' }}>
            <div className="app-container" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${imatgeFons})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', width: '100%', minHeight: '100vh', transition: 'background-image 0.8s ease', pointerEvents: pisTriat ? 'none' : 'auto' }}>
                <div className="wrap" style={{ width: '100%', maxWidth: 'none' }}>
                    <div className="grid">
                        {apartments.map((pis, index) => {
                            const esVigent = pis.contractVigent !== false;
                            return (
                                <div className={`card ${esVigent ? 'ribbon-vigent' : 'card-baixa'}`} key={pis.id || index} onMouseEnter={() => setImatgeFons(`./src/images/${pis.id}.webp`)} onMouseLeave={() => setImatgeFons(imatgeFonsDefault)}>
                                    <div className="card-header">
                                        <div className="avatar-icon">{pis.propertyType ? pis.propertyType[0] : <Home size={50} />}</div>
                                        <div className="header-info"><span className="prop-type"><strong>{pis.propertyType}</strong></span><span className="prop-id"><strong>ID: {pis.id}</strong></span></div>
                                    </div>
                                    <div className="card-media" style={{ position: 'relative' }}>
                                        <img src={`./src/images/${pis.id}.webp`} alt="Apartment" onError={(e) => e.target.src = imatgeFonsDefault} />
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#28a745', padding: '5px 12px', borderRadius: '20px', fontSize: '1em', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>👤</span><strong>{pis.owner?.name || "Marc"}</strong>
                                        </div>
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '5px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #ffc107' }}>
                                            <Star size={16} color="#ffc107" fill="#ffc107" />
                                            <strong style={{ color: 'white', fontFamily: '"Monoton",sans-serif' }}>{calcularMitjana(pis.reviews)}</strong>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <div className="price-label"><strong>{pis.price?.toLocaleString('es-ES')} €</strong></div>
                                        <div className="specs-bar">
                                            <span><BedDouble size={40} /> <strong>{pis.bedrooms}</strong></span>
                                            <span><Square size={40} /> <strong>{pis.area} m²</strong></span>
                                            <span><Car size={40} /> <strong>{pis.parking}</strong></span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button className={`btn-action ${esVigent ? 'vigent' : 'no-vigent'}`} onClick={() => esVigent && setPisTriat(pis)}>
                                            <strong>{esVigent ? "+ DETALLS" : "NO DISPONIBLE"}</strong>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {pisTriat && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }} onClick={tancarModal}>
                    <div style={{ maxWidth: '1200px', width: '90%', height: '86vh', display: 'flex', flexDirection: 'row', borderRadius: '40px', overflow: 'hidden', backgroundColor: 'white' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ flex: '0 0 45%', position: 'relative', height: '100%' }}>
                            <img src={`./src/images/${pisTriat.id}.webp`} alt="Prop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#28a745', padding: '8px 16px', borderRadius: '25px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                                <span>👤</span><strong>{pisTriat.owner?.name || "Marc"}</strong>
                            </div>
                            <button className="close-btn" onClick={tancarModal} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}><X size={30} /><strong>X</strong></button>
                        </div>

                        <div style={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column' }}>
                            <div className="tabs-wrapper" style={{width: '100%', backgroundColor: '#f8f9fa', borderBottom: '2px solid #000'}}>
                                <div className="tabs-scrollable" style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto',  overflowY: 'hidden',scrollBehavior: 'smooth',width: '100%'}}>
                                    {[
                                        {id: 'detalls', label: 'DETALLS', icon: <Info size={18} />},
                                        {id: 'escoles', label: 'ESCOLES', icon: <GraduationCap size={18} />},
                                        {id: 'reviews', label: 'REVIEWS', icon: <Users size={18} />},
                                        {id: 'renovations', label: 'REFORMES', icon: <Hammer size={18} />},
                                    ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{...tabStyle(tab.id),flex: '0 0 25%', boxSizing: 'border-box', padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', borderRight: '1px solid #ddd', fontSize: '10px',cursor: 'pointer',backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',borderBottom: activeTab === tab.id ? '4px solid #28a745' : 'none',transition: 'background-color 0.2s'}}>{tab.icon}<span style={{fontWeight: 'bold',whiteSpace: 'nowrap'}}>{tab.label} </span></button>))}
                                </div>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                                {activeTab === "detalls" && (
                                    <div className="animate-fade">
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '25px', paddingLeft: '5px' }}>
                                            <div style={{ borderLeft: '5px solid #28a745', padding: '5px', borderRadius: '4px', boxShadow: '0 1px 4px rgb(0, 0, 0)', minWidth: '100%', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <span style={{ color: 'black', padding: '4px 5px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>ID: #{pisTriat.contract?.id || pisTriat.id}</span>
                                                <span style={{ fontSize: '18px', fontWeight: '900', color: 'black', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{pisTriat.contract?.contractDetails || `Contracte ${pisTriat.propertyType}`}</span>
                                                <span style={{ fontSize: '15px', color: '#444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>📅 {pisTriat.contract?.contractDate || "2026-03-31"}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h2 style={{ margin: 0, color: 'black', fontFamily: 'Monoton, sans-serif' }}><Hash size={24} color="#28a745" /> <strong>{pisTriat.id}</strong></h2>
                                            <h2 style={{ margin: 0, color: 'black', fontFamily: 'Monoton, sans-serif', letterSpacing: '5px' }}><Home size={24} color="#28a745" /> <strong>{pisTriat.propertyType}</strong></h2>
                                            <h2 style={{ margin: 0, color: '#28a745', fontFamily: 'Monoton, sans-serif' }}><strong>{pisTriat.price?.toLocaleString('es-ES')} €</strong></h2>
                                        </div>
                                        <div className="modal-specs-4-columns" style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', gap: '10px', marginBottom: '10px' }}>
                                            <span className="spec-item"><BedDouble size={30} color="#28a745" /><strong>{pisTriat.bedrooms}</strong></span>
                                            <span className="spec-item"><Square size={30} color="#28a745" /><strong>{pisTriat.area} m²</strong></span>
                                            <span className="spec-item"><Bath size={30} color="#28a745" /><strong>{pisTriat.bathrooms}</strong></span>
                                            <span className="spec-item"><Layers size={30} color="#28a745" /><strong>{pisTriat.stories}</strong></span>
                                            <span className="spec-item"><Map size={30} color="#28a745" /><strong>{pisTriat.mainroad}</strong></span>
                                            <span className="spec-item"><Users size={30} color="#28a745" /><strong>{pisTriat.guestroom}</strong></span>
                                            <span className="spec-item"><Warehouse size={30} color="#28a745" /><strong>{pisTriat.basement}</strong></span>
                                            <span className="spec-item"><Thermometer size={30} color="#28a745" /><strong>{pisTriat.hotwaterheating}</strong></span>
                                            <span className="spec-item"><Wind size={30} color="#28a745" /><strong>{pisTriat.airconditioning}</strong></span>
                                            <span className="spec-item"><Car size={30} color="#28a745" /><strong>{pisTriat.parking}</strong></span>
                                            <span className="spec-item"><Star size={30} color="#28a745" /><strong>{pisTriat.prefarea}</strong></span>
                                            <span className="spec-item"><Sofa size={30} color="#28a745" /><strong>{pisTriat.furnishingstatus}</strong></span>
                                            {pisTriat.propertyType?.toLowerCase().includes("duplex") && (<><span className="spec-item"><Mountain size={30} color="#28a745" /><strong>{pisTriat.balcony}</strong></span><span className="spec-item"><Layers size={30} color="#28a745" /><strong>{pisTriat.elevator}</strong></span></>)}
                                            {pisTriat.propertyType?.toLowerCase().includes("house") && (<><span className="spec-item"><Flower2 size={30} color="#28a745" /><strong>{pisTriat.yardSize}m²</strong></span><span className="spec-item"><Waves size={30} color="#28a745" /><strong>{pisTriat.pool}</strong></span></>)}
                                        </div>
                                        <h3 style={{ color: 'black', fontFamily: 'Monoton, sans-serif', letterSpacing: '10px', fontSize: '30px', marginBottom: '10px' }}><strong>Descripció</strong></h3>
                                        <p style={{ color: 'black', fontSize: '18px', fontWeight: 'bolder' }}>{pisTriat.description}</p>
                                        <div style={{ marginTop: '30px', borderTop: '2px dashed #333', paddingTop: '20px' }}>
                                            <h4 style={{ color: 'black', marginBottom: '20px', fontWeight: 'bolder', fontFamily: 'Monoton, sans-serif', letterSpacing: '5px', fontSize: '30px' }}>DEIXA LA TEVA OPINIÓ:</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                    <input type="text" placeholder="Nom..." value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc', color: 'black', outline: 'none', width: '200px', backgroundColor: '#f9f9f9' }} />
                                                    <select value={operationType} onChange={(e) => setOperationType(e.target.value)} style={{ padding: '11px', borderRadius: '10px', backgroundColor: '#f0f0f0', cursor: 'pointer', outline: 'none', color: 'black', border: '1px solid #ccc', fontWeight: 'bold' }}>
                                                        <option value="LLOGAT">🏠 LLOGAT</option>
                                                        <option value="ALQUILAT">🔑 ALQUILAT</option>
                                                    </select>
                                                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ padding: '11px', borderRadius: '10px', backgroundColor: 'white', cursor: 'pointer', outline: 'none', color: 'black', border: '1px solid #ccc' }}>
                                                        <option value="5">5 ⭐⭐⭐⭐⭐</option>
                                                        <option value="4">4 ⭐⭐⭐⭐</option>
                                                        <option value="3">3 ⭐⭐⭐</option>
                                                        <option value="2">2 ⭐⭐</option>
                                                        <option value="1">1 ⭐</option>
                                                    </select>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <input type="text" placeholder="Escriu el teu comentari..." value={novaReview} onChange={(e) => setNovaReview(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePublicar()} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ccc', color: 'black', outline: 'none', backgroundColor: '#f9f9f9' }} />
                                                    <button onClick={handlePublicar} disabled={!novaReview.trim() || !reviewerName.trim()} style={{ backgroundColor: (novaReview.trim() && reviewerName.trim()) ? '#28a745' : '#ccc', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', cursor: (novaReview.trim() && reviewerName.trim()) ? 'pointer' : 'not-allowed', fontWeight: 'bold', transition: 'all 0.3s ease' }}>ENVIAR</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="reviews-container animate-fade">
                                        {pisTriat.reviews?.length > 0 ? (
                                            pisTriat.reviews.map((r, idx) => (
                                                <div key={idx} className="review-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                                                    <div className="review-header">
                                                        <div className="review-avatar">{r.reviewer?.name?.charAt(0) || "U"}</div>
                                                        <div className="reviewer-info">
                                                            <div className="reviewer-name">
                                                                {r.reviewer?.name || "Usuari verificat"}
                                                                <span style={{ fontSize: '10px', marginLeft: '10px', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '10px', border: '1px solid #2e7d32' }}>{r.reviewer?.operation || "S/N"}</span>
                                                            </div>
                                                            <div className="stars">{"⭐".repeat(r.rating)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="review-comment">"{r.comment}"</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-reviews">✨ Encara no hi ha opinions.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "escoles" && (
                                    <div className="animate-fade escoles-container">
                                        {pisTriat.schools?.length > 0 ? (
                                            pisTriat.schools.map((s, idx) => (
                                                <div key={s.id || idx} className="spec-item escola-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                                                    <div className="escola-header">
                                                        <div className="escola-info">
                                                            <h4 className="escola-nom">{s.name}</h4>
                                                            <div className="escola-tags">
                                                                <span className="tag-distancia">📍 {calcularDistanciaReal(pisTriat.lat, pisTriat.lng, s.lat, s.lng)}</span>
                                                                <span className="tag-tipus">{s.schoolType}</span>
                                                            </div>
                                                            {s.web && (<div className="escola-web-container"><a href={s.web.startsWith('http') ? s.web : `https://${s.web}`} target="_blank" rel="noopener noreferrer" className="btn-web">VISITAR WEB</a></div>)}
                                                        </div>
                                                        {(s.logo || s.logoUrl) && (<img src={s.logoUrl || s.logo} alt="logo" className="escola-logo" onError={(e) => e.target.style.display = 'none'} />)}
                                                    </div>
                                                </div>
                                            ))) : (<div className="escoles-empty">📍 No hi ha escoles properes.</div>)}
                                    </div>
                                )}
                                
                                {activeTab === "renovations" && (
                                    <div className="animate-fade">
                                        <h3 style={{ fontFamily: 'Monoton, sans-serif' }}>REFORMES I MANTENIMENT</h3>
                                        <p>Secció de reformes per a la propietat ID: {pisTriat.id}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApartmentView;