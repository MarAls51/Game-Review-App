import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { About } from "./components/About";
import { Explore } from "./components/Explore";
import { Tldr } from "./components/Tldr";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { PersonalizedReview } from "./components/PersonalizedReview";
import { ScrollToTop } from "./components/ScrollToTop";
import { DeepDive } from "./components/DeepDive";
import { LoadingScreen } from "./components/LoadingScreen";
import { Account } from "./components/Account";

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
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/tldr" element={<Tldr />} />
        <Route path="/deepdive" element={<DeepDive />} />
        <Route path="/personalizedreview" element={<PersonalizedReview />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/account" element={<Account />} />
      </Routes>

      {/* <Footer /> */}
      <ScrollToTop />
    </Router>
  );
}

export default App;
