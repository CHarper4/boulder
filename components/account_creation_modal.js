import { useState, useEffect } from "react";
import { Modal, TextInput, Button } from "@mantine/core";
import { createEPAccount } from "@/lib/hooks";
import { Mail, Lock, Eye, EyeOff } from "tabler-icons-react";

export function AccountCreationModal({ opened, close }) {

    const [createEmail, setCreateEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');

    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    const [passwordType, setPasswordType] = useState("password");
    
    //input validation
    const checkEmail = (email) => {
        const regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if(!regex.test(email)) {
            setIsValidEmail(false);
        } else {
            setIsValidEmail(true);
        }
    }

    const checkPassword = (password) => {
        //const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]).{6,32}$/;    //a digit, lowercase and uppercase letter, special character, 6-32 length 
        if(password.length < 6 || password.length > 32) {
            setIsValidPassword(false);
        } else {
            setIsValidPassword(true);
        }
    }

    useEffect(() => {
        checkEmail(createEmail);
    }, [createEmail])

    
    useEffect(() => {
        checkPassword(createPassword);
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
            <TextInput 
                label="Password"
                type={passwordType}
                value={createPassword}
                onChange={(event) => setCreatePassword(event.currentTarget.value)}
                icon={<Lock size={20} />}
                rightSection={ passwordType == "password" ? <Eye size={20} onClick={() => setPasswordType("text")}/> : <EyeOff size={20} onClick={() => setPasswordType("password")}/>}
            />
            
            <Button 
                disabled={!(isValidEmail && isValidPassword)}
                onClick={() => createEPAccount(createEmail, createPassword)}
                color="teal"
            >Create Account</Button>
        </Modal>
        </>
    )
}