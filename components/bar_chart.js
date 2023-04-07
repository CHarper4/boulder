import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";   //needed to resolve some dependency error

import {Flex, Box} from "@mantine/core";
import { useUserData } from "@/lib/hooks";


export function BarChart({ dataSet }) {

    const { username } = useUserData();

    const options = {
        scales: {
            y: {
                suggestedMax: 8,
                grid: {
                    color: "gray"
                }
            },
            x: {
                grid: {
                    color: ""
                }
            }
        },
        animation: {
            duration: 0
        },
        plugins: {
            tooltip: {
                enabled: false
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                text: (username + "'s History") || '',
                align: "center",
                fullSize: false,
                font: {
                    size: 16
                },
                padding: {
                    bottom: 20
                }
            }
        }
    }

    return (
        <Flex>
            <Box w={800}>
                <Bar data={dataSet} options={options}/>
            </Box>
        </Flex>
    )
}