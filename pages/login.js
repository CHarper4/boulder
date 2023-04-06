import { UserContext } from "@/lib/context";
import { auth, googleAuthProvider, getTodayRef, getSessionData } from "../lib/firebase";
import { BarChart } from "@/components/bar_chart";
import { UsernameForm } from "@/components/username_form";

import { useContext, useState, useEffect } from "react";
import { Center, Button, Affix, Stack, LoadingOverlay, Box, rem, useMantineColorScheme } from "@mantine/core";
import { getTodayDate } from "@/lib/hooks";
import { BrandGoogle } from "tabler-icons-react";


export default function Login() {

    const { user, username } = useContext(UserContext);
    const { colorScheme } = useMantineColorScheme();

    const [graphAmount, setGraphAmount] = useState(7);
    const [graphData, setGraphData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ["#12b886"], 
        }],
    });
    const [graphIsLoading, setGraphIsLoading] = useState(false);

    const [weekBtnVariant, setWeekBtnVariant] = useState("filled");
    const [monthBtnVariant, setMonthButtonVariant] = useState("outline");


    const signInWithGoogle = async () => {
        let signedIn = true;
        await auth.signInWithPopup(googleAuthProvider)
            .catch(e => {
                console.error("Error signing in: ", e); 
                signedIn = false;
            });

        if(signedIn) {
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

    }

    //populate graph with user's data
    const retrieveWeekData = async () => {
        setGraphIsLoading(true);

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
                data: dateValues,
                backgroundColor: ["#12b886"]
            }],
        });

        setGraphIsLoading(false);
    }

    useEffect(() => {
        if(user) {
            retrieveWeekData();
        }
    }, [graphAmount]);


    //position={{ bottom: rem('50%'), right: rem('38.5%')}}
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
                    <>
                    <Stack align="center">
                        <Button 
                            variant="filled" 
                            color="teal" 
                            onClick={signInWithGoogle}
                            leftIcon={<BrandGoogle size={20} strokeWidth={2.5} color={"white"}/>}
                        >Sign In</Button>
                        <p>log in to record your sessions and see stats</p>
                    </Stack>
                    </>
            }
        </Center>
        
        {(user && username) && 
            <>
            <Stack align="center" justify="center" spacing="xl">
                <Box pos="relative">
                    <LoadingOverlay 
                        visible={graphIsLoading} 
                        loaderProps={{ color: 'teal', variant: 'bars' }} 
                        overlayBlur={5} 
                        overlayColor={colorScheme == 'dark' ? "#1a1b1e" : "#FFFFFF"}
                        transitionDuration={500}
                    />
                    <BarChart dataSet={graphData} />
                </Box>
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
        }
        </>
    )
}