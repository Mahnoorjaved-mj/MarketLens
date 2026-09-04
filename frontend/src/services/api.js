const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  
export async function getDashboard() {
  const response = await fetch(`${API_URL}/api/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to load dashboard data");
  }

  return response.json();
}

export async function getSales() {
  const response = await fetch(`${API_URL}/api/sales`);

  if (!response.ok) {
    throw new Error("Failed to load sales data");
  }

  return response.json();
}

export async function getCustomers() {
  const response = await fetch(`${API_URL}/api/customers`);

  if (!response.ok) {
    throw new Error("Failed to load customers");
  }

  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/api/products`);

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json();
}

export async function getForecast() {
  const response = await fetch(`${API_URL}/api/forecast`);

  if (!response.ok) {
    throw new Error("Failed to load forecast");
  }

  return response.json();
}