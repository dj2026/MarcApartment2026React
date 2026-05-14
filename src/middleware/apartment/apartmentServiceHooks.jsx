import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApartmentApiService from "./apartmentApiService";

export const ApartmentServiceContext = createContext(ApartmentApiService);
export const useApartmentService = () => useContext(ApartmentServiceContext);

export const useApartments = () => {
  return useQuery({
    queryKey: ["apartments"],
    queryFn: () => ApartmentApiService.getAllApartments(),
  });
};

export const useCreateApartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newApt) => ApartmentApiService.createApartment(newApt),
    onSuccess: () => {
      // Això diu a totes les vistes: "Ei, les dades han canviat, refresqueu-vos!"
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
    },
  });
};

export const useDeleteApartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => ApartmentApiService.deleteApartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
    },
  });
};

export const useUpdateApartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (apt) => ApartmentApiService.updateApartment(apt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
    },
  });
};