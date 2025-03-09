import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { AuthProvider } from "react-oidc-context";
import { GameProvider } from "./context/context.tsx";
import "./index.css";

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: import.meta.env.VITE_CLIENT_ID,
  client_secret: import.meta.env.VITE_CLIENT_SECRET,
  redirect_uri: import.meta.env.VITE_REDIRECT_URL,
  response_type: import.meta.env.VITE_RESPONSE_TYPE,
  post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_URL,
  scope: import.meta.env.VITE_SCOPE,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <GameProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GameProvider>
    </AuthProvider>
  </React.StrictMode>,
);
