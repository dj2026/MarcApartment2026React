import React, { useState } from 'react';
import { Hammer, Calendar, ClipboardList, Plus, Building, Building2, Home } from 'lucide-react';
import { useApartmentData } from '../data/ApartmentDataContext';

const RenovationForm = () => {
    const { state, addRenovationToCurrent, dispatch } = useApartmentData();
    const { dadesForm } = state;

    // Estat local blindat amb els noms del model Java
    const [formData, setFormData] = useState({
        title: '',         
        duration: '',     
        estimatedCost: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (type) => {
        dispatch({ type: "SET_FIELD", field: "propertyType", value: type });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.estimatedCost) {
            return alert("Siusplau, indica el títol i el cost estimat.");
        }

        const newEntry = {
            title: formData.title,
            duration: formData.duration,
            estimatedCost: parseFloat(formData.estimatedCost),
            description: formData.description,
            category: dadesForm.propertyType 
        };

        addRenovationToCurrent(newEntry);
        
        setFormData({ title: '', duration: '', estimatedCost: '', description: '' });
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none'
    };

    const typeButtonStyle = (isActive) => ({
        flex: 1,
        padding: '10px 5px',
        borderRadius: '8px',
        border: isActive ? '2px solid #28a745' : '1px solid #ddd',
        backgroundColor: isActive ? '#f0fff4' : '#fff',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: 'bold',
        color: isActive ? '#28a745' : '#666',
        transition: 'all 0.2s ease',
        minWidth: '0'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '600px', margin: '0 auto' }}>
            
            <form onSubmit={handleSubmit} style={{ 
                backgroundColor: '#fff', 
                padding: '24px', 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #eee'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#28a745' }}>
                    <Hammer size={24} />
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Registre de Reforma</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#999', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                            TIPUS DE PROPIETAT (CATEGORY):
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div onClick={() => handleTypeChange("APARTMENT")} style={typeButtonStyle(dadesForm.propertyType === "APARTMENT")}>
                                <Building size={18} /> APARTMENT
                            </div>
                            <div onClick={() => handleTypeChange("DUPLEX")} style={typeButtonStyle(dadesForm.propertyType === "DUPLEX")}>
                                <Building2 size={18} /> DUPLEX
                            </div>
                            <div onClick={() => handleTypeChange("HOUSE")} style={typeButtonStyle(dadesForm.propertyType === "HOUSE")}>
                                <Home size={18} /> HOUSE
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: '#eee', margin: '10px 0' }} />

                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' }}>TÍTOL DE LA TASCA</label>
                        <input 
                            name="title"
                            placeholder="Ex: Pintura, Nova caldera..." 
                            value={formData.title}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' }}>DATA / DURADA</label>
                            <input type="text" name="duration" placeholder="Ex: 2024-05-10 o 2 setmanes" value={formData.duration} onChange={handleInputChange} style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' }}>COST ESTIMAT (€)</label>
                            <input type="number" name="estimatedCost" placeholder="0.00" value={formData.estimatedCost} onChange={handleInputChange} style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' }}>
                            <ClipboardList size={12} style={{ marginRight: '4px' }} />
                            DESCRIPCIÓ ADICIONAL
                        </label>
                        <textarea 
                            name="description"
                            placeholder="Detalls adicionals..." 
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="2"
                            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                        />
                    </div>

                    <button type="submit" style={{ 
                        backgroundColor: '#28a745', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px'
                    }}>
                        <Plus size={20} /> REGISTRAR EN {dadesForm.propertyType}
                    </button>
                </div>
            </form>

            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
                <div style={{ padding: '15px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontSize: '13px', color: '#555' }}>HISTORIAL RECENT</h4>
                    <span style={{ fontSize: '11px', color: '#28a745', fontWeight: 'bold' }}>
                        {(dadesForm.renovations || []).length} REGISTRES
                    </span>
                </div>
                
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {(!dadesForm.renovations || dadesForm.renovations.length === 0) ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: '#bbb', fontSize: '13px' }}>Sense reformes.</div>
                    ) : (
                        dadesForm.renovations.map((item) => (
                            <div key={item.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.title}</div>
                                    <div style={{ fontSize: '10px', color: '#999' }}>{item.category} • {item.duration}</div>
                                </div>
                                <div style={{ color: '#28a745', fontWeight: 'bold' }}>{item.estimatedCost?.toLocaleString()} €</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RenovationForm;