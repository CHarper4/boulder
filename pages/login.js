import { UserContext } from "@/lib/context";
import { auth, googleAuthProvider, getTodayRef, getSessionData } from "../lib/firebase";
import { BarChart } from "@/components/bar_chart";
import { UsernameForm } from "@/components/username_form";

import { useContext, useState, useEffect } from "react";
import { Center, Button, Affix, Flex, Box, rem } from "@mantine/core";
import { getTodayDate } from "@/lib/hooks";


export default function Login() {

    const { user, username } = useContext(UserContext);
    const [graphAmount, setGraphAmount] = useState(7);
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
                }
            });

        retrieveWeekData();
    }

    //populate graph with user's data
    const retrieveWeekData = async () => {
        let weekData = await getSessionData(graphAmount);

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
        if(user) {
            retrieveWeekData();
        }
    }, [graphAmount]);

    const testFunc = () => {
        let dateObj = new Date();
        dateObj.setDate(dateObj.getDate()-32);
        let d = (dateObj.getMonth()+1) + '-' + dateObj.getDate() + '-' + dateObj.getFullYear();
        console.log('d: ' + d);
    }

    return (
        <>
        <Center>
            <h3>{username}</h3>
            {user ? 
                username ? 
                        <Affix position={{ bottom: rem(20), right: rem('46.5%') }}>
                            <Button color="gray" onClick={() => auth.signOut()}>Sign Out</Button>
                            <Button onClick={() => testFunc()}>testFunc</Button>
                        </Affix>
                        : 
                        <UsernameForm />
                    :
                    <Button color="light gray" onClick={signInWithGoogle}>Sign In with Google</Button>
            }
        </Center>
        
        <Flex maw={1070} justify="flex-end">
            <Button.Group>
                <Button variant="outline"  color="teal" size="xs" radius="xs" onClick={() => setGraphAmount(7)}>Week</Button>
                <Button variant="outline" color="teal" size="xs" radius="xs" onClick={() => setGraphAmount(31)}>Month</Button>
            </Button.Group>
        </Flex>
        
        <Center>
            <BarChart dataSet={graphData} />
        </Center>
        </>
    )
}