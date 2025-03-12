import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { AuthProvider } from "react-oidc-context";
import { GameProvider } from "./context/context.tsx";
import { fetchAuthConfig } from "./services/apiService.tsx"; 
import "./index.css";
fetchAuthConfig().then((config) => {
  if (config) {
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <AuthProvider {...config}>
          <GameProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </GameProvider>
        </AuthProvider>
    );
  } else {
    console.error("Failed to initialize AuthProvider.");
  }
});
