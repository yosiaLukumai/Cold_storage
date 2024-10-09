import React, { useState } from 'react'
import { RiFridgeFill } from "react-icons/ri";
import { retriveData } from '../../utils/localStorage';
import { Box, Button, Icon, Input, Stack, Text } from '@chakra-ui/react';
import { MainUrl } from '../../../variables';
import { useToast } from '@chakra-ui/react'

export default function AddFridge() {
    const [user, changeUser] = useState(retriveData("ColdStorage"))
    const [fridgeID, setfridgeID] = useState("")
    const [fridgeSize, setFridgeSize] = useState("")
    const [loadingR, setLoadingR] = useState(false)
    const toast = useToast()
    

    const handleAddFridge = async () => {
        try {
            setLoadingR(true);
            if (fridgeID.trim() != "" && fridgeSize.trim() != "") {
                const result = await fetch(`${MainUrl}fridge/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user?._id,
                        fridgeID,
                        fridgeSize,
                    }),
                    mode: "cors"
                })
                const response = await result.json();
                console.log(response);
                
                // console.log(response);
                if (response.success) {
                    // console.log(response);
                    toast({
                        title: 'Successful added the fridge.',
                        status: 'success',
                        position: "top",
                        duration: 2500,
                        isClosable: true,
                    })
                } else {
                    toast({
                        title: 'Failed to add fridge.',
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
        } catch (error) {
            console.log(error);
            setLoadingR(false)
        }
    }


    return (
        <>
            <div className="buy">
                <div className="dashIcon" style={{ padding: "0.7rem 0" }}>
                    <Icon color="#023047" ml="0.7rem" className='' boxSize="5.4rem" as={RiFridgeFill} />
                </div>
                <div className='' style={{ paddingTop: "0.7rem 0", textAlign: "center", fontSize: "1.5rem", fontWeight: "bolder", color: "#023047" }}>
                    Add Your fridge
                </div>
                <Box justifyContent={"center"} display={"flex"} my={10} alignItems={"center"}>
                    <Box width={{ base: '90%', sm: '80%', md: '35%' }}>
                        <Stack
                            alignItems="center"
                            mx="auto"
                            my="0"
                            spacing={4}
                            width={{ base: '100%', sm: '80%', md: '70%' }}
                        >
                            <Input borderColor={"#023047"} value={fridgeID} onChange={e => setfridgeID(e.target.value)} variant='outline' placeholder='FridgeId' color="#023047" fontWeight="light" _placeholder={{ opacity: 1, color: '#023047' }} />
                            <Input borderColor={"#023047"} value={fridgeSize} onChange={e => setFridgeSize(e.target.value)} variant='outline' color="#023047" fontWeight="light" placeholder='Fridge Size' _placeholder={{ opacity: 1, color: '#023047' }} />
                        </Stack>
                        <Box width={{ base: '100%', sm: '80%', md: '70%' }} mx='auto' mt="1.3rem">
                            <Button color={"#023047"} backgroundColor={'#fb8500'} fontWeight={"bold"} width={"100%"} my="0rem" px="6rem" colorScheme='yellow' onClick={handleAddFridge} isLoading={loadingR}>Add Fridge</Button>
                        </Box>
                    </Box>
                </Box>
            </div>
        </>
    )
}
