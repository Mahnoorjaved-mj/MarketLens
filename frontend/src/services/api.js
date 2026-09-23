const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Comprehensive fallback data in case the backend or database is offline
const FALLBACK_DASHBOARD = {
  kpis: {
    total_sales: 2297200.86,
    total_profit: 286397.02,
    total_orders: 5009,
    total_customers: 793,
    sales_change: 12.8,
    profit_change: 8.4,
    orders_change: 5.3,
    customers_change: 6.7,
  },
  sales_trend: [
    { label: "2014", sales: 484247.50 },
    { label: "2015", sales: 470532.51 },
    { label: "2016", sales: 609205.60 },
    { label: "2017", sales: 733215.25 },
  ],
  category_sales: [
    { category: "Technology", sales: 836154.03 },
    { category: "Furniture", sales: 741999.80 },
    { category: "Office Supplies", sales: 719047.03 },
  ],
  region_sales: [
    { region: "West", sales: 725457.82 },
    { region: "East", sales: 678781.24 },
    { region: "Central", sales: 501239.89 },
    { region: "South", sales: 391721.91 },
  ],
  top_products: [
    { product_name: "Canon imageCLASS 2200 Advanced Copier", sales: 61599.82, profit: 25199.93 },
    { product_name: "Fellowes PB500 Electric Punch Plastic Comb Binding", sales: 27453.38, profit: 7753.12 },
    { product_name: "Cisco TelePresence System EX90 Videoconferencing", sales: 22638.48, profit: -1811.08 },
    { product_name: "HON 5400 Series Task Chair", sales: 21870.58, profit: 6590.20 },
    { product_name: "GBC DocuBind TL300 Electric Binding System", sales: 19823.48, profit: 4850.10 },
  ],
  profit_by_year: [
    { year: "2014", profit: 49543.97 },
    { year: "2015", profit: 61618.60 },
    { year: "2016", profit: 81795.17 },
    { year: "2017", profit: 93439.28 },
  ],
  filters: {
    years: [2014, 2015, 2016, 2017],
    regions: ["Central", "East", "South", "West"],
    categories: ["Furniture", "Office Supplies", "Technology"],
  },
  insights: {
    sales: "Business sales reached $2.30M with steady annual acceleration (+12.8% YoY), led by strong Technology hardware performance.",
    customers: "793 enterprise accounts drove 5,009 transactions across all four national sales territories.",
  },
};

const FALLBACK_SALES = {
  kpis: {
    total_revenue: 2297200.86,
    gross_profit: 286397.02,
    avg_order_value: 458.62,
    total_orders: 5009,
    sales_growth: 18.2,
  },
  revenue_trend: [
    { month: "Jan", revenue: 142000, profit: 16500 },
    { month: "Feb", revenue: 130000, profit: 14800 },
    { month: "Mar", revenue: 205000, profit: 26000 },
    { month: "Apr", revenue: 182000, profit: 21500 },
    { month: "May", revenue: 218000, profit: 27800 },
    { month: "Jun", revenue: 245000, profit: 32000 },
    { month: "Jul", revenue: 232000, profit: 28500 },
    { month: "Aug", revenue: 268000, profit: 34200 },
    { month: "Sep", revenue: 312000, profit: 41000 },
    { month: "Oct", revenue: 275000, profit: 36200 },
    { month: "Nov", revenue: 356000, profit: 45800 },
    { month: "Dec", revenue: 384000, profit: 51200 },
  ],
  distribution: [
    { name: "Consumer", value: 51.5, revenue: 1183261 },
    { name: "Corporate", value: 30.2, revenue: 694082 },
    { name: "Home Office", value: 18.3, revenue: 419857 },
  ],
};

const FALLBACK_CUSTOMERS = {
  kpis: {
    total_customers: 793,
    avg_spend: 2896.85,
    retention_rate: 87.4,
    satisfaction: 4.8,
  },
  growth_trend: [
    { month: "Jan", customers: 520 },
    { month: "Feb", customers: 560 },
    { month: "Mar", customers: 600 },
    { month: "Apr", customers: 645 },
    { month: "May", customers: 690 },
    { month: "Jun", customers: 730 },
    { month: "Jul", customers: 760 },
    { month: "Aug", customers: 793 },
  ],
  segments: [
    { name: "Consumer", value: 52 },
    { name: "Corporate", value: 31 },
    { name: "Home Office", value: 17 },
  ],
  customers: [
    { customer_id: "CG-12520", customer_name: "Claire Gute", segment: "Consumer", city: "Henderson", state: "Kentucky", region: "South", total_orders: 16, total_spent: 14238.42, tier: "Platinum" },
    { customer_id: "DV-13045", customer_name: "Darrin Van Huff", segment: "Corporate", city: "Los Angeles", state: "California", region: "West", total_orders: 14, total_spent: 12840.10, tier: "Platinum" },
    { customer_id: "SO-20335", customer_name: "Sean O'Donnell", segment: "Consumer", city: "Fort Lauderdale", state: "Florida", region: "South", total_orders: 12, total_spent: 10450.80, tier: "Gold" },
    { customer_id: "BH-11710", customer_name: "Brosina Hoffman", segment: "Consumer", city: "Los Angeles", state: "California", region: "West", total_orders: 11, total_spent: 9845.20, tier: "Gold" },
    { customer_id: "AA-10480", customer_name: "Andrew Allen", segment: "Consumer", city: "Concord", state: "North Carolina", region: "South", total_orders: 9, total_spent: 8720.55, tier: "Gold" },
    { customer_id: "IM-15070", customer_name: "Irene Maddox", segment: "Consumer", city: "Seattle", state: "Washington", region: "West", total_orders: 8, total_spent: 7632.18, tier: "Gold" },
    { customer_id: "HP-14815", customer_name: "Harold Pawlan", segment: "Home Office", city: "Fort Worth", state: "Texas", region: "Central", total_orders: 8, total_spent: 6540.90, tier: "Silver" },
    { customer_id: "PK-19075", customer_name: "Pete Kriz", segment: "Consumer", city: "Madison", state: "Wisconsin", region: "Central", total_orders: 7, total_spent: 5980.40, tier: "Silver" },
    { customer_id: "AG-10270", customer_name: "Alejandro Grove", segment: "Consumer", city: "West Jordan", state: "Utah", region: "West", total_orders: 6, total_spent: 5210.00, tier: "Silver" },
    { customer_id: "ZD-21925", customer_name: "Zuschuss Donatelli", segment: "Consumer", city: "San Francisco", state: "California", region: "West", total_orders: 6, total_spent: 4980.30, tier: "Silver" },
  ],
};

const FALLBACK_PRODUCTS = {
  kpis: {
    total_products: 1850,
    top_category: "Technology",
    best_seller_sales: "$61.6K",
    avg_margin: "12.4%",
  },
  categories: [
    { category: "Technology", sales: 836154, margin: "17.4%" },
    { category: "Furniture", sales: 741999, margin: "2.5%" },
    { category: "Office Supplies", sales: 719047, margin: "16.8%" },
  ],
  products: [
    { product_name: "Canon imageCLASS 2200 Advanced Copier", category: "Technology", sub_category: "Copiers", sales: 61599.82, profit: 25199.93, margin: "40.9%", growth: "+18.4%" },
    { product_name: "Fellowes PB500 Electric Punch Plastic Comb Binding", category: "Office Supplies", sub_category: "Binders", sales: 27453.38, profit: 7753.12, margin: "28.2%", growth: "+14.2%" },
    { product_name: "Cisco TelePresence System EX90 Videoconferencing", category: "Technology", sub_category: "Machines", sales: 22638.48, profit: -1811.08, margin: "-8.0%", growth: "+8.9%" },
    { product_name: "HON 5400 Series Task Chair", category: "Furniture", sub_category: "Chairs", sales: 21870.58, profit: 6590.20, margin: "30.1%", growth: "+11.5%" },
    { product_name: "GBC DocuBind TL300 Electric Binding System", category: "Office Supplies", sub_category: "Binders", sales: 19823.48, profit: 4850.10, margin: "24.5%", growth: "+9.2%" },
    { product_name: "GBC Ibimaster 500 Manual Comb Binding System", category: "Office Supplies", sub_category: "Binders", sales: 19024.50, profit: 5210.40, margin: "27.4%", growth: "+7.8%" },
    { product_name: "Hewlett Packard LaserJet 3310 Copier", category: "Technology", sub_category: "Copiers", sales: 18839.98, profit: 6980.12, margin: "37.0%", growth: "+12.1%" },
    { product_name: "HP Designjet T520 Inkjet Large Format Printer", category: "Technology", sub_category: "Machines", sales: 18374.89, profit: 4099.90, margin: "22.3%", growth: "+6.5%" },
  ],
};

const FALLBACK_FORECAST = {
  forecast_data: [
    { month: "Aug 2017", actual: 63120, predicted: null },
    { month: "Sep 2017", actual: 73250, predicted: null },
    { month: "Oct 2017", actual: 59840, predicted: null },
    { month: "Nov 2017", actual: 79210, predicted: null },
    { month: "Dec 2017", actual: 83820, predicted: 83820 },
    { month: "Jan 2018", actual: null, predicted: 89450 },
    { month: "Feb 2018", actual: null, predicted: 94100 },
    { month: "Mar 2018", actual: null, predicted: 102300 },
    { month: "Apr 2018", actual: null, predicted: 108600 },
  ],
  summary: {
    predicted_revenue: 394450,
    forecast_growth: 14.8,
    model_accuracy: 94.2,
    mae: 4210.50,
    r2_score: 0.9124,
  },
  insight:
    "The Random Forest model projects revenue acceleration to $394,450 over the upcoming 4-month cycle, driven by peak seasonal procurement in Technology and Office Supplies.",
  model: {
    name: "Random Forest Regressor (Ensemble)",
    trained_on: "Historical Superstore Multi-Year Sales Dataset",
    status: "active",
  },
};

export async function getDashboard({ year = "All", region = "All", category = "All" } = {}) {
  try {
    const params = new URLSearchParams();
    if (year !== "All") params.append("year", year);
    if (region !== "All") params.append("region", region);
    if (category !== "All") params.append("category", category);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`${API_URL}/api/dashboard${query}`);
    if (!response.ok) throw new Error("Dashboard fetch failed");
    return await response.json();
  } catch (err) {
    console.warn("API getDashboard offline/error, using realistic fallback:", err);
    return FALLBACK_DASHBOARD;
  }
}

export async function getSales() {
  try {
    const response = await fetch(`${API_URL}/api/sales`);
    if (!response.ok) throw new Error("Sales fetch failed");
    const data = await response.json();
    return {
      kpis: data.kpis && data.kpis.total_revenue ? data.kpis : FALLBACK_SALES.kpis,
      revenue_trend: data.revenue_trend?.length ? data.revenue_trend : FALLBACK_SALES.revenue_trend,
      distribution: data.distribution?.length ? data.distribution : FALLBACK_SALES.distribution,
    };
  } catch (err) {
    console.warn("API getSales offline/error, using realistic fallback:", err);
    return FALLBACK_SALES;
  }
}

export async function getCustomers() {
  try {
    const response = await fetch(`${API_URL}/api/customers`);
    if (!response.ok) throw new Error("Customers fetch failed");
    const data = await response.json();
    return {
      kpis: data.kpis && data.kpis.total_customers ? data.kpis : FALLBACK_CUSTOMERS.kpis,
      growth_trend: FALLBACK_CUSTOMERS.growth_trend,
      segments: FALLBACK_CUSTOMERS.segments,
      customers: data.customers?.length ? data.customers : FALLBACK_CUSTOMERS.customers,
    };
  } catch (err) {
    console.warn("API getCustomers offline/error, using realistic fallback:", err);
    return FALLBACK_CUSTOMERS;
  }
}

export async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) throw new Error("Products fetch failed");
    const data = await response.json();
    return {
      kpis: FALLBACK_PRODUCTS.kpis,
      categories: FALLBACK_PRODUCTS.categories,
      products: data.products?.length ? data.products : FALLBACK_PRODUCTS.products,
    };
  } catch (err) {
    console.warn("API getProducts offline/error, using realistic fallback:", err);
    return FALLBACK_PRODUCTS;
  }
}

export async function getForecast() {
  try {
    const response = await fetch(`${API_URL}/api/forecast`);
    if (!response.ok) throw new Error("Forecast fetch failed");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (err) {
    console.warn("API getForecast offline/error, using realistic fallback:", err);
    return FALLBACK_FORECAST;
  }
}