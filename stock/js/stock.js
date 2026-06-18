// Real‑time stock data fetcher using Alpha Vantage (free tier)
// Replace the placeholder API key with your own key for production.
const API_KEY = "demo"; // TODO: provide real key
const BASE_URL = "https://www.alphavantage.co/query";

const symbolInput = document.getElementById("symbolInput");
const loadBtn = document.getElementById("loadBtn");
const priceChartCtx = document.getElementById("priceChart").getContext("2d");
let chartInstance = null;
let refreshTimer = null;

function fetchIntraday(symbol) {
  const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${encodeURIComponent(symbol)}&interval=1min&outputsize=compact&apikey=${API_KEY}`;
  return fetch(url).then(res => res.json());
}

function renderChart(data) {
  const series = data["Time Series (1min)"];
  if (!series) {
    console.error("Invalid data", data);
    return;
  }
  const labels = Object.keys(series).reverse();
  const prices = labels.map(t => parseFloat(series[t]["4. close"]));
  const cfg = {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Close Price",
        data: prices,
        borderColor: "var(--accent)",
        backgroundColor: "rgba(255,255,255,0.1)",
        tension: 0.2,
      }]
    },
    options: {
      responsive: true,
      scales: { x: { display: false }, y: { beginAtZero: false } },
      animation: { duration: 500 }
    }
  };
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(priceChartCtx, cfg);
}

function updateInfo(symbol, data) {
  const series = data["Time Series (1min)"];
  const latestKey = Object.keys(series)[0];
  const latest = series[latestKey];
  document.getElementById("stockSymbol").textContent = symbol.toUpperCase();
  document.getElementById("currentPrice").textContent = latest["4. close"];
  document.getElementById("stockInfo").hidden = false;
}

function loadSymbol() {
  const symbol = symbolInput.value.trim();
  if (!symbol) return;
  clearInterval(refreshTimer);
  fetchIntraday(symbol).then(data => {
    renderChart(data);
    updateInfo(symbol, data);
    // Refresh every 60 seconds.
    refreshTimer = setInterval(loadSymbol, 60000);
  }).catch(err => console.error(err));
}

loadBtn.addEventListener("click", loadSymbol);
