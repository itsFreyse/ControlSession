import api from "./axiosInstance";

// Iniciar sesión
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data;
};

// Cerrar sesión
export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("accessToken");
};

// Registrar un nuevo usuario
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data;
};
// Obtener el usuario autenticado
export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};  

