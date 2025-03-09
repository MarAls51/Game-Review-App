import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { updateUser } from "../services/apiService";
import { ConnectedAccounts } from "@/types/types";
import { sanitizeInput } from "./Sanitizer";

export const AccountForm = ({
  user,
  username,
  handleUsernameChange,
  testimonial,
  handleTestimonialChange,
  connectedAccounts,
  handleToggle,
  toggleDropdown,
  isDropdownOpen,
}: any) => {
  const handleKeyPress = async (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target instanceof HTMLInputElement) {
        await updateUser(user?.profile.sub, {alias:sanitizeInput(username)});
      } else if (e.target instanceof HTMLTextAreaElement) {
        await updateUser(user?.profile.sub, {testimonial:sanitizeInput(testimonial)});
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
              from the database to ensure your safety and privacy. All data
              extracted from your connected accounts consists of publicly
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
