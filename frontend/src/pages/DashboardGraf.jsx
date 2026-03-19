import "chartjs-adapter-date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, Line, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { api } from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function DashboardGraf() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({ sales: [], orders: [], users: [] });
  const chartRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/dashboard/analytics")
      .then((res) => setAnalytics(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const salesData = useMemo(() => {
    return {
      labels: analytics.sales.map((d) => d.date),
      datasets: [
        {
          label: "Total Sales",
          data: analytics.sales.map((d) => d.totalSales),
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderRadius: 12,
          maxBarThickness: 50,
        },
      ],
    };
  }, [analytics.sales]);

  const ordersData = useMemo(() => {
    return {
      labels: analytics.orders.map((d) => d.date),
      datasets: [
        {
          label: "Orders",
          data: analytics.orders.map((d) => d.count),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.17)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#3b82f6",
        },
      ],
    };
  }, [analytics.orders]);

  const usersData = useMemo(() => {
    const ctx = chartRef.current?.ctx || chartRef.current?.canvas?.getContext("2d");
    const gradient = ctx
      ? ctx.createLinearGradient(0, 0, 0, 240)
      : null;

    if (gradient) {
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.65)");
      gradient.addColorStop(0.7, "rgba(139, 92, 246, 0.18)");
      gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
    }

    return {
      labels: analytics.users.map((d) => d.date),
      datasets: [
        {
          label: "Users",
          data: analytics.users.map((d) => d.count),
          borderColor: "#8b5cf6",
          backgroundColor: gradient || "rgba(139, 92, 246, 0.25)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: "#8b5cf6",
        },
      ],
    };
  }, [analytics.users]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          titleFont: { size: 14, weight: "700" },
          bodyFont: { size: 13 },
          padding: 12,
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed.y;
              return ctx.dataset.label === "Total Sales"
                ? `₹${value.toLocaleString()}`
                : value.toLocaleString();
            },
          },
        },
      },
      scales: {
        x: {
          type: "timeseries",
          time: {
            unit: "day",
            tooltipFormat: "PP",
          },
          grid: { display: false },
          ticks: { color: "rgba(55, 65, 81, 0.7)" },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(15, 23, 42, 0.08)" },
          ticks: { color: "rgba(55, 65, 81, 0.7)" },
        },
      },
      animation: { duration: 550, easing: "easeOutQuart" },
    }),
    []
  );

  return (
    <div className="analytics-grid">
      <div className="analytics-card">
        <div className="analytics-card__header">
          <div>
            <h2>Sales Overview</h2>
            <p className="analytics-card__subtitle">Last 7 days</p>
          </div>
        </div>
        <div className="analytics-card__chart">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="analytics-error">{error}</p>
          ) : (
            <Bar data={salesData} options={chartOptions} />
          )}
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-card__header">
          <div>
            <h2>Orders Trend</h2>
            <p className="analytics-card__subtitle">Weekly performance</p>
          </div>
        </div>
        <div className="analytics-card__chart">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="analytics-error">{error}</p>
          ) : (
            <Line data={ordersData} options={chartOptions} />
          )}
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-card__header">
          <div>
            <h2>User Growth</h2>
            <p className="analytics-card__subtitle">Monthly data</p>
          </div>
        </div>
        <div className="analytics-card__chart">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="analytics-error">{error}</p>
          ) : (
            <div className="chart-wrapper">
              <Line ref={chartRef} data={usersData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
