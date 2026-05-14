import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApartmentService } from "../middleware/apartment/apartmentServiceHooks";
import { useApartmentData } from "../data/ApartmentDataContext";

export function useApartmentMutations() {
  const queryClient = useQueryClient();
  const api = useApartmentService();
  const { refetch } = useApartmentData();
  const MySwal = api.alert;

  /**
   * Refresca la cache de React Query i reseta el context
   * @param {string} msg 
   * @param {Array} keys 
   */
  const refrescarIReset = async (msg, keys = ["apartaments"]) => {
    keys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
    await refetch();
    if (msg) {
      MySwal.fire({
        title: msg,
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const prepararDadesPerEnviar = (dades) => {
    const preuValid = (dades.price !== "" && dades.price !== undefined && dades.price !== null);
    
    return {
      ...dades,
      price: preuValid ? Number(dades.price) : 0,
      area: Number(dades.area) > 0 ? Number(dades.area) : 75,
      bedrooms: Number(dades.bedrooms) >= 0 ? Number(dades.bedrooms) : 1,
      bathrooms: Number(dades.bathrooms) >= 0 ? Number(dades.bathrooms) : 1,
      stories: Number(dades.stories) > 0 ? Number(dades.stories) : 1,
      parking: Number(dades.parking) || 0,
      propertyType: dades.propertyType ? dades.propertyType.toUpperCase() : "APARTMENT",
      staticReview: dades.staticReview || "Sense ressenya",
      mainroad: dades.mainroad || "no",
      guestroom: dades.guestroom || "no",
      basement: dades.basement || "no",
      hotwaterheating: dades.hotwaterheating || "no",
      airconditioning: dades.airconditioning || "no",
      terrace: dades.terrace || "no",
      prefarea: dades.prefarea || "no",
      furnishingstatus: dades.furnishingstatus || "unfurnished",
      description: dades.description || "Sense descripció"
    };
  };

  const mutacioCrear = useMutation({
    mutationFn: (d) => api.crear(prepararDadesPerEnviar(d)),
    onSuccess: () => refrescarIReset("Creat correctament!"),
    onError: (err) => {
      const detail = err.response?.data?.message || "Error de connexió o validació";
      MySwal.fire("Error", detail, "error");
    }
  });

  const mutacioUpdate = useMutation({
    mutationFn: (d) => api.actualitzar(prepararDadesPerEnviar(d)),
    onSuccess: () => refrescarIReset("Actualitzat!"),
    onError: () => MySwal.fire("Error", "No s'ha pogut actualitzar", "error")
  });

  const mutacioDelete = useMutation({
    mutationFn: (id) => api.esborrar(id),
    onSuccess: () => refrescarIReset("Eliminat")
  });

  const mutacioResetDB = useMutation({
    mutationFn: () => api.reiniciar(),
    onSuccess: () => refrescarIReset("Reset completat")
  });

  return {
    crear: mutacioCrear.mutate,
    actualitzar: mutacioUpdate.mutate,
    esborrar: mutacioDelete.mutate,
    resetDB: mutacioResetDB.mutate,
    isPending: 
      mutacioCrear.isPending || 
      mutacioUpdate.isPending || 
      mutacioDelete.isPending || 
      mutacioResetDB.isPending
  };
}