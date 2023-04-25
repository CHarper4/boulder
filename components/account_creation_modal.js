import { useState, useEffect } from "react";
import { Modal, TextInput, Flex, PasswordInput, Button, Space, List, Text, Stack } from "@mantine/core";
import { Mail, Lock, Check, X } from "tabler-icons-react";

import { createEPAccount } from "@/lib/hooks";

export function AccountCreationModal({ opened, close }) {

    const [createEmail, setCreateEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');

    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);

    const [requirements, setRequirements] = useState({lower: false, upper: false, digit: false, special: false, length: false});
    

    //validate email on change
    useEffect(() => {
        const regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        setValidEmail(regex.test(createEmail));
    }, [createEmail])

    
    //validate password on change
    useEffect(() => {
        let lower = /[a-z]/.test(createPassword);
        let upper = /[A-Z]/.test(createPassword); 
        let digit = /\d/.test(createPassword);
        let special = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(createPassword);
        let length = createPassword.length >= 6 && createPassword.length <= 32;

        setValidPassword(digit && lower && upper && special && length);
        setRequirements({lower, upper, digit, special, length});
    }, [createPassword]);


    return (
        <>
        <Modal opened={opened} onClose={close} title="Create an account">
            <TextInput 
                label="Email" 
                value={createEmail}
                onChange={(event) => setCreateEmail(event.currentTarget.value)}
                icon={<Mail size={20}/>}
            />
            <Space h="xs" />
            <PasswordInput 
                label="Password"
                value={createPassword}
                onChange={(event) => setCreatePassword(event.currentTarget.value)}
                icon={<Lock size={20} />}
            />
            <Space h="xl"/>
            <Flex justify="center"> 
                <Button 
                    disabled={!(validEmail && validPassword)}
                    onClick={() => createEPAccount(createEmail, createPassword)}
                    color="teal"
                >Create Account</Button>
            </Flex>
            <Space h="xl"></Space>
            <Stack align="center">
                <Text>Password Requirements</Text>
                <List icon={<X color="red" ></X>}>
                    <List.Item icon={requirements.lower && <Check color="green"></Check>}>lowercase letter</List.Item>
                    <List.Item icon={requirements.upper && <Check color="green"></Check>}>uppercase letter</List.Item>
                    <List.Item icon={requirements.digit && <Check color="green"></Check>}>digit</List.Item>
                    <List.Item icon={requirements.special && <Check color="green"></Check>}>special character</List.Item>
                    <List.Item icon={requirements.length && <Check color="green"></Check>}>6-32 characters</List.Item>
                </List>
            </Stack>
        </Modal>
        </>
    )
}

