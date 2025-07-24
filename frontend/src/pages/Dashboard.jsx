import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

function Dashboard() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center relative">
        <h1 className="text-xl font-semibold">Bienvenido</h1>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2 hover:bg-blue-600 px-3 py-1 rounded"
          >
            <UserCircleIcon className="w-6 h-6 text-white" />
            <span className="text-white font-medium">{user?.username}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 text-black z-50">
              <p className="mb-1">
                <strong>Usuario:</strong> {user?.username}
              </p>
              <p className="mb-3">
                <strong>Email:</strong> {user?.email}
              </p>
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="p-6">
        <Outlet />
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Página principal del sitio.</h2>
          <p className="text-gray-700 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
            suscipit quidem autem quos pariatur assumenda molestias ea ipsam,
            dignissimos accusamus.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
