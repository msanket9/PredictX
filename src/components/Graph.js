import { Bar, Line } from "react-chartjs-2";

export function MyResponsiveGraph({ data }) {

  const borderColor = data.borderColor;
  const backgroundColor = data.backgroundColor;

  const graphData = {
    labels: [], // Dates
    datasets: [
      {
        label: data.type,
        data: [], // Values
        fill:true,
        // backgroundColor: "rgba(0, 164, 89, 0.2)",
        // backgroundColor: "rgba(255, 212, 204, 0.5)",
        backgroundColor: backgroundColor,
        // borderColor: "rgba(0, 164, 89, 1)",
        // borderColor: "rgb(255, 97, 97)",
        borderColor: borderColor,
        borderWidth: 2.5
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  // Add the data.
  data.records[data.type].map((item) => {
    graphData.labels.push(item.date);
    graphData.datasets[0].data.push(item.value);
  });

  if (data.graphType === "bar") {
    return <Bar data={graphData} options={options} height={100} width={100} />;
  } else {
    return <Line data={graphData} options={options} height={100} width={100} />;
  }
}
