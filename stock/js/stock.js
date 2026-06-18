// Stock data fetcher with selectable source (FMP HTTP polling as default)

// ---- CONFIGURATION ----
// Choose data source: "FMP" for Financial Modeling Prep HTTP polling, "FINNHUB" for Finnhub WebSocket, "MOCK" for simulated data
const DATA_SOURCE = "MOCK"; // default to mock data when no real API is available

// Finnhub configuration (environment variable preferred)
const FINNHUB_API_KEY = typeof process !== "undefined" && process.env && process.env.FINNHUB_API_KEY ? process.env.FINNHUB_API_KEY : "demo";
const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

// Financial Modeling Prep configuration (free tier, requires API key for higher rate limits)
const FMP_API_KEY = typeof process !== "undefined" && process.env && process.env.FMP_API_KEY ? process.env.FMP_API_KEY : "demo"; // replace "demo" with your key
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3/quote/"; // endpoint: /{symbol}?apikey=KEY

// ---- COMMON UI ELEMENTS ----
const symbolInput = document.getElementById("symbolInput");
const loadBtn = document.getElementById("loadBtn");
const priceChartCtx = document.getElementById("priceChart").getContext("2d");
let chartInstance = null;
let pollTimer = null;
let ws = null;
let currentSymbol = "";

function initChart() {
  const cfg = {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Harga",
        data: [],
        borderColor: "var(--accent)",
        backgroundColor: "rgba(255,255,255,0.1)",
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: { x: { display: false }, y: { beginAtZero: false } },
      animation: { duration: 300 }
    }
  };
  chartInstance = new Chart(priceChartCtx, cfg);
}

function updateInfo(symbol, price) {
  document.getElementById("stockSymbol").textContent = symbol.toUpperCase();
  document.getElementById("currentPrice").textContent = price.toFixed(2);
  document.getElementById("stockInfo").hidden = false;
}

function appendChartData(label, price) {
  const chart = chartInstance;
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(price);
  if (chart.data.labels.length > 50) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

// ----- FINNHUB (WebSocket) -----
function startFinnhub(symbol) {
  if (ws) ws.close();
  ws = new WebSocket(FINNHUB_WS_URL);
  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ type: "subscribe", symbol }));
    console.log("Finnhub subscribed to", symbol);
  });
  ws.addEventListener("message", ev => {
    const data = JSON.parse(ev.data);
    if (data.type === "trade" && data.data && data.data.length) {
      const price = data.data[0].p;
      const time = new Date(data.data[0].t).toLocaleTimeString();
      updateInfo(symbol, price);
      appendChartData(time, price);
    }
  });
  ws.addEventListener("close", () => {
    console.log("Finnhub socket closed, retrying in 5s");
    setTimeout(() => startFinnhub(symbol), 5000);
  });
}

// ----- FMP (HTTP polling) -----
function startFmpPolling(symbol) {
  // Reset chart
  if (chartInstance) chartInstance.destroy();
  initChart();
  // Immediate fetch then interval (every 5 seconds)
  fetchFmp(symbol);
  pollTimer = setInterval(() => fetchFmp(symbol), 5000);
}

function fetchFmp(symbol) {
  const url = `${FMP_BASE_URL}${encodeURIComponent(symbol)}?apikey=${FMP_API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      // FMP returns an array; first element contains price info
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const price = parseFloat(item.price) || parseFloat(item.lastPrice) || 0;
        const time = new Date().toLocaleTimeString();
        if (price) {
          updateInfo(symbol, price);
          appendChartData(time, price);
        }
      } else {
        console.warn("FMP returned no data for", symbol);
      }
    })
    .catch(err => console.error("FMP fetch error:", err));
}

// ----- MOCK (simulated data) -----
function startMockPolling(symbol) {
  // Initialize mock price randomly between 1000 and 2000
  let mockPrice = 1000 + Math.random() * 1000;
  if (chartInstance) chartInstance.destroy();
  initChart();
  // Immediate update then interval
  updateInfo(symbol, mockPrice);
  appendChartData(new Date().toLocaleTimeString(), mockPrice);
  pollTimer = setInterval(() => {
    // Simulate price change within ±2%
    const change = (Math.random() - 0.5) * 0.04 * mockPrice;
    mockPrice = Math.max(0, mockPrice + change);
    const time = new Date().toLocaleTimeString();
    updateInfo(symbol, mockPrice);
    appendChartData(time, mockPrice);
  }, 5000);
}


function loadSymbol() {
  const symbol = symbolInput.value.trim();
  if (!symbol) return;
  currentSymbol = symbol;
  // Clean previous
  if (pollTimer) clearInterval(pollTimer);
  if (ws) ws.close();
  if (chartInstance) chartInstance.destroy();
  // Toggle mock notice visibility based on selected data source
  const notice = document.getElementById("mockNotice");
  if (notice) notice.style.display = DATA_SOURCE === "MOCK" ? "block" : "none";
  if (DATA_SOURCE === "FINNHUB") {
    startFinnhub(symbol);
  } else if (DATA_SOURCE === "MOCK") {
    startMockPolling(symbol);
  } else {
    // Default to FMP polling
    startFmpPolling(symbol);
  }
}

loadBtn.addEventListener("click", loadSymbol);
// Initialize empty chart on page load
initChart();
