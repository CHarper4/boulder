import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";   //needed to resolve some dependency error

import {Flex, Box} from "@mantine/core";
import { useUserData } from "@/lib/hooks";


export function BarChart({ dataSet }) {

    const {user, username} = useUserData();

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
        plugins: {
            tooltip: {
                enabled: false
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                text: (username + "'s history") || '',
                align: "start",
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