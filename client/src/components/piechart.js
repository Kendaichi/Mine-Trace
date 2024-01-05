import { Pie } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
// import { Chart as ChartJS } from "chart.js/auto";

export default function PieChart({ chartData }) {
  return (
    <Pie
      data={chartData}
      // height={400}
      // width={700}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Ore Mined per Group",
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
