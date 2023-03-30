import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";   //needed to resolve some dependency error

import { useContext } from "react";
import { UserContext } from "@/lib/context";

import {Flex, Box} from "@mantine/core";


export function BarChart({ dataSet }) {
    const { user, username } = useContext(UserContext);

    return (
    <>
    {(user && username) ?
        <Flex>
            <Box w={800}>
                <Bar data={dataSet} />
            </Box>
        </Flex>
        :
        <p>log in to see stats</p>
    }
    </> 
    )
}