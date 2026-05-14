import React from 'react';
import { ApartmentProvider } from "../context/ApartmentContext";
import { SchoolProvider } from "../context/SchoolContext"; 

export function AppProviders({ children }) {
  return (
    <ApartmentProvider>
      <SchoolProvider>
         {children}
      </SchoolProvider>
    </ApartmentProvider>
  );
}