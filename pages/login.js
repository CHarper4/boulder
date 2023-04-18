import { TimerContext, UserContext } from "@/lib/context";
import { auth, googleAuthProvider, getTodayRef, getSessionData } from "../lib/firebase";
import { BarChart } from "@/components/bar_chart";
import { UsernameForm } from "@/components/username_form";
import { createEPAccount, signInWithEP } from "@/lib/hooks";

import { useContext, useState, useEffect } from "react";
import { Center, Button, Affix, Stack, LoadingOverlay, Box, Card, TextInput, Divider, Modal, rem, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getTodayDate } from "@/lib/hooks";
import { BrandGoogle } from "tabler-icons-react";


export default function Login() {

    const { user, username, setPomoSeconds, setBreakSeconds } = useContext(UserContext);
    const { refreshTimer } = useContext(TimerContext);
    const { colorScheme } = useMantineColorScheme();

    const [weekBtnVariant, setWeekBtnVariant] = useState("filled");
    const [monthBtnVariant, setMonthButtonVariant] = useState("outline");

    //graph state
    const [graphAmount, setGraphAmount] = useState(7);
    const [graphIsLoading, setGraphIsLoading] = useState(false);
    const [graphData, setGraphData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ["#12b886"], 
        }],
    });

    //sign in and account creation state
    const [modalOpened, {open, close}] = useDisclosure(false);
    const [createEmail, setCreateEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');


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
                        }).catch(e => console.error('Error creating day doc ', e));
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

    //retrieve new set of data on graph range change
    useEffect(() => {
        if(user) {
            retrieveWeekData();
        }
    }, [graphAmount]);


    return (
        <>
        <Modal opened={modalOpened} onClose={close} title="Create an account">
            <TextInput 
                label="Email" 
                value={createEmail} 
                onChange={(event) => setCreateEmail(event.currentTarget.value)} 
            />
            <TextInput 
                label="Password"
                value={createPassword}
                onChange={(event) => setCreatePassword(event.currentTarget.value)}
            />
            
            <Button onClick={() => createEPAccount(createEmail, createPassword)}>Create Account</Button>
        </Modal>
        <Center>
            {user ? 
                username ? 
                        <Affix position={{ bottom: rem(20), right: rem('46.5%') }}>
                            <Button color="gray" onClick={() => {
                                auth.signOut();
                                setPomoSeconds(3000);
                                setBreakSeconds(600);
                            }}
                            >Sign Out</Button>
                        </Affix>
                        : 
                        <UsernameForm />
                    :
                    <>
                    <Stack align="center">
                        <Card>
                            <TextInput 
                                label="Email"
                                value={signInEmail}
                                onChange={(event) => setSignInEmail(event.currentTarget.value)}
                            />
                            <TextInput 
                                label="Password"
                                value={signInPassword}
                                onChange={(event) => setSignInPassword(event.currentTarget.value)}
                            />
                            <Button 
                                onClick={() => signInWithEP(signInEmail, signInPassword)}
                                color="teal"
                                variant="filled"
                            >Sign In</Button>
                            <Button 
                                onClick={open}
                                color="teal"
                                variant="filled"
                            >Create Account</Button>
                        </Card>
                        <Divider my="md" label="or" labelPosition="center" />
                        <Button 
                            variant="filled" 
                            color="teal" 
                            onClick={signInWithGoogle}
                            leftIcon={<BrandGoogle size={20} strokeWidth={2.5} color={"white"}/>}
                        >Sign In with Google</Button>
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