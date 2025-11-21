import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/home", active: authStatus },
    { name: "My Posts", slug: "/myposts", active: authStatus },
    { name: "Add Post", slug: "/addpost", active: authStatus },
    
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md shadow-lg py-4">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="mr-6">
            <Link to="/home">
              <h4 className="text-2xl font-bold text-gray-100 tracking-tight">
                Quiet Desk
              </h4>
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="inline-block px-4 py-2 text-base font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-full transition-colors duration-200"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
