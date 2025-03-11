import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { About } from "./pages/About";
import { Explore } from "./pages/Explore";
import { Tldr } from "./pages/Tldr";
import { Hero } from "./pages/Hero";
import { Navbar } from "./components/Navbar";
import { PersonalizedReview } from "./pages/PersonalizedReview";
import { DeepDive } from "./pages/DeepDive";
import { LoadingScreen } from "./components/LoadingScreen";
import { Account } from "./pages/Account";

import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const auth = useAuth();

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (auth.isLoading || showLoading) {
    return <LoadingScreen text="Loading, please wait..." />;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/tldr" element={<Tldr />} />
        <Route path="/deepdive" element={<DeepDive />} />
        <Route path="/personalizedreview" element={<PersonalizedReview />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/account" element={<Account />} />
      </Routes>

    </Router>
  );
}

export default App;
