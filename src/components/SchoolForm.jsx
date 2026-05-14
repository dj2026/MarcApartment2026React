import React, { useEffect, useMemo, useCallback, useRef, useState, useReducer } from "react";
import { RotateCcw, Loader2, MapPin, Home, Link as LinkIcon, Globe, Trash2 } from "lucide-react";

// 1. Serveis, Contexts i Hooks propis
import { useSchoolService } from '../middleware/school/schoolServiceHooks';
import { useSchoolData } from "../data/SchoolDataContext";

import "../styles/FormSchool.css";
import { Apartments } from "../data/data";

const initialState = {
  name: "",
  schoolType: "",
  logoUrl: "",
  web: "",
  address: "",
  educationLevel: "",
  apartmentId: "",
  lat: "",
  lng: ""
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SELECT":
      return { ...action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function SchoolForm() {
  const api = useSchoolService();
  const { schools, refetch, isLoading: contextLoading } = useSchoolData();
  
  // Estats de control
  const [editingId, setEditingId] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const lastSelectedId = useRef(null);

  // Reducer
  const [formData, dispatch] = useReducer(formReducer, initialState);

  // --- LÒGICA DE DADES ---
  const llistaEscoles = useMemo(() => {
    // Si tenim dades del context (escoles de la DB), les usem
    if (schools && schools.length > 0) return schools;
    
    // Si no, fallback a les dades estàtiques d'Apartments
    if (!Array.isArray(Apartments)) return [];
    return Apartments.flatMap(ap => 
      (ap.schools || []).map(s => ({ 
        ...s, 
        apartments: [{ id: ap.id, propertyType: ap.propertyType }] 
      }))
    );
  }, [schools]);

  const getImageUrl = useCallback((url, name = "") => {
    if (!url || typeof url !== 'string' || url.trim().length < 2) {
      const nom = name?.toLowerCase() || "";
      if (nom.includes("gravi")) return "/images/gravi.png";
      if (nom.includes("palcam")) return "/images/palcam.jpg";
      if (nom.includes("paideia")) return "/images/paideia.jpg";
      return "/images/logo.webp";
    }
    if (url.startsWith('http')) return url;
    return `/images/${url.split('/').pop()}`;
  }, []);

  // --- CALLBACKS D'ACCIÓ ---
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;
    if (name === "lat" || name === "lng") finalValue = value === "" ? "" : parseFloat(value);
    if (name === "apartmentId") finalValue = value === "" ? "" : parseInt(value, 10);
    dispatch({ type: "SET_FIELD", field: name, value: finalValue });
  }, []);

  const handleAction = async (type) => {
    if (isPending || !formData?.name?.trim()) return;
    setIsPending(true);

    const selectedApt = Apartments.find(a => String(a.id) === String(formData.apartmentId));
    const payload = {
      ...formData,
      apartments: selectedApt ? [{ 
        id: selectedApt.id, 
        propertyType: (selectedApt.propertyType || "APARTMENT").toUpperCase() 
      }] : []
    };

    try {
      if (type === 'create') {
        await api.createSchool(payload);
      } else {
        await api.updateSchool(editingId, payload);
      }
      await refetch(); // Refrescar dades del context
      dispatch({ type: "RESET" });
      setEditingId(null);
    } catch (error) {
      console.error("Error en l'acció:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteLocal = useCallback(async (id, e) => {
    e.stopPropagation();
    const result = await api.alert?.fire({
      title: 'Eliminar escola?',
      text: "Aquesta acció no es pot desfer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, esborra',
      cancelButtonText: 'No'
    });

    if (result?.isConfirmed) {
      try {
        await api.deleteSchool(id);
        await refetch();
      } catch (error) {
        console.error("Error eliminant:", error);
      }
    }
  }, [api, refetch]);

  // --- EFECTES ---
  useEffect(() => {
    if (editingId && editingId !== lastSelectedId.current) {
      const escola = llistaEscoles.find((e) => String(e.id) === String(editingId));
      if (escola) {
        lastSelectedId.current = editingId;
        const apartmentId = escola.apartments?.[0]?.id || "";
        dispatch({ type: "SELECT", payload: { ...escola, apartmentId } });
      }
    } else if (!editingId) {
      lastSelectedId.current = null;
    }
  }, [editingId, llistaEscoles]);

  // --- TAULA ---
  const taulaEscolesMemo = useMemo(() => (
    <div className="table-card1">
      <table className="modern-table1">
        <thead>
          <tr><th>Logo</th><th>ID</th><th>Escola</th><th>Tipus</th><th>Accions</th></tr>
        </thead>
        <tbody>
          {llistaEscoles.map((esc) => (
            <tr 
              key={esc.id} 
              onClick={() => setEditingId(esc.id)} 
              className={String(editingId) === String(esc.id) ? "selected1" : ""} 
              style={{ cursor: 'pointer' }}
            >
              <td style={{ textAlign: 'center' }}>
                <img 
                  src={getImageUrl(esc.logoUrl, esc.name)} 
                  alt="logo" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain', background: 'white', border: '1px solid #eee' }} 
                  onError={(e) => { e.target.src = "/images/logo.webp"; }} 
                />
              </td>
              <td><span className="id-badge1">{esc.id}</span></td>
              <td><strong>{esc.name}</strong><br/><small>{esc.address}</small></td>
              <td><span className={`badge-${esc.schoolType?.toLowerCase()}1`}>{esc.schoolType}</span></td>
              <td style={{ textAlign: 'center' }}>
                <button 
                  type="button"
                  onClick={(e) => handleDeleteLocal(esc.id, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Trash2 size={18} color="#ff4d4d" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ), [llistaEscoles, editingId, getImageUrl, handleDeleteLocal]);

  if (contextLoading) return <div className="loading-container"><Loader2 className="spinner animate-spin" /></div>;

  return (
    <div className="dashboard-container1">
      <h1 className="brand-header1">🏫 <span className="text-gradient1">School Manager</span></h1>

      <div className="card21" style={{ opacity: isPending ? 0.7 : 1 }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 2.5fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group1">
              <label>ID</label>
              <input value={editingId || "AUTO"} disabled className="readonly-input1" />
            </div>
            <div className="form-group1">
              <label>Nom de l'Escola</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Escola Gravi" />
            </div>
            <div className="form-group1">
              <label>Tipus</label>
              <select name="schoolType" value={formData.schoolType} onChange={handleChange} className="select-input1">
                <option value="">Tria...</option>
                <option value="Publica">Publica</option>
                <option value="Concertada">Concertada</option>
                <option value="Privada">Privada</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group1">
              <label><LinkIcon size={14} /> Logo Escola (URL)</label>
              <input name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="Ex: gravi.png" />
            </div>
            <div className="form-group1">
              <label><Globe size={14} /> URL Web Oficial</label>
              <input name="web" type="url" value={formData.web} onChange={handleChange} placeholder="https://www.web.cat" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group1">
              <label>Adreça</label>
              <input name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group1">
              <label>Nivell</label>
              <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="select-input1">
                <option value="">Tria nivell...</option>
                <option value="Infantil">Infantil</option>
                <option value="Primaria">Primària</option>
                <option value="Secundaria">Secundària</option>
              </select>
            </div>
            <div className="form-group1">
              <label><Home size={14} /> Assignar a Pis</label>
              <select name="apartmentId" value={formData.apartmentId} onChange={handleChange} className="select-input1">
                <option value="">Cap pis assignat</option>
                {Apartments.map((apt) => (
                  <option key={`apt-${apt.id}`} value={apt.id}>
                    {apt.id} - {apt.propertyType}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', padding: '10px', backgroundColor: '#f8faff', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
            <div className="form-group1">
              <label><MapPin size={14} /> Latitud</label>
              <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} />
            </div>
            <div className="form-group1">
              <label><MapPin size={14} /> Longitud</label>
              <input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} />
            </div>
          </div>

          <div className="button-row1">
            <button type="button" className="btn1 btn-create1" onClick={() => handleAction('create')} disabled={!!editingId || isPending}>
              {isPending && !editingId ? <Loader2 className="animate-spin" size={16} /> : "Crear"}
            </button>
            <button type="button" className="btn1 btn-update1" onClick={() => handleAction('update')} disabled={!editingId || isPending}>
              {isPending && editingId ? <Loader2 className="animate-spin" size={16} /> : "Actualitzar"}
            </button>
            <button type="button" className="btn1 btn-reload1" onClick={() => { setEditingId(null); dispatch({ type: "RESET" }); }} disabled={isPending}>
              <RotateCcw size={16} /> Netejar
            </button>
          </div>
        </form>
      </div>

      {taulaEscolesMemo}
    </div>
  );
}