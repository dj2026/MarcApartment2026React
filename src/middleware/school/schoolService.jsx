import React from "react";
import SchoolApiService from "./schoolApiService";
import { SchoolServiceContext } from "./schoolServiceHooks";

export const SchoolServiceProvider = ({ children }) => (
  <SchoolServiceContext.Provider value={SchoolApiService}>
    {children}
  </SchoolServiceContext.Provider>
);

