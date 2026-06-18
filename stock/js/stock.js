// Real‑time stock data fetcher using Finnhub WebSocket (demo key)
// Ganti API_KEY dengan kunci Finnhub Anda untuk produksi.
const API_KEY = "demo"; // Finnhub demo token
const WS_URL = `wss://ws.finnhub.io?token=${API_KEY}`;

const symbolInput = document.getElementById("symbolInput");
const loadBtn = document.getElementById("loadBtn");
const priceChartCtx = document.getElementById("priceChart").getContext("2d");
let chartInstance = null;
let socket = null;
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

function connectWebSocket(symbol) {
  if (socket) { socket.close(); }
  socket = new WebSocket(WS_URL);
  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: "subscribe", symbol }));
    console.log("Subscribed to", symbol);
  });
  socket.addEventListener("message", event => {
    const data = JSON.parse(event.data);
    if (data.type === "trade" && data.data && data.data.length) {
      const price = data.data[0].p;
      const time = new Date(data.data[0].t).toLocaleTimeString();
      updateInfo(symbol, price);
      appendChartData(time, price);
    }
  });
  socket.addEventListener("close", () => {
    console.log("WebSocket closed, attempting reconnect in 5s");
    setTimeout(() => connectWebSocket(symbol), 5000);
  });
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
  // Keep only latest 50 points
  if (chart.data.labels.length > 50) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

function loadSymbol() {
  const symbol = symbolInput.value.trim();
  if (!symbol) return;
  currentSymbol = symbol;
  if (chartInstance) chartInstance.destroy();
  initChart();
  connectWebSocket(symbol);
}

loadBtn.addEventListener("click", loadSymbol);
