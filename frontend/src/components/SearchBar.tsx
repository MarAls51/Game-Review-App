import { useState } from "react";
import axios from "axios";

interface SearchBarProps {
  onSearch: (games: any[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(import.meta.env.VITE_BACKEND_URL)
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search`, {
        params: { query: searchQuery },
      });

      const games = response.data;
      console.log(games)

      onSearch(games);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full flex mt-8">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Dead by daylight..."
        className="w-full px-6 py-3 bg-white text-black rounded-full placeholder-dark-grey text-lg placeholder-normal focus:ring-2 focus:ring-green-500"
      />
    </form>
  );
};
