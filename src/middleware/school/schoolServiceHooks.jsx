import { createContext, useContext } from "react";
import SchoolApiService from "./schoolApiService";

export const SchoolServiceContext = createContext(SchoolApiService);

export const useSchoolService = () => useContext(SchoolServiceContext);

