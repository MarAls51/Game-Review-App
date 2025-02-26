import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import necessary components for routing
import { useAuth } from "react-oidc-context";
import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { Explore } from "./components/Explore";
import { Tldr } from "./components/Tldr";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { PersonalizedReview } from "./components/PersonalizedReview";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Team } from "./components/Team";
import { DeepDive } from "./components/DeepDive";
import { LoadingScreen } from "./components/LoadingScreen";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_REDIRECT_URL;
    const cognitoDomain = import.meta.env.VITE_AUTHORITY;

    if (!clientId || !logoutUri || !cognitoDomain) {
      console.error("Cognito environment variables are missing!");
      return;
    }

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (auth.isLoading || showLoading) {
    return <LoadingScreen />;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  return (
    <Router>
      <Navbar />
      {/* {auth.isAuthenticated ? (
        <>
          <button onClick={() => auth.removeUser()} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
            Sign out
          </button>
          <div className="p-4 bg-gray-100 rounded shadow-md">
            <p>Welcome, {auth.user?.profile.email}!</p>
          </div>
        </>
      ) : (
        <button onClick={() => auth.signinRedirect()} className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Sign in
        </button>
      )} */}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/tldr" element={<Tldr />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cta" element={<Cta />} />
        <Route path="/deepdive" element={<DeepDive />} />
        <Route path="/team" element={<Team />} />
        <Route path="/personalizedreview" element={<PersonalizedReview />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>

      <Footer />
      <ScrollToTop />
    </Router>
  );
}

export default App;
