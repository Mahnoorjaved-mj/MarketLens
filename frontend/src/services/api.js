const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getHeaders() {
  const token = localStorage.getItem("marketlens_token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function getDashboard() {
  const response = await fetch(`${API_URL}/api/dashboard`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load dashboard data");
  }

  return response.json();
}

export async function getSales() {
  const response = await fetch(`${API_URL}/api/sales`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load sales data");
  }

  return response.json();
}

export async function getCustomers() {
  const response = await fetch(`${API_URL}/api/customers`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load customers");
  }

  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/api/products`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json();
}

export async function getForecast() {
  const response = await fetch(`${API_URL}/api/forecast`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load forecast");
  }

  return response.json();
}