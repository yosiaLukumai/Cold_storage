import { Text, Box, Stack, Input, Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react'
import { MainUrl } from "../../variables"
import { retriveData, save } from "./../utils/localStorage"
const CardComponent = ({ onChildEvent }) => {
    const [stateChoose, setStateChosen] = useState("Login")
    const toast = useToast()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [deviceId, setDeviceId] = useState("");
    const [loading, setLoading] = useState(false)
    const [loadingR, setLoadingR] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        // check if all credential are provided 
        if (password.trim() != "" || email.trim() != "") {
            // a request can be sent to login
            console.log("Main Url", `${MainUrl}/user/login`);
            const result = await fetch(`${MainUrl}user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                }),
                mode: "cors"
            })
            const response = await result.json();
            if (response.success != false && response.body != null) {
                // a user is registered check the payload save the user to the 
                save("ColdStorage", response.body.user)
                onChildEvent(response.body.user)


            } else if (response.body == "Incorrect Password") {
                toast({
                    title: ' Incorrect Password',
                    status: 'info',
                    position: "top",
                    duration: 3000,
                    isClosable: true,

                })
            } else {
                toast({
                    title: ' No such user..',
                    status: 'error',
                    position: "top",
                    duration: 3000,
                    isClosable: true,

                })
            }
        } else {
            toast({
                title: 'Fill all the field.',
                status: 'warning',
                position: "top",
                duration: 4000,
                isClosable: true,

            })
        }
        setLoading(false)

    }


    const handleRegister = async () => {
        setLoadingR(true);
        if (email.trim() != "" && password.trim() != "") {
            const result = await fetch(`${MainUrl}user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                mode: "cors"
            })
            const response = await result.json();
            // console.log(response);
            if (response.success) {
                // console.log(response);
                toast({
                    title: 'Successful created the account.',
                    status: 'success',
                    position: "top",
                    duration: 2500,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Email | deviceId already taken.',
                    status: 'warning',
                    position: "top",
                    duration: 2500,
                    isClosable: true,
                })
            }
        } else {
            toast({
                title: 'Please fill all Field.',
                status: 'warning',
                position: "top",
                duration: 2500,
                isClosable: true,
            })
        }
        setLoadingR(false)
    }

    return (<>

        <Text fontWeight="bold" fontSize="1.6rem" align="center" color={"#023047"}> {stateChoose}</Text>
        <Box my="2rem">
            {
                stateChoose == "Login" ? (
                    <>
                        <Stack
                            alignItems="center"  // Center the items horizontally within the Stack
                            mx="auto"
                            my="0"
                            spacing={4}
                            width={{ base: '100%', sm: '80%', md: '70%' }}
                        >
                            <Input borderColor={"#023047"} value={email} onChange={e => setEmail(e.target.value)} variant='outline' placeholder='Email' color="#023047" fontWeight="light" _placeholder={{ opacity: 1, color: '#023047' }} />
                            <Input borderColor={"#023047"}  value={password} onChange={e => setPassword(e.target.value)} variant='outline' color="#023047" fontWeight="light" placeholder='Password' _placeholder={{ opacity: 1, color: '#023047' }} />
                        </Stack>

                        <Box width={{ base: '100%', sm: '80%', md: '70%' }} mx='auto' mt="1.3rem">
                            <Button  color={"#023047"}  backgroundColor={'#fb8500'} fontWeight={"bold"} width={"100%"}  my="0rem" onClick={() => handleLogin()} colorScheme='yellow' px="6rem" isLoading={loading}>Login</Button>
                        </Box>

                        <Box width={{ base: '100%', sm: '80%', md: '70%' }} mx="auto" my="0" pt="1.4rem" display="flex" flexDirection={"row"}>
                            <Text display={"inline-block"}> Don't have an account? </Text>
                            <Text onClick={() => setStateChosen("Sign Up")} fontSize="" paddingLeft={2} fontWeight="bold" color="#023047" cursor="pointer">Register</Text>
                        </Box>

                    </>


                ) : stateChoose == "Sign Up" && (
                    <>
                        <Stack
                            alignItems="center"  // Center the items horizontally within the Stack
                            mx="auto"
                            my="0"
                            spacing={4}
                            width={{ base: '100%', sm: '80%', md: '70%' }}
                        >
                            <Input borderColor={"#023047"} value={email} onChange={e => setEmail(e.target.value)} variant='outline' placeholder='Email' color="#023047" fontWeight="light" _placeholder={{ opacity: 1, color: '#023047' }} />
                            <Input borderColor={"#023047"} value={password} onChange={e => setPassword(e.target.value)} variant='outline' color="#023047" fontWeight="light" placeholder='Password' _placeholder={{ opacity: 1, color: '#023047' }} />
                        </Stack>

                        <Box width={{ base: '100%', sm: '80%', md: '70%' }} mx='auto' mt="1.3rem">
                            <Button color={"#023047"}  backgroundColor={'#fb8500'} fontWeight={"bold"}  width={"100%"} my="0rem" px="6rem" colorScheme='yellow' onClick={handleRegister} isLoading={loadingR}>Register</Button>
                        </Box>

                        <Box width={{ base: '100%', sm: '80%', md: '70%' }} mx="auto" my="0" pt="1.4rem" display="flex" flexDirection={"row"}>
                            <Text display={"inline-block"}> Have an account? </Text>
                            <Text onClick={() => setStateChosen("Login")} fontSize="" paddingLeft={2} fontWeight="bold" color="#023047" cursor="pointer">Login here</Text>
                        </Box>
                    </>

                )
            }

        </Box>




    </>)
}

export default CardComponent;