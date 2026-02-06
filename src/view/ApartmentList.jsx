import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/List.css"

const ApartmentList = () => {
  // --- ESTATS ---
  // Guardem l'array d'objectes que vindrà de la base de dades
  const [llistaPisos, setLlistaPisos] = useState([]);
  // Boolean per saber si la petició encara està en curs
  const [carregant, setCarregant] = useState(true);

  // --- EFECTE  ---
  useEffect(() => {
    const agafarDades = async () => {
      try {
        const response = await axios.get("/api/apartment/getAll"); // Fem la crida asíncrona a l'endpoint de l'API
        setLlistaPisos(response.data); // Actualitzem l'estat amb les dades rebudes (response.data)
        setCarregant(false); // Desactivem l'estat de càrrega
      } catch (error) {
        console.error("Error fetching apartments:", error);  // Si hi ha un error, el mostrem per consola i parem el "carregant"
        setCarregant(false);
      }
    };
    agafarDades();
  }, []); // El array buit [] indica que només s'executa quan el component apareix per primer cop

  // --- RENDERS CONDICIONALS ---
  if (carregant) return <p>Carregant dades...</p>; // Si 'carregant' és true, mostrem aquest missatge i no executem la resta
  if (!llistaPisos.length) return <p>No hi ha pisos disponibles.</p>; // Si no hi ha dades a l'array, informem l'usuari

  // --- RENDERITZAT FINAL ---
  return (
    <div className="apartment-cards-container">
      {/* Fem un .map() per transformar cada objecte 'pis' en un bloc de codi HTML/JSX */}
      {llistaPisos.map((pis) => ( 
        <div key={pis.id} className="apartment-card"> {/* La 'key' és obligatòria en React per identificar cada element de la llista*/}

          {/* Mostrem les propietats de l'objecte. Fem servir toLocaleString per formatar el preu (ex: 100.000) */}
          <strong>ID: {pis.id}</strong><br></br>
          <strong>Tipus: {pis.propertyType}</strong><br></br>
          <strong>Preu: {pis.price?.toLocaleString('es-ES')} €</strong><br></br>
          <strong>Habitacions: {pis.bedrooms}</strong><br></br>
          <strong>Àrea: {pis.area} m²</strong><br></br>
          <strong>Banys: {pis.bathrooms}</strong><br></br>
          <strong>Plantes: {pis.stories}</strong><br></br>
          <strong>Main Road: {pis.mainroad}</strong><br></br>
          <strong>Guestroom: {pis.guestroom}</strong><br></br>
          <strong>Basement: {pis.basement}</strong><br></br>
          
          {/* La resta de camps que descriuen l'apartament */}
          <strong>Hot Water Heating: {pis.hotwaterheating}</strong><br></br>
          <strong>Air Conditioning: {pis.airconditioning}</strong><br></br>
          <strong>Parking: {pis.parking}</strong><br></br>
          <strong>Preferred Area: {pis.prefarea}</strong><br></br>
          <strong>Furnishing Status: {pis.furnishingstatus}</strong><br></br>
        </div>
      ))}
    </div>
  );
};

export default ApartmentList;