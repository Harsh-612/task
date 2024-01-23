// SearchBar.tsx

import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { users as userReference } from "@/firebase/firebase"; // Replace with your actual reference
import Link from "next/link";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    { username: string; uid: string }[]
  >([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const q = query(userReference, where("username", "==", searchQuery));

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(
        (doc) => doc.data() as { username: string }
      );
      console.log(results);

      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <aside className="bg-blue-50 min-h-screen border-r border-blue-300 w-[25vw] p-4">
      <input
        type="text"
        placeholder="Search by username"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
      >
        Search
      </button>
      <div className="mt-4">
        <strong>Search Results:</strong>
        <ul>
          {searchResults.map((result, index) => (
            <Link key={index} href={"tasks/" + result.uid}>
              <li>{result.username}</li>
            </Link>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SearchBar;
