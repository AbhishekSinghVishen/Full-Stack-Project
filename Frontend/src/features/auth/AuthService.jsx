// authService.js
const BASE_URL = "http://127.0.0.1:8000/api"; // Replace with your backend's base URL

export const loginUserService = async (credentials) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error("Invalid credentials");
  }
  return await response.json();
};

export const registerUserService = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return await response.json();
};

export const fetchProfileService = async (token) => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return await response.json();
};
