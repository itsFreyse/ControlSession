import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoutes from "./routes/PrivateRoutes";
import "./styles/main.css"; // Importing Tailwind CSS styles

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rutas protegidas */}
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
