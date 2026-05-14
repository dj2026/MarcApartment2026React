import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSchoolService } from "../middleware/SchoolApiService"; // IMPORT CORRECTE
import { useSchoolContext } from "../context/SchoolContext";

export function useSchoolMutations() {
  const queryClient = useQueryClient();
  const api = useSchoolService(); // SERVEI D'ESCOLES
  const { dispatch } = useSchoolContext();
  const MySwal = api.alert;

  const refrescarIReset = (msg) => {
  queryClient.invalidateQueries({ queryKey: ["escoles"] });
  queryClient.invalidateQueries({ queryKey: ["apartaments"] }); 
  
  dispatch({ type: "RESET" });

  if (msg) {
    MySwal.fire({
      title: msg,
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });
  }
};

  const mutacioCrearEscola = useMutation({
    mutationFn: (dades) => api.crearEscola(dades), 
    onSuccess: () => refrescarIReset("Escola creada correctament!"),
    onError: (err) => {
      const detail = err.response?.data?.message || "Error al crear l'escola";
      MySwal.fire("Error", detail, "error");
    }
  });

  const mutacioUpdateEscola = useMutation({
    mutationFn: (dades) => api.actualitzarEscola(dades.id, dades),
    onSuccess: () => refrescarIReset("Escola actualitzada!"),
    onError: () => MySwal.fire("Error", "No s'ha pogut actualitzar l'escola", "error")
  });

  const mutacioDeleteEscola = useMutation({
    mutationFn: (id) => api.esborrarEscola(id),
    onSuccess: () => refrescarIReset("Escola eliminada"),
    onError: () => MySwal.fire("Error", "No s'ha pogut eliminar l'escola", "error")
  });

  return {
    crearEscola: mutacioCrearEscola.mutate,
    actualitzarEscola: mutacioUpdateEscola.mutate,
    esborrarEscola: mutacioDeleteEscola.mutate,
    isPending: 
      mutacioCrearEscola.isPending || 
      mutacioUpdateEscola.isPending || 
      mutacioDeleteEscola.isPending
  };
}