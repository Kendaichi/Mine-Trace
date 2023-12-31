import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS } from "chart.js/auto";

export default function BarChart({ chartData }) {
  return (
    <Bar
      data={chartData}
      // height={400}
      width={700}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Monthly Produce",
            font: {
              size: 20,
            },
          },
          legend: {
            position: "bottom",
          },
        },
      }}
    />
  );
}
