import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";   //needed to resolve some dependency error


export function BarChart({ dataSet }) {
    return <Bar data={dataSet} />
}

