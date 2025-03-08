import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LoadingScreen } from "./LoadingScreen";
import { sanitizeInput } from "./Sanitizer";
import { toast } from 'react-toastify';
import axios from "axios";

type ConnectedAccounts = {
  steam: string;
  microsoft: string;
  playstation: string;
};

const AccountForm = ({
  user,
  username,
  handleUsernameChange,
  testimonial,
  handleTestimonialChange,
  connectedAccounts,
  handleToggle,
  toggleDropdown,
  isDropdownOpen
}: any) => {
  const updateAlias = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        sub: user?.profile.sub,
        alias: username,
      });
    } catch (error) {
      console.error("Failed to update alias:", error);
    }
  };

  const updateTestimonial = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        sub: user?.profile.sub,
        testimonial: sanitizeInput(testimonial),
      });
    } catch (error) {
      console.error("Failed to update testimonial:", error);
    }
  };
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target instanceof HTMLInputElement) {
        updateAlias();
      } else if (e.target instanceof HTMLTextAreaElement) {
        updateTestimonial();
      }
    }
  };
  return (
    <form className="space-y-8">
      <div className="flex flex-col items-center">
        <label htmlFor="username" className="text-lg font-semibold text-black">
          Username
        </label>
        <p className="text-sm text-gray-500 mt-2">
          General alias for testimonials and future features.
        </p>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          onKeyDown={handleKeyPress}
          className="mt-2 p-3 w-full md:w-[50%] border border-gray-300 rounded-2xl text-black focus:ring-2 focus:ring-black focus:outline-none"
          placeholder="Godwizard"
          maxLength={30}
          required
        />
      </div>

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
            <span
              className={`w-10 h-5 rounded-full relative transition-colors 
                ${
                  connectedAccounts[account as keyof ConnectedAccounts]
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
            >
              <span
                className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform
                  ${
                    connectedAccounts[account as keyof ConnectedAccounts]
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
              ></span>
            </span>
          </label>
        </div>
      ))}

      <div className="flex flex-col">
        <label
          htmlFor="testimonial"
          className="text-lg font-semibold text-black"
        >
          Testimonial
        </label>
        <p className="text-sm text-gray-500 mt-2">
          This testimonial will be displayed on the landing page for everyone to
          see. It's sanitized but please ensure it's appropriate.
        </p>
        <textarea
          id="testimonial"
          value={testimonial}
          onChange={handleTestimonialChange}
          onKeyDown={handleKeyPress}
          className="p-3 w-full border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-black focus:outline-none"
          placeholder="Write your testimonial here"
          maxLength={500}
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
              Your connected platform accounts are only used to personalize your
              reviews and explore features, and you can remove them at any time.
              Your email and login credentials are securely stored separately
              from the database to ensure your safety and privacy. All
              data extracted from your connected accounts consists of publicly
              available information, such as your game library and playtime
              history. We do not collect or store any personal information that
              could be used to identify you.
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

const AccountHeader = ({ handleLogout }: any) => {
  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-6 bg-black text-white px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
};

export const Account = () => {
  const auth = useAuth();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccounts>(
    {
      steam: "",
      microsoft: "",
      playstation: "",
    },
  );
  const [testimonial, setTestimonial] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isXboxPopupOpen, setIsXboxPopupOpen] = useState(false);
  const [isDeleteAccountPopupOpen, setisDeleteAccountPopupOpen] = useState(false);
  const [xboxGamerTag, setXboxGamerTag] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (user && !isFetching) {
      const fetchUserData = async () => {
        try {
          setIsFetching(true);
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/user?sub=${user.profile.sub}`,
          );
          if (response.status === 200 && response.data) {
            setUsername(response.data.alias || "Anonymous");
            setTestimonial(response.data.testimonial || "");
            setConnectedAccounts({
              steam: response.data.steam?.steamid || "",
              microsoft: response.data.xbox?.xboxGamertag || "",
              playstation: response.data.playstation || "",
            });
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
              console.log("User not found, creating new user...");
              try {
                await axios.post(
                  `${import.meta.env.VITE_BACKEND_URL}/api/user`,
                  {
                    sub: user.profile.sub,
                    alias: "Anonymous",
                  },
                );
                setUsername("Anonymous");
              } catch (postError: unknown) {
                console.error(
                  "Failed to create user:",
                  (postError as Error).message,
                );
              }
            } else {
              console.error("Failed to fetch user data:", error.message);
            }
          } else {
            console.error("Unexpected error:", (error as Error).message);
          }
        } finally {
          setIsFetching(false);
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleTestimonialChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTestimonial(e.target.value);
  };
  const handleToggle = async (account: keyof ConnectedAccounts) => {
    if (account === "steam") {
      if (connectedAccounts.steam) {
        setConnectedAccounts((prev) => ({
          ...prev,
          steam: "",
        }));
  
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
          sub: user?.profile.sub,
          steam: null,
        });
      } else {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/login?sub=${user?.profile.sub}`;
      }
    } else if (account === "microsoft" && !connectedAccounts.microsoft) {
      setIsXboxPopupOpen(true);
    } else if (account === "microsoft" && connectedAccounts.microsoft) {
      setConnectedAccounts((prev) => ({
        ...prev,
        microsoft: "",
      }));
  
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        sub: user?.profile.sub,
        xbox: null,
      });
    } else {
      setConnectedAccounts((prev) => ({
        ...prev,
        [account]: !prev[account],
      }));
    }
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    auth.removeUser();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = import.meta.env.VITE_LOGOUT_URL_FULL;
  };

  const handleDeleteAccount = async () => {
    try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
          data: { sub: user?.profile.sub },
        });
        auth.removeUser();
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = import.meta.env.VITE_LOGOUT_URL_FULL;
    } catch (error) {
      toast.error("An error occurred while deleting your account. Please try again.");
    }
  };

  const handleXboxSubmit = async () => {
    if (!xboxGamerTag.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setXboxGamerTag(sanitizeInput(xboxGamerTag));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/validate-xbox-gamertag`,
        { params: { sub: user?.profile.sub , gamerTag: xboxGamerTag } },
      );

      if (response.status === 200 && response.data.isValid) {
        setConnectedAccounts((prev) => ({
          ...prev,
          microsoft: xboxGamerTag,
        }));
        setIsXboxPopupOpen(false);
      } else {
        toast.error("Invalid Xbox Gamer Tag"); 
      }
    } catch (error) {
      console.error("Error validating Xbox Gamer Tag:", error);
      setErrorMessage("There was an error. Please try again."); 
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section
      id="account"
      className="container py-24 sm:py-32 flex justify-center bg-white"
    >
      <div className="border rounded-lg py-12 w-[80%] max-w-4xl bg-white relative">
        <AccountHeader handleLogout={handleLogout} />
        <div className="px-6 flex flex-col gap-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black">
            Your Account
          </h2>
          <AccountForm
            user={user}
            username={username}
            handleUsernameChange={handleUsernameChange}
            testimonial={testimonial}
            handleTestimonialChange={handleTestimonialChange}
            connectedAccounts={connectedAccounts}
            handleToggle={handleToggle}
            toggleDropdown={toggleDropdown}
            isDropdownOpen={isDropdownOpen}
            handleMicrosoftAccountSelect={handleToggle}
          />
        </div>
        <div className="w-full flex justify-center pt-4">
          <button
            onClick={() => setisDeleteAccountPopupOpen(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg"
          >
          Delete Account
          </button>
        </div>
      </div>
  
      {isXboxPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          {isSubmitting ? (
            <div className="bg-black rounded-lg w-80 h-64 flex justify-center items-center">
              <LoadingScreen text="Please wait while we fetch the data..." />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg w-80 text-center">
              <h3 className="text-xl font-semibold text-black">
                Enter Your Xbox Gamer Tag
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Stats are collected from your public profile.
              </p>
              <input
                type="text"
                value={xboxGamerTag}
                onChange={(e) => setXboxGamerTag(e.target.value)}
                className="mt-4 p-2 border border-gray-300 rounded-lg w-full text-black"
                placeholder="Xbox Gamer Tag"
              />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setIsXboxPopupOpen(false)}
                  className="bg-black text-white p-2 rounded-lg w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleXboxSubmit}
                  className="bg-blue-500 text-white p-2 rounded-lg w-full"
                >
                  Submit
                </button>
              </div>
              {errorMessage && (
                <p className="text-red-500 mt-4">{errorMessage}</p> 
              )}
            </div>
          )}
        </div>
      )}
      {isDeleteAccountPopupOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
             <div className="bg-white p-6 rounded-lg w-80 text-center">
                  <h3 className="text-xl font-semibold text-black">
                      Are you sure you want to delete your account? Your login details will still be stored for a 30-day period before permanent deleted.
                  </h3>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setisDeleteAccountPopupOpen(false)}
                      className="bg-black text-white p-2 rounded-lg w-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-500 text-white p-2 rounded-lg w-full"
                    >
                      Confirm
                    </button>
                  </div>
                  {errorMessage && (
                    <p className="text-red-500 mt-4">{errorMessage}</p> 
                  )}
                </div>
            </div> 
      )}
    </section>
  );
};
