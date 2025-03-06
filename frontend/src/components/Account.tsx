import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LoadingScreen } from "./LoadingScreen";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

type ConnectedAccounts = {
  steam: string;
  microsoft: string;
  playstation: string;
  epicGames: string;
};

export const Account = () => {
  const auth = useAuth();

  const navigate= useNavigate();

  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccounts>({
    steam: '',
    microsoft: '',
    playstation: '',
    epicGames: '',
  });
  const [testimonial, setTestimonial] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user-data?sub=${user.profile.sub}`);
          
          if (response.data) {
            setUsername(response.data.alias || "Guest");
            setTestimonial(response.data.testimonial || "");
            setConnectedAccounts({
              steam: response.data.steam || '',
              microsoft: response.data.microsoft || '',
              playstation: response.data.playstation || '',
              epicGames: response.data.epicgames || '',
            });
          } else {
            await axios.post(`/api/user-data`, {
              sub: user.profile.sub,
              alias: "Guest", 
            });
            setUsername("Guest");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleTestimonialChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTestimonial(e.target.value);
  };

  const handleToggle = (account: keyof ConnectedAccounts) => {
    setConnectedAccounts((prev) => ({
      ...prev,
      [account]: !prev[account],
    }));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };


  const handleLogout = () => {
    auth.removeUser()
    sessionStorage.clear();
    localStorage.clear();   
    window.location.href = import.meta.env.VITE_LOGOUT_URL_FULL;
   };
  
  const handleDeleteAccount = () => {
    console.log("Account deleted");
  };

  const updateAlias = async () => {
    try {
      await axios.put(`/api/user-data?sub=${user?.profile.sub}`, {
        alias: username,
      });
    } catch (error) {
      console.error("Failed to update alias:", error);
    }
  };

  const updateTestimonial = async () => {
    try {
      await axios.put(`/api/user-data?sub=${user?.profile.sub}`, {
        testimonial,
      });
    } catch (error) {
      console.error("Failed to update testimonial:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.target instanceof HTMLInputElement) {
        updateAlias();
      } else if (e.target instanceof HTMLTextAreaElement) {
        updateTestimonial();
      }
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingScreen text="You are not authenticated. Please log in to access your account." />
      </div>
    );
  }

  return (
    <section id="account" className="container py-24 sm:py-32 flex justify-center bg-white">
      <div className="border rounded-lg py-12 w-[80%] max-w-4xl bg-white relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-6 bg-black text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

        <div className="px-6 flex flex-col gap-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black">
            Your Account
          </h2>

          <form className="space-y-8">
            <div className="flex flex-col gap-4 items-center">
              <label htmlFor="username" className="text-lg font-semibold text-black">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                onKeyDown={handleKeyPress}
                className="mt-2 p-3 w-full md:w-[50%] border border-gray-300 rounded-2xl text-black focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Any alias will work"
                required
              />
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-black text-center">Connect Your Platforms</h3>
              {Object.keys(connectedAccounts).map((account) => (
                <div key={account} className="flex items-center justify-between mb-4">
                  <span className="text-black capitalize">{account}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!connectedAccounts[account as keyof ConnectedAccounts]}
                      onChange={() => handleToggle(account as keyof ConnectedAccounts)}
                      className="sr-only"
                    />
                    <span className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-black relative">
                      <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="testimonial" className="text-lg font-semibold text-black">
                Testimonial
              </label>
              <textarea
                id="testimonial"
                value={testimonial}
                onChange={handleTestimonialChange}
                onKeyDown={handleKeyPress}
                className="p-3 w-full border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Write your testimonial here"
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex justify-between items-center text-lg font-semibold text-black bg-gray-200 p-3 rounded-lg w-full text-left"
              >
                How do you use my data?
                {isDropdownOpen ? (
                  <FaChevronUp className="text-xl" />
                ) : (
                  <FaChevronDown className="text-xl" />
                )}
              </button>
              {isDropdownOpen && (
                <div className="bg-gray-100 p-4 rounded-lg mt-2 text-black relative">
                  <p>
                    Your connected platform accounts are only used to personalize your reviews and explore features, and you can remove them at any time. Your email and login credentials are securely stored separately from the database in AWS to ensure your safety and privacy. All data extracted from your connected accounts consists of publicly available information, such as your game library and playtime history. We do not collect or store any personal information that could be used to identify you.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="w-full flex justify-center pt-4">
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Delete Account
          </button>
        </div>
      </div>
    </section>
  );
};
