import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function BarGraph({ names, data }) {
    const series = [
        {
            name: "Active Tasks",
            data: data
        }
    ]
    const options = {
        chart: {
            type: "bar",
            height: 350,
            animations: {
                enabled: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    position: "top"
                }
            }
        },
        dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
                fontSize: "12px",
                colors: ["#304758"]
            }
        },
        xaxis: {
            categories: names
        },
        yaxis: {
            title: {
                text: "No. of Tasks"
            },
            labels: {
                formatter: function (val) {
                  return val?.toFixed(0);
                }
            },
        },
        fill: {
            opacity: 1
        },
        title: {
            text: "Active Tasks In Active Projects",
            floating: true,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444"
            }
        },
    };

    return (
        <Box
            p={4}
            flex={1}
            bgcolor="#fcfcfc"
            id="chart"
            display="flex"
            flexDirection="column"
            borderRadius="15px"
        >
            {/* <Typography fontSize={18} fontWeight={600} color="#11142d">
                Active Tasks In Active Projects
            </Typography> */}

            <ReactApexChart
                series={series}
                type="bar"
                height={350}
                options={options}
            />
        </Box>
    )
}

export default BarGraph;