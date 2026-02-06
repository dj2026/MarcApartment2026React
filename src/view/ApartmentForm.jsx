import React, { useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, RotateCcw, Trash2, Rocket } from 'lucide-react';
import { faker } from '@faker-js/faker'; 
import "../styles/Form.css";


const API_URL = "http://localhost:8080/api/apartment";

const MySwal = Swal.mixin({
  position: 'center',
  showConfirmButton: true,
  customClass: { 
    popup: 'my-swal-popup', 
    confirmButton: 'my-swal-confirm', 
    cancelButton: 'my-swal-cancel'
  }, 
  buttonsStyling: false
});

const api = {
  getAll: () => axios.get(`${API_URL}/getAll`).then(res => res.data),
  create: (payload) => axios.post(`${API_URL}/create`, payload),
  update: (payload) => axios.put(`${API_URL}/update`, payload),
  delete: (id) => axios.delete(`${API_URL}/deleteById/${id}`),
  resetDB: () => axios.delete(`${API_URL}/reset`) 
};

export default function ApartmentManager() {
  const queryClient = useQueryClient();

  const estadoInicial = { 
    id: "", propertyType: "", price: 0, review: "", description: "", area: 0, 
    bedrooms: 0, bathrooms: 0, stories: 0, parking: 0,
    mainroad: "no", guestroom: "no", basement: "no", 
    hotwaterheating: "no", airconditioning: "no", 
    prefarea: "no", furnishingstatus: "unfurnished"
  };

  const [dadesForm, setDadesForm] = useState(estadoInicial);
  const [editingId, setEditingId] = useState(null);

  // --- QUERY ---
  const { data: serverData, isLoading, refetch } = useQuery({
    queryKey: ['apartments'],
    queryFn: api.getAll,
  });

  // --- LÒGICA DE LA LLISTA ---
  const llistaPisos = useMemo(() => {
    const dadesBase = (serverData && Array.isArray(serverData)) ? serverData : [];
    return dadesBase.map(pis => ({
      ...pis,
      propertyType: pis.propertyType || pis.name || "Sense tipus",
      price: Number(pis.price) || 0,
      review: pis.review || "",
      description: pis.description || ""
    }));
  }, [serverData]);

  // --- MUTACIONS ---
  const mutationCrear = useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['apartments']);
      setDadesForm(estadoInicial);
      MySwal.fire({ title: 'Creat!', icon: 'success', timer: 1000, showConfirmButton: false, backdrop: 'rgba(46, 204, 113, 0.1)'});
    },
    onError: (error) => {
      console.error("Error al crear:", error);
      MySwal.fire('Error', 'No s\'ha pogut crear l\'apartament', 'error');
    }
  });

  const mutationUpdate = useMutation({
    mutationFn: (payload) => api.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['apartments']);
      setEditingId(null);
      setDadesForm(estadoInicial);
      MySwal.fire({ title: 'Actualitzat!', icon: 'success', timer: 1000, showConfirmButton: false, backdrop: 'rgba(46, 204, 113, 0.1)',});
    },
    onError: (error) => {
      console.error("Error al update:", error);
      MySwal.fire('Error', 'No s\'ha pogut actualitzar', 'error');
    }
  });

  const mutationDelete = useMutation({
    mutationFn: api.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['apartments']);
      setEditingId(null);
      setDadesForm(estadoInicial);
      MySwal.fire({ title: 'Eliminat!', icon: 'success', timer: 1000, showConfirmButton: false , backdrop: 'rgba(46, 204, 113, 0.1)'});
    },
    onError: (error) => {
      console.error("Error al eliminar:", error);
      MySwal.fire('Error', 'No s\'ha pogut eliminar', 'error');
    }
  });

  // --- HANDLERS ---
  const handleRevertir = async () => {
    const result = await MySwal.fire({
      title: 'Restaurar originals?',
      text: "Això esborrarà les dades actuals i restaurarà els preus i IDs base.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, revertir',
      cancelButtonText: 'Cancel·lar',
      backdrop: 'rgba(255, 0, 0, 0.25)'
    });

    if (result.isConfirmed) {
      try {
        await api.resetDB();
        setEditingId(null);
        setDadesForm(estadoInicial);
        
        // Forcem neteja de cache per evitar preus "fantasma"
        queryClient.setQueryData(['apartments'], []); 
        await queryClient.removeQueries(['apartments']);
        await refetch();
        
        MySwal.fire({ title: 'Restaurat!', icon: 'success', timer: 1500, showConfirmButton: false , backdrop: 'rgba(46, 204, 113, 0.1)'});
      } catch (error) { // Corregit a minúscula
        console.error("Error al revertir:", error);
        MySwal.fire('Error', 'No s\'ha pogut restablir la base de dades', 'error');
      }
    }
  };

  const handleFaker = async () => {
    MySwal.fire({ title: 'Generant...', allowOutsideClick: false, didOpen: () => MySwal.showLoading() });
    try {
      const promises = Array.from({ length: 5 }).map(() => api.create({
        ...estadoInicial,
        propertyType: faker.helpers.arrayElement(['Apartment', 'Villa', 'Studio']),
        price: faker.number.int({ min: 50000, max: 500000 }),
        review: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        area: faker.number.int({ min: 40, max: 200 })
      }));
      await Promise.all(promises);
      queryClient.invalidateQueries(['apartments']);
      MySwal.fire({ title: 'Fakers creats!', icon: 'success', timer: 1000, showConfirmButton: false });
    } catch (error) { // Corregit a minúscula
      console.error("Error al Faker:", error);
      MySwal.fire('Error', 'No s\'han pogut crear les dades aleatòries', 'error');
    }
  };

  const seleccionarPis = (pis) => {
    setDadesForm(pis);
    setEditingId(pis.id);
  };

  const canviInput = (e) => {
    const { name, value, type } = e.target;
    setDadesForm({ 
      ...dadesForm, 
      [name]: type === 'number' ? (value === "" ? 0 : Number(value)) : value 
    });
  };

  if (isLoading) return <div className="loading">Carregant dades...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="brand-header"><span>🏠</span><span className="text-gradient">PintApart</span><span>🏠</span></h1>
      
      <div className="card2">
        <div className="form-grid-inputs">
          <div className="form-group">
            <label>ID (auto) </label>
            <input name="id" type="text" value={editingId || ""} disabled className="readonly-input" />
          </div>
          <div className="form-group">
            <label>Tipus</label>
            <input name="propertyType" value={dadesForm.propertyType || ""} onChange={canviInput} />
          </div>
          <div className="form-group">
            <label>Preu (€)</label>
            <input name="price" type="number" value={dadesForm.price || ""} onChange={canviInput}/>
          </div>
          <div className="form-group">
            <label>Ressenya</label>
            <input name="review" value={dadesForm.review || ""} onChange={canviInput} />
          </div>
        </div>

        <div className="button-row">
         <button className="btn btn-create" onClick={() => mutationCrear.mutate(dadesForm)}><Plus size={18} /> Crear</button>
          <button className="btn btn-update" onClick={() => editingId ? mutationUpdate.mutate(dadesForm) : MySwal.fire('Info', 'Tria un pis', 'info')}><Pencil size={18} /> Update</button>
          <button className="btn btn-reload" onClick={handleRevertir}><RotateCcw size={18} /> Revertir</button>
          <button className="btn btn-delete" onClick={() => editingId && mutationDelete.mutate(editingId)}><Trash2 size={18} /> Delete</button>
          <button className="btn btn-faker" onClick={handleFaker} style={{background: '#6366f1', color: 'white'}}><Rocket size={18} /> Faker</button>
        </div>
      </div>

      <div className="table-card" >
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipus</th>
              <th>Preu</th>
              <th>Descripció / Ressenya</th>
            </tr>
          </thead>
          <tbody>
            {llistaPisos.map((pis) => (
              <tr 
                key={pis.id} 
                onClick={() => seleccionarPis(pis)} 
                className={`table-row ${editingId === pis.id ? 'selected' : ''}`}
              >
                <td><span className="id-badge">{pis.id}</span></td>
                <td>{pis.propertyType}</td>
                <td><strong>{pis.price?.toLocaleString()} €</strong></td>
                <td>
                  <h1 className='review'>{pis.review || "Sense ressenya"}</h1>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}