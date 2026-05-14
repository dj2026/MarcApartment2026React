import { createContext, useContext, useState, useCallback } from 'react';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const AuthContext = createContext(null);

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });
const CLIENT_ID = "79d6uc4t3cqpvvvnhs5bklj8i3";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Canviem 'email' per 'username' per ser coherents amb Cognito
  const login = useCallback(async (username, password) => {
    if (!username || !password) {
      setError("Cal introduir l'usuari i la contrasenya");
      return;
    }

    setLoading(true);
    setError(null);

    const input = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username, // Si poses l'email aquí i el Pool no l'admet, fallarà
        PASSWORD: password,
      },
    };

    try {
      const command = new InitiateAuthCommand(input);
      const response = await client.send(command);

      if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        setLoading(false);
        return { nextStep: "NEW_PASSWORD_REQUIRED", session: response.Session };
      }

      setUser(response.AuthenticationResult);
      setIsAuthenticated(true);
      setLoading(false);
      return response.AuthenticationResult;

    } catch (err) {
      setLoading(false);
      // Millorem el missatge d'error per a l'usuari
      let message = "Error en l'inici de sessió";
      if (err.name === "NotAuthorizedException") {
        message = "Usuari o contrasenya incorrectes";
      } else if (err.name === "UserNotFoundException") {
        message = "Aquest usuari no existeix";
      }
      
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = { user, isAuthenticated, login, logout, loading, error };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth s'ha d'utilitzar dins d'un AuthProvider");
  return context;
};