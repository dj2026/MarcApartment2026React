import React from "react";
import { Plus, Pencil, RotateCcw, Trash2, Loader2, ShieldAlert, User } from "lucide-react";
import { useApartmentService } from "../middleware/apartment/apartmentServiceHooks";
import { useApartmentData } from "../data/ApartmentDataContext";
import Swal from "sweetalert2";
import "../styles/Form.css";

export default function ApartmentForm({ isAdmin = false }) {
  const api = useApartmentService();
  const { state, dispatch, apartments, refetch, isLoading } = useApartmentData();
  const { dadesForm, idEdicio } = state;

  const llistaPisos = React.useMemo(() => (Array.isArray(apartments) ? apartments : []), [apartments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ 
      type: "SET_FIELD", 
      field: name, 
      value: ["price", "lat", "lng", "ownerId"].includes(name) 
        ? (value === "" ? "" : Number(value)) 
        : value 
    });
  };

  const prepararPayload = (dades) => {
    const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomFloat = (base, offset) => Number((base + (Math.random() - 0.5) * offset).toFixed(6));

    const finalOwnerId = dades.ownerId;

    const payload = {
      ...dades,
      propertyType: dades.propertyType || "APARTMENT",
      price: dades.price ? Number(dades.price) : getRandom(150, 1950) * 1000,
      lat: dades.lat ? Number(dades.lat) : getRandomFloat(41.3851, 0.05),
      lng: dades.lng ? Number(dades.lng) : getRandomFloat(2.1734, 0.05),
      owner: { id: finalOwnerId },
      area: getRandom(60, 580),
      bedrooms: getRandom(1, 5),
      bathrooms: getRandom(1, 4),
      parking: getRandom(0, 5),
      stories: 1,
      mainroad: "yes",
      guestroom: "no",
      basement: "no",
      hotwaterheating: "no",
      airconditioning: "yes",
      prefarea: "yes",
      furnishingstatus: "semi-furnished"
    };

    if (!idEdicio) delete payload.id;
    delete payload.ownerId; 

    return payload;
  };

  const handleAction = async (type) => {
    if (!isAdmin) return Swal.fire({ icon: "error", title: "Permís denegat" });
    
    if (type === "DELETE") {
      const result = await Swal.fire({
        title: "Estàs segur?",
        text: "Aquesta acció no es pot desfer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Sí, esborrar"
      });
      if (!result.isConfirmed) return;
    }

    Swal.showLoading();

    try {
      const payload = prepararPayload(dadesForm);

      if (type === "CREATE") await api.createApartment(payload);
      else if (type === "UPDATE") await api.updateApartment({ ...payload, id: idEdicio });
      else if (type === "DELETE") await api.deleteApartment(idEdicio);

      dispatch({ type: "RESET" }); // Neteja el form incloent el ownerId
      await refetch(); 
      Swal.fire({ icon: "success", title: "Operació d'èxit", timer: 1000, showConfirmButton: false });
    } catch (error) {
      console.error("Error API:", error);
      Swal.fire({ icon: "error", title: "Error", text: "El servidor ha retornat un error (500)." });
    }
  };

  if (isLoading) return <div className="loading-state"><Loader2 className="animate-spin" /> Carregant dades...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="brand-header">
        🏠 <span className="text-gradient1">PintApart</span> 🏠
      </h1>

      {!isAdmin && <div className="admin-warning"><ShieldAlert size={20} /> Mode Lectura (Només Admin pot editar)</div>}
      
      <div className="card2">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-grid-inputs" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            
            <div className="form-group">
              <label>ID Propietat</label>
              <input value={idEdicio || "AUTO"} disabled className="readonly-input"/>
            </div>

            <div className="form-group">
              <label>ID Propietari (Owner)</label>
              <input 
                type="number" 
                name="ownerId" 
                value={dadesForm.ownerId || ""} 
                onChange={handleChange} 
                disabled={!isAdmin} 
                placeholder="Ex: 1, 2, 3..."
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Tipus de Propietat</label>
              <select name="propertyType" value={dadesForm.propertyType || "APARTMENT"} onChange={handleChange} disabled={!isAdmin}>
                <option value="APARTMENT">Apartment</option>
                <option value="DUPLEX">Duplex</option>
                <option value="HOUSE">House</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preu (€)</label>
              <input type="number" name="price" value={dadesForm.price || ""} onChange={handleChange} disabled={!isAdmin} placeholder="Buit = Aleatori"/>
            </div>

            <div className="form-group">
              <label>Latitud</label>
              <input type="number" step="any" name="lat" value={dadesForm.lat || ""} onChange={handleChange} disabled={!isAdmin} placeholder="Ex: 41.38"/>
            </div>

            <div className="form-group">
              <label>Longitud</label>
              <input type="number" step="any" name="lng" value={dadesForm.lng || ""} onChange={handleChange} disabled={!isAdmin} placeholder="Ex: 2.17"/>
            </div>
          </div>

          <div className="button-row" style={{ marginTop: "2rem", display: "flex", gap: "10px" }}>
            <button className="btn btn-create" onClick={() => handleAction("CREATE")} disabled={!isAdmin || !!idEdicio}>
              <Plus size={18} /> Crear Nou
            </button>
            <button className="btn btn-update" onClick={() => handleAction("UPDATE")} disabled={!isAdmin || !idEdicio}>
              <Pencil size={18} /> Desa Canvis
            </button>
            <button className="btn btn-delete" onClick={() => handleAction("DELETE")} disabled={!isAdmin || !idEdicio} style={{background: isAdmin ? "#ff4d4d" : "#ccc"}}>
              <Trash2 size={18} /> Eliminar
            </button>
            <button className="btn btn-reload" onClick={() => { dispatch({ type: "RESET" }); refetch(); }}>
              <RotateCcw size={18} /> Netejar
            </button>
          </div>
        </form>
      </div>

      <div className="table-card" style={{ marginTop: "2rem" }}>
        <table className="modern-table">
          <thead>
            <tr><th>ID</th><th>Owner ID</th><th>Tipus</th><th>Preu</th><th>Coordenades</th></tr>
          </thead>
          <tbody>
            {llistaPisos.map((pis) => (
              <tr 
                key={pis.id} 
                onClick={() => dispatch({ type: "SELECT", payload: { ...pis, ownerId: pis.owner?.id } })} 
                className={`table-row ${idEdicio === pis.id ? "selected" : ""}`}
              >
                <td>{pis.id}</td>
                <td><User size={14} style={{verticalAlign: 'middle', marginRight: '5px'}}/> {pis.owner?.id || "N/A"}</td>
                <td style={{ fontWeight: 'bold' }}>{pis.propertyType}</td>
                <td style={{ color: '#ff4081', fontWeight: 900 }}>{Number(pis.price || 0).toLocaleString()} €</td>
                <td style={{ fontSize: '0.85rem', color: '#888' }}>{pis.lat?.toFixed(3)}, {pis.lng?.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}