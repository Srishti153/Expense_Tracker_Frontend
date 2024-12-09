import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch stats data
  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/stats");
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch chart data
  const fetchChartData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/stats/chart");
      if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Chart Data:", data); // Log chart data to inspect

      // Prepare chart data
      const labels = [];
      const incomeData = [];
      const expenseData = [];

      // Process incomeList
      data.incomeList.forEach(item => {
        labels.push(item.title); // Use title or date as label
        incomeData.push(item.amount); // Use amount as value
      });

      // Process expenseList
      data.expenseList.forEach(item => {
        labels.push(item.title); // Use title or date as label
        expenseData.push(item.amount); // Use amount as value
      });

      const formattedChartData = {
        labels: labels,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            borderColor: "green",
            backgroundColor: "rgba(0, 128, 0, 0.1)",
          },
          {
            label: "Expense",
            data: expenseData,
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
          },
        ],
      };

      setChartData(formattedChartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchStats(), fetchChartData()]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!stats || !chartData) {
    return <div className="error">Failed to load data. Please try again later.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="top-cards">
        <div className="card balance">
          <h3>Balance</h3>
          <p>${stats.balance !== undefined ? stats.balance : "N/A"}</p>
        </div>
        <div className="card income">
          <h3>Total Income</h3>
          <p>${stats.income !== undefined ? stats.income : "N/A"}</p>
        </div>
        <div className="card expense">
          <h3>Total Expense</h3>
          <p>${stats.expense !== undefined ? stats.expense : "N/A"}</p>
        </div>
      </div>

      <div className="chart-card">
        <h3>Income vs Expense Chart</h3>
        {chartData && chartData.labels.length > 0 ? (
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        ) : (
          <p>No chart data available.</p>
        )}
      </div>

      <div className="history-cards">
        <div className="card recent-history">
          <h4>Recent History</h4>
          {stats.latestIncome && stats.latestExpense ? (
            <>
              <p className="positive">
                + ${stats.latestIncome.amount} {stats.latestIncome.title} - {stats.latestIncome.description}
              </p>
              <p className="negative">
                - ${stats.latestExpense.amount} {stats.latestExpense.title} - {stats.latestExpense.description}
              </p>
            </>
          ) : (
            <p>No recent history available.</p>
          )}
        </div>
        <div className="card stats">
          <h4>Income</h4>
          <p>Minimum: ${stats.minIncome !== undefined ? stats.minIncome : "N/A"}</p>
          <p>Maximum: ${stats.maxIncome !== undefined ? stats.maxIncome : "N/A"}</p>
          <h4>Expense</h4>
          <p>Minimum: ${stats.minExpense !== undefined ? stats.minExpense : "N/A"}</p>
          <p>Maximum: ${stats.maxExpense !== undefined ? stats.maxExpense : "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
