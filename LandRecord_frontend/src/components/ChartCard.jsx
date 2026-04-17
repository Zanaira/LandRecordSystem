import { useEffect, useState } from "react";
import API from "./../services/api";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function LandTypePieChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    API.get("/landRecord")
      .then((res) => {
        const data = res.data;

        // Initialize counts
        const counts = {
          Agricultural: 0,
          Residential: 0,
          Commercial: 0,
        };

        // Count each land_type
        data.forEach((item) => {
          if (counts[item.land_type] !== undefined) {
            counts[item.land_type] += 1;
          }
        });

        const total = Object.values(counts).reduce((a, b) => a + b, 0);

        setChartData({
          labels: ["Agricultural", "Residential", "Commercial"],
          datasets: [
            {
              label: "Land Types",
              data: [
                counts.Agricultural,
                counts.Residential,
                counts.Commercial,
              ],
              backgroundColor: ["#519c82", "#abbca1", "#ecba7d"], // green, light green, orange
              borderColor: "#fff",
              borderWidth: 2,
              cutout: "70%", // donut effect
            },
          ],
          percentages: {
            Agricultural: ((counts.Agricultural / total) * 100).toFixed(0),
            Residential: ((counts.Residential / total) * 100).toFixed(0),
            Commercial: ((counts.Commercial / total) * 100).toFixed(0),
          },
        });
      })
      .catch((err) => console.error(err));
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem",background:'white',borderRadius:10,width:'50%' }}>
      {/* Chart */}
      <div style={{ width: "250px" }}>
         <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>
          Land Type Distribution
        </h3>
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              legend: { display: false }, // hide default legend
              tooltip: { enabled: false }, // disable hover tooltip
            },
          }}
        />
      </div>

      {/* Custom Legend */}
      <div>
       
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {chartData.labels.map((label, index) => (
            <li
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "20px",
               
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: chartData.datasets[0].backgroundColor[index],
                  marginRight: "8px",
                  border:'none'
                }}
              ></span>
              {label}{" "}
              <span style={{ marginLeft: "auto", fontWeight: "300" }}>
                {chartData.percentages[label]}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
