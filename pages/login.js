import { UserContext } from "@/lib/context";
import { auth, googleAuthProvider, getTodayRef, getWeekData } from "../lib/firebase";
import { BarChart } from "@/components/bar_chart";
import { UsernameForm } from "@/components/username_form";

import { useContext, useState, useEffect } from "react";
import { Center, Button, Affix, Flex, Box, rem } from "@mantine/core";
import { getTodayDate } from "@/lib/hooks";


export default function Login() {

    const { user, username } = useContext(UserContext);

    const [graphData, setGraphData] = useState({
        labels: [],
        datasets: [{
            label: "Sessions",
            data: [],
            backgroundColor: ["#099268"],
        }],
    });

    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);

        //create day's document on sign-in
        const todayRef = getTodayRef();
        todayRef.get()
            .then(docSnapshot => {
                if(!docSnapshot.exists) {
                    const date = getTodayDate();
                    todayRef.set({
                        completed: 0, 
                        description: "",
                        date: date
                    }).catch(e => console.error('error creating day doc ', e));
                } else {
                    console.log('todayDoc exists')
                }
            });

        retrieveWeekData();
    }

    //populate graph with user's data
    const retrieveWeekData = async () => {
        let weekData = await getWeekData();

        let dateLabels = [];
        let dateValues = [];

        for(const [key, value] of Object.entries(weekData)) {
            let splitDate = key.split('-');
            dateLabels.push(splitDate[0] + " / " + splitDate[1]);
            dateValues.push(value);
        }

        setGraphData({
            labels: dateLabels,
            datasets: [{
                label: "Sessions",
                data: dateValues,
                backgroundColor: ["#099268"],
            }],
        });
    }

    useEffect(() => {
        retrieveWeekData();
    }, []);

    return (
        <>
        <Center>
            <h3>{username}</h3>
            {user ? 
                username ? 
                        <Affix position={{ bottom: rem(20), right: rem('46.5%') }}>
                            <Button color="gray" onClick={() => auth.signOut()}>Sign Out</Button>
                        </Affix>
                        : 
                        <UsernameForm />
                    :
                    <Button color="light gray" onClick={signInWithGoogle}>Sign In with Google</Button>
            }
        </Center>
        <Center>
            <BarChart dataSet={graphData} />
        </Center>
        </>
    )
}