import { UserContext } from "@/lib/context";
import { auth, googleAuthProvider, getSessionData } from "../lib/firebase";
import { BarChart } from "@/components/bar_chart";
import { UsernameForm } from "@/components/username_form";
import { createDailyDoc, signInWithEP } from "@/lib/hooks";

import { useContext, useState, useEffect } from "react";
import { Center, Button, Affix, Stack, LoadingOverlay, Box, Space, TextInput, PasswordInput, Divider, Paper, Title, Text, rem, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BrandGoogle, Mail, Lock } from "tabler-icons-react";
import { AccountCreationModal } from "@/components/account_creation_modal";


export default function Login() {

    const { user, username } = useContext(UserContext);

    return (
        <>
            {user ? username ? <><Graph /><SignOutButton /></> : <UsernameForm /> : <SignIn />}
        </>
    )
}


//sign in and account creation component
function SignIn() {

    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    const [modalOpened, {open, close}] = useDisclosure(false);

    const signInWithGoogle = async () => {
        let signedIn = true;
        await auth.signInWithPopup(googleAuthProvider)
            .catch(e => {
                console.error("Error signing in: ", e); 
                signedIn = false;
            });

        if(signedIn) {
            createDailyDoc();
        }
    }

    return (
        <>
        <AccountCreationModal opened={modalOpened} close={close}/>

        <Title align="center">Welcome!</Title>
        <Space h="sm" />
        <Text align="center">Sign in or create an account if you don't have one!</Text>

        <Space h="xl" />

        <Center>
        <Paper withBorder shadow="md" p="lg" radius="md" w={rem(650)}>
        <Stack align="center">
            <Stack spacing="sm" align="center">
                <TextInput 
                    label="Email"
                    value={signInEmail}
                    onChange={(event) => setSignInEmail(event.currentTarget.value)}
                    icon={<Mail size={20}/>}
                    w={rem(400)}
                />
                <PasswordInput 
                    label="Password"
                    value={signInPassword}
                    onChange={(event) => setSignInPassword(event.currentTarget.value)}
                    icon={<Lock size={20}/>}
                    w={rem(400)}
                />
                <Space h="xs" />
                <Button 
                    onClick={() => signInWithEP(signInEmail, signInPassword)}
                    color="teal"
                    variant="filled"
                    w={rem(200)}
                >Sign In</Button>
                <Button 
                    onClick={open}
                    color="teal"
                    variant="subtle"
                    size="xs"
                    w={rem(200)}
                >Create Account</Button>
            </Stack>

            <Divider my="md" label="or" labelPosition="center" w={rem(600)}/>

            <Stack w={rem(200)}>
                <Button 
                    variant="filled" 
                    color="teal" 
                    onClick={signInWithGoogle}
                    leftIcon={<BrandGoogle size={20} strokeWidth={2.5} color={"white"}/>}
                >Sign In with Google</Button>
            </Stack>
        </Stack>
        </Paper>
        </Center>
        </>
    )
}


function SignOutButton() {

    const { setPomoSeconds, setBreakSeconds } = useContext(UserContext);

    return (
        <Affix position={{ bottom: rem(20), right: rem('46.5%') }}>
            <Button color="gray" onClick={() => {
                auth.signOut();
                setPomoSeconds(3000);
                setBreakSeconds(600);
            }}
            >Sign Out</Button>
        </Affix>
    )
}


//graph component
function Graph() {

    const { user } = useContext(UserContext);
    const { colorScheme } = useMantineColorScheme();

    const [graphAmount, setGraphAmount] = useState(7);
    const [graphIsLoading, setGraphIsLoading] = useState(false);
    const [graphData, setGraphData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ["#12b886"], 
        }],
    });

    const [weekBtnVariant, setWeekBtnVariant] = useState("filled");
    const [monthBtnVariant, setMonthButtonVariant] = useState("outline");


    //populate graph with user's data
    const retrieveWeekData = async () => {
        setGraphIsLoading(true);

        let graphData = await getSessionData(graphAmount);

        let dateLabels = [];
        let dateValues = [];

        for(const [key, value] of Object.entries(graphData)) {
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

    //retrieve new set of data upon switching between week/month
    useEffect(() => {
        if(user) {
            retrieveWeekData();
        }
    }, [graphAmount]);


    return (
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
    )
}