import React from "react";
import ApartmentApiService from "./apartmentApiService";
import { ApartmentServiceContext } from "./apartmentServiceHooks";

export const ApartmentServiceProvider = ({ children }) => (
  <ApartmentServiceContext.Provider value={ApartmentApiService}>
    {children}
  </ApartmentServiceContext.Provider>
);

