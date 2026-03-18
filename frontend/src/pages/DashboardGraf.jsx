import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminSalesGraph() {

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  const data = {
    labels: ["Sales", "Orders", "Users"],
    datasets: [
      {
        label: "Admin Dashboard Data",
        data: [stats.totalSales, stats.totalOrders, stats.totalUsers],
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"]
      }
    ]
  };

  return (
    <div style={{ width: "600px", margin: "40px auto" }}>
      <h2>Admin Sales </h2>
      <Bar data={data} />
    </div>
  );
}