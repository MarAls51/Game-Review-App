import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { LoadingScreen } from "../components/LoadingScreen";
import { sanitizeInput } from "../components/Sanitizer";
import { toast } from "react-toastify";
import { ConnectedAccounts } from "@/types/types";
import { AccountForm } from "@/components/AccountForm";
import { authLogout, createUser, deleteUser, fetchUser, steamRedirect, updateUser, validateXboxGamertag } from "@/services/apiService";

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
  const [isDeleteAccountPopupOpen, setisDeleteAccountPopupOpen] =
    useState(false);
  const [xboxGamerTag, setXboxGamerTag] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (user && !isFetching) {
      const fetchUserData = async () => {
        setIsFetching(true);
        const data = await fetchUser(user?.profile.sub);
        if (data !== 0) {
          setUsername(data.alias || "Anonymous");
          setTestimonial(data.testimonial || "");
          setConnectedAccounts({
            steam: data.steam?.steamid || "",
            microsoft: data.xbox?.xboxGamertag || "",
            playstation: data.playstation || "",
          });
        } else {
          await createUser(user?.profile.sub);
          setUsername("Anonymous");
        }
        setIsFetching(false);
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

        await updateUser(user?.profile.sub, {steam:null})
      } else {
        window.location.href = steamRedirect(user?.profile.sub)
      }
    } else if (account === "microsoft" && !connectedAccounts.microsoft) {
      setIsXboxPopupOpen(true);
    } else if (account === "microsoft" && connectedAccounts.microsoft) {
      setConnectedAccounts((prev) => ({
        ...prev,
        microsoft: "",
      }));

      await updateUser(user?.profile.sub, {xbox: null})
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

  const handleLogout = async () => {
    auth.removeUser();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = await authLogout()
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user?.profile.sub)
      auth.removeUser();
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = await authLogout()
    } catch (error) {
      toast.error(
        "An error occurred while deleting your account. Please try again.",
      );
    }
  };

  const handleXboxSubmit = async () => {
    if (!xboxGamerTag.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setXboxGamerTag(sanitizeInput(xboxGamerTag));
    try {
      const response = await validateXboxGamertag(user?.profile.sub, xboxGamerTag )
      if (response === true) {
        setConnectedAccounts((prev) => ({
          ...prev,
          microsoft: xboxGamerTag,
        }));
        setIsXboxPopupOpen(false);
      } else {
        setErrorMessage("There was an error. Please try again.");
      }
    } catch (error) {
      console.error("Error validating Xbox Gamer Tag:", error);
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
              Are you sure you want to delete your account? Your login details
              will still be stored for a 30-day period before permanent deleted.
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
