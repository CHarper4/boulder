import { UserContext } from "@/lib/context";
import { auth, firestore, googleAuthProvider, getTodayRef, getSessionData } from "../lib/firebase";
import { BarChart } from "@/components/bar_chart";
import { UsernameForm } from "@/components/username_form";

import { useContext, useState, useEffect } from "react";
import { Center, Button, Affix, Stack, rem } from "@mantine/core";
import { getTodayDate } from "@/lib/hooks";


export default function Login() {

    const { user, username } = useContext(UserContext);

    const [graphAmount, setGraphAmount] = useState(7);
    const [graphData, setGraphData] = useState({
        labels: [],
        datasets: [{
            label: "Sessions",
            data: [],
            backgroundColor: ["#12b886"], 
        }],
    });

    const [weekBtnVariant, setWeekBtnVariant] = useState("filled");
    const [monthBtnVariant, setMonthButtonVariant] = useState("outline");


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
                backgroundColor: ["#12b886"],
            }],
        });
    }

    useEffect(() => {
        if(user) {
            retrieveWeekData();
        }
    }, [graphAmount]);

    return (
        <>
        <Center>
            {user ? 
                username ? 
                        <Affix position={{ bottom: rem(20), right: rem('46.5%') }}>
                            <Button color="gray" onClick={() => auth.signOut()}>Sign Out</Button>
                        </Affix>
                        : 
                        <UsernameForm />
                    :
                    <Button variant="filled" color="teal" onClick={signInWithGoogle}>Sign In with Google</Button>
            }
        </Center>
        
        {user && username ? 
            <>
            <Stack align="center" justify="center" spacing="xl">
                <BarChart dataSet={graphData} />
                <Button.Group>
                    <Button 
                        variant={weekBtnVariant} 
                        color="teal" 
                        size="xs" 
                        radius="xs" 
                        onClick={() => {
                            setGraphAmount(7);
                            setWeekBtnVariant("filled");
                            setMonthButtonVariant("outline");
                        }}
                    >Week</Button>
                    <Button 
                        variant={monthBtnVariant} 
                        color="teal" 
                        size="xs" 
                        radius="xs" 
                        onClick={() => {
                            setGraphAmount(31);
                            setMonthButtonVariant("filled");
                            setWeekBtnVariant("outline");
                        }}
                    >Month</Button>
                </Button.Group>
            </Stack>
            </>
            :
            <Affix position={{ bottom: rem('50%'), right: rem('38.5%')}}>
                <p>log in to record your sessions and see stats</p>
            </Affix>
        }
        </>
    )
}