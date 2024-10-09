import "./../../App.scss"
import { useMediaQuery } from "./../../Hooks/mediaQuery"
import { useEffect, useRef, useState } from "react"
import { retriveData } from "../../utils/localStorage"
import { Card, CardBody, Heading, Text, Image, Icon, Stack, Center, Tabs, Tab, TabList, useToast } from "@chakra-ui/react";
import { Box, SimpleGrid } from "@chakra-ui/react"
import { MainUrl } from "../../../variables"
import { Spinner } from '@chakra-ui/react'
import { Select } from 'chakra-react-select';
export const AllImages = () => {
    let screenSize = useMediaQuery()
    let [imagesArray, setImagesArray] = useState(null);
    let [imageReady, setImagesReady] = useState(true);
    const [workingFridge, setworkingFridge] = useState(null)
    const toast = useToast()
    let [loading, setLoading] = useState(true)
    const [optionss, setoptionns] = useState(null)
    const [count, setcount] = useState(0)

    async function fetchImages(url) {
        try {
            setLoading(true)
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
                setImagesArray(result.body.images)
                setImagesReady(true)
                setLoading(false)
                if(result.body.images?.length <= 0) {
                    toast({
                        title: " Sorry no image saved yet",
                        status: 'warning',
                        position: "top",
                        duration: 2500,
                        isClosable: true,
                    })
                }
            } else {
                setImagesReady(true);
                toast({
                    title: result?.body,
                    status: 'warning',
                    position: "top",
                    duration: 2500,
                    isClosable: true,
                })
            }
        } catch (error) {
            setLoading(true)
        }

    }

    const fethOptions = async () => {
        try {
            setoptionns(null);
            const response = await fetch(`${MainUrl}fridge/options`);
            const result = await response.json();
            if (result.success) {
                setoptionns(result.body?.fridges)
                setworkingFridge(result?.body?.fridges[0]?.label)
                setcount(result.body?.count)
            } else {
                toast({
                    title: 'failed to load fridge options.',
                    status: 'warning',
                    position: "top",
                    duration: 2500,
                    isClosable: true,
                })
            }
        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                position: "top",
                duration: 2500,
                isClosable: true,
            })
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleChangeData = async (data) => {
        if (data?.label != workingFridge) {
            setworkingFridge(data?.label)
        }
    }

    useEffect(() => {
        fethOptions()
    }, [])


    useEffect(() => {
        let url = `${MainUrl}data/images/${workingFridge}`;
        if (workingFridge) {
            fetchImages(url);
        }
    }, [workingFridge])
    
    return (
        <>


            {
                imageReady &&
                <Box  py="1rem" mx={"auto"} width={{ base: '100%', sm: '80%', md: '60%' }} px={screenSize.width < 600 ? 2 : 0}>
                    <Box py={1}>
                        <Box className="" display={screenSize.width < 600 ? "block" : "flex"} py={6} pt={screenSize?.width < 600 ? 2 : 0} justifyContent={"space-between"} alignItems={"center"} justifyItems={"center"}>
                            <Select onChange={(e) => handleChangeData(e)} value={{ value: workingFridge, label: workingFridge }} className="" size={'md'} options={optionss} placeholder='Select fridge Id' />
                            <Text display={"flex"} fontSize='2xl' fontWeight={"400"}>Fridge Count:  <Text pl={"0.5rem"} color={"#8338ec"}>{count}</Text></Text>
                        </Box>
                    </Box>
                    <Text color="#023047" py="1.1rem" textDecoration="underline" fontWeight="bold" fontSize="1.5rem" >Captured Pictures.</Text>
                    {
                        !loading ? <Box>
                            <SimpleGrid
                                backgroundColor=""
                                columns={{ sm: 2, md: 3 }}
                                spacing='10'
                                px={screenSize.width < 600 ? '2' : '0'}
                                color='inherit'
                            >
                                {imagesArray?.map((img, index) => (
                                    <Box key={index}>
                                        <Card maxW='sm' mt="0rem" shadow="2xl">
                                            <CardBody>
                                                <Image
                                                    src={`${MainUrl}${img?.imgPath}`}
                                                    height="60%"
                                                    alt='Captured. pictures'
                                                    borderRadius='lg'
                                                />
                                                <Stack mt='2' spacing='3'>
                                                    <Heading color="#023047" size='md'>Date: {img?.createdAt?.slice(0, 10)}</Heading>
                                                    <Heading color="#023047" size='md'> Time: {img?.createdAt?.slice(11, 16)}  Hrs </Heading>
                                                </Stack>
                                            </CardBody>
                                        </Card>
                                    </Box>
                                ))}
                            </SimpleGrid>

                        </Box> : <Center sx={{ my: 20 }}><Spinner size='xl' /></Center>
                    }
                </Box>
            }

        </>
    )
}