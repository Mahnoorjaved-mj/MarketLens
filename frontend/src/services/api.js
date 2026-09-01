const months = [
  ["Jan", 145000],
  ["Feb", 158000],
  ["Mar", 171000],
  ["Apr", 166000],
  ["May", 184000],
  ["Jun", 192000],
  ["Jul", 201000],
  ["Aug", 215000],
  ["Sep", 198000],
  ["Oct", 226000],
  ["Nov", 241000],
  ["Dec", 248000],
];

const sleep = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function getPageData(fn) {
  return fn();
}

export async function getDashboardData() {

  await sleep();

  const trend = months.map(
    ([label, value]) => ({
      label,
      value
    })
  );

  const revenue = trend.reduce(
    (s, x) => s + x.value,
    0
  );

  return {
    total_revenue: revenue,
    total_orders: 4994,
    active_customers: 793,
    net_profit: 286400,

    profit_margin:
      (286400 / revenue) * 100,

    average_monthly_revenue:
      revenue / trend.length,

    revenue_trend: trend,

    source: "PostgreSQL + Power BI",
  };
}


export async function getSalesData() {

  await sleep();

  const monthly_sales = months.map(
    ([label, value]) => ({
      label,
      value,
      revenue: value
    })
  );

  const total_revenue =
    monthly_sales.reduce(
      (s, x) => s + x.value,
      0
    );

  return {

    total_revenue,

    total_orders: 4994,

    average_order_value:
      total_revenue / 4994,

    growth_rate: 8.9,

    monthly_sales,

    categories: [
      {
        category: "Technology",
        revenue: 1286000,
        profit: 176400,
        percent: 43.4
      },
      {
        category: "Furniture",
        revenue: 1012000,
        profit: 54600,
        percent: 34.2
      },
      {
        category: "Office Supplies",
        revenue: 664000,
        profit: 55400,
        percent: 22.4
      },
    ],

    regions: [
      {
        region: "West",
        revenue: 890000,
        growth: 14.2
      },
      {
        region: "East",
        revenue: 740000,
        growth: 10.8
      },
      {
        region: "Central",
        revenue: 620000,
        growth: 7.6
      },
      {
        region: "South",
        revenue: 712000,
        growth: 9.1
      },
    ],

    source: "Superstore Analytics Dataset",
  };
}


export async function getCustomersData() {

  await sleep();

  const segments = [
    {
      name: "Consumer",
      count: 425,
      percent: 53.6,
      revenue: 1605000
    },
    {
      name: "Corporate",
      count: 236,
      percent: 29.8,
      revenue: 910000
    },
    {
      name: "Home Office",
      count: 132,
      percent: 16.6,
      revenue: 447000
    },
  ];

  return {

    total_customers: 793,

    active_customers: 793,

    customer_value: 2965,

    segments,

    top_customers: [
      {
        customer: "Sean Miller",
        orders: 24,
        revenue: 25400
      },
      {
        customer: "Tamara Chand",
        orders: 22,
        revenue: 23100
      },
      {
        customer: "Raymond Buch",
        orders: 19,
        revenue: 21800
      },
      {
        customer: "Adrian Barton",
        orders: 18,
        revenue: 20500
      },
      {
        customer: "Hunter Lopez",
        orders: 17,
        revenue: 19700
      },
      {
        customer: "Maria Bertelson",
        orders: 16,
        revenue: 18600
      },
    ],
  };
}


export async function getProductsData() {

  await sleep();

  const products = [
    [
      "Canon imageCLASS 2200 Advanced Copier",
      "Technology",
      62,
      61600,
      25100
    ],
    [
      "Fellowes PB500 Electric Punch",
      "Office Supplies",
      38,
      28600,
      6700
    ],
    [
      "Cisco TelePresence System",
      "Technology",
      31,
      24400,
      5900
    ],
    [
      "HON 5400 Series Task Chairs",
      "Furniture",
      72,
      22100,
      3800
    ],
    [
      "GBC DocuBind TL300",
      "Office Supplies",
      64,
      20800,
      5100
    ],
    [
      "Hewlett Packard LaserJet",
      "Technology",
      56,
      19600,
      4400
    ],
    [
      "HP Designjet T520 Printer",
      "Technology",
      43,
      18400,
      3900
    ],
    [
      "GBC DocuBind P400",
      "Office Supplies",
      51,
      17100,
      3600
    ],
  ].map(
    ([
      product,
      category,
      units_sold,
      revenue,
      profit
    ]) => ({
      product,
      category,
      units_sold,
      revenue,
      profit,
      percent:
        (revenue / 61600) * 25
    })
  );

  return {

    total_products: 1862,

    best_seller: products[0].product,

    top_product_revenue:
      products[0].revenue,

    top_product_share: 2.1,

    products,
  };
}


export async function getForecastData() {

  await sleep();

  const actual =
    months.slice(0, 8).map(
      ([label, value]) => ({
        label,
        value
      })
    );

  const forecast = [
    ["Sep", 224000],
    ["Oct", 238000],
    ["Nov", 251000],
    ["Dec", 267000]
  ].map(
    ([label, value]) => ({
      label,
      value
    })
  );

  return {

    actual,

    forecast,

    accuracy: 89.4,

    predicted_revenue: 245000,

    expected_growth: 10.8,

    horizon: 4,

    model: "Trend-based Forecast",

    training_records: 4994,

    mae: "12.4K",

    r2: "0.89",

    insight:
      "Revenue is projected to continue its upward trend, with the strongest performance expected in the final quarter. Technology remains the largest contributor to forecast growth.",
  };
}


export function formatPKR(value) {

  const n = Number(value || 0);

  if (Math.abs(n) >= 1000000)
    return `Rs ${(n / 1000000).toFixed(2)}M`;

  if (Math.abs(n) >= 1000)
    return `Rs ${(n / 1000).toFixed(1)}K`;

  return `Rs ${Math.round(n).toLocaleString()}`;
}


export function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}


export function pct(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}