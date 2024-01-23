import React from "react";

const NavBar = () => {
  return (
    <nav className="w-full h-20 flex items-center px-12 justify-between border-b absolute">
      <div className="text-3xl font-medium">TaskFlow</div>
      <div className="flex gap-10 text-xl">
        <button>Home</button>
        <button>About</button>
        <button>Services</button>
        <button className="bg-blue-500 text-white px-4 py-1 font-medium">
          Login
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
