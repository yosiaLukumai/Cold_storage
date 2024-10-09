import { useNavigate } from "react-router-dom"
import { useMediaQuery } from "./../../Hooks/mediaQuery"
import { retriveData } from "../../utils/localStorage"
import { Chart } from "react-google-charts"
import { MainUrl } from "../../../variables"
import { MdOutlineRoomPreferences } from "react-icons/md";
import { RiFridgeFill } from "react-icons/ri";
import "../../../src/App.scss"
import { WiHumidity } from "react-icons/wi";
import { FaTemperatureHigh } from "react-icons/fa";
import { FaTemperatureLow } from "react-icons/fa";
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { LiaTemperatureLowSolid } from "react-icons/lia";
import { IoMdResize } from "react-icons/io";
import { Box, SimpleGrid, Icon, Text, useToast, Flex } from "@chakra-ui/react"
import { Grid, GridItem } from '@chakra-ui/react'
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { Select } from 'chakra-react-select';
import Loaders from "./loader"


export const Dash = () => {
    let screenSize = useMediaQuery()
    let [data, setData] = useState(null)
    let [graphData, setGraphData] = useState(null)
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState("")
    const navigator = useNavigate()
    const toast = useToast()
    const [optionss, setoptionns] = useState(null)
    const [workingFridge, setworkingFridge] = useState(null)
    const [kpiData, setKPIData] = useState(null)
    const [fridgeData, setfridgeData] = useState(null)
    const [count, setcount] = useState(0)
    const [roomData, setRoomData] = useState(null)


    const options = {
        title: "Fridge Max  & Fridge Min",
        titleTextStyle: {
            fontSize: 20
        },
        legend: { position: "bottom" },
    };
    const option2 = {
        title: "Room Temp & Humidity",
        titleTextStyle: {
            fontSize: 20
        },
        legend: { position: "bottom" },
    };

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
        if(data?.label != workingFridge) {
            console.log("refetch....");
            setworkingFridge(data?.label)
        }
    }

 


    useEffect(() => {
        let socket = io(MainUrl)
        socket.on("connect", () => {
            console.log("connected... successfull, id: ", socket.id);
        })
        socket.on("newData", (data) => {
            if (retriveData("ColdStorage")._id == data.userId) {
                setData(data)
                setGraphData((prevData) => {
                    if (prevData) {
                        setGraphData([prevData[0], ...prevData?.slice(2), [data?.createdAt?.slice(11, 16), data?.temp, data?.hum, data?.size]])
                    }
                })
            }
        })
    }, [])

    useEffect(() => {
        fethOptions();
    }, [])

    useEffect(() => {
        const FetchDashData = async () => {
            try {
                setfridgeData(null);
                setKPIData(null)
                const response = await fetch(`${MainUrl}fridge/fridges/${workingFridge}`);
                const result = await response.json();
                if (result.success) {
                    setKPIData(result.body?.kpi)
                    if (result?.body?.lastFiveLogs?.length >= 2) {
                        let myDataa = result?.body?.lastFiveLogs
                        let roomTemHum = [["Time", "roomtemp", "roomhum"]]
                        let fridgeDatas = [["Time", "fridgeMin", "fridgeMax"]]
                        myDataa.map(element => {
                            roomTemHum.push([element?.createdAt.slice(11, 16), element?.roomtemp, element?.roomhum])
                            fridgeDatas.push([element?.createdAt.slice(11, 16), element?.fridgeMin, element?.fridgeMax])
                        })
                        setfridgeData(fridgeDatas)
                        setRoomData(roomTemHum)
                    }
                } else {
                    toast({
                        title: result?.body,
                        status: 'warning',
                        position: "top",
                        duration: 2500,
                        isClosable: true,
                    })
                }
                // Set the fetched data to the state
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
        if (workingFridge) {
            FetchDashData()
        }
    }, [workingFridge])

    const navigateTo = (path) => {
        navigator(`/auth/${retriveData("ColdStorage")._id}/${path}`)
    }
    if (!optionss || !kpiData) return <Loaders />
    return (
        <>
            <Box px="0.7rem" mx="auto">
                <Box>
                    <Box mx="auto" pt="3rem" width={{ base: '100%', sm: '80%', md: '60%' }}>
                        <Box className="" display={screenSize.width < 600 ? "block" : "flex"} py={6} pt={screenSize?.width < 600 ? 2 : 0} justifyContent={"space-between"} alignItems={"center"} justifyItems={"center"}>
                            <Select onChange={(e) => handleChangeData(e)} value={ {value: workingFridge, label:workingFridge }} className="" size={'md'} options={optionss} placeholder='Select fridge Id' />
                            <Text display={"flex"} fontSize='2xl' fontWeight={"400"}>Fridge Count:  <Text pl={"0.5rem"} color={"#8338ec"}>{count}</Text></Text>
                        </Box>
                        <Box >
                            <SimpleGrid
                                backgroundColor=""
                                columns={{ sm: 2, md: 2 }}
                                spacing='3'
                                px={screenSize.width < 600 ? '2' : '0'}
                                color='inherit'
                            >
                                <Box boxShadow='2xl' cursor="pointer" py='5' display="flex" rounded='xl' bg='#3a86ff' onClick={() => navigateTo(`param/fridgeMax/${workingFridge}`)}>
                                    <Box px="0.5rem">
                                        <Icon color="#003049" ml="0.7rem" boxSize="3.4rem" as={LiaTemperatureHighSolid} />
                                    </Box>
                                    <Box pl="0.7rem">
                                        <Text color="#003049" fontSize={((screenSize.width > 539 && screenSize.width < 700) || (screenSize.width > 750 && screenSize.width < 1110)) ? '1.2rem' : '1.5rem'} fontWeight="bold">Max Temp</Text>
                                        <Text color="#fff" fontSize="1.3rem" fontWeight="bold">{Number(kpiData?.fridgeMax).toFixed(2)} C</Text>
                                    </Box>
                                </Box>
                                <Box boxShadow='2xl' cursor="pointer" py='5' display="flex" rounded='xl' bg='#3a86ff' onClick={() => navigateTo(`param/fridgeMin/${workingFridge}`)}>
                                    <Box px="0.5rem">
                                        <Icon color="#003049" ml="0.7rem" boxSize="3.4rem" as={LiaTemperatureLowSolid} />
                                    </Box>
                                    <Box pl="0.7rem">
                                        <Text color="#003049" fontSize={((screenSize.width > 539 && screenSize.width < 700) || (screenSize.width > 750 && screenSize.width < 1110)) ? '1.2rem' : '1.5rem'} fontWeight="bold">Min Temp</Text>
                                        <Text color="#fff" fontSize="1.3rem" fontWeight="bold">{Number(kpiData?.fridgeMin).toFixed(2)} C</Text>
                                    </Box>
                                </Box>
                                <Box boxShadow='2xl' cursor="pointer" py='5' display="flex" rounded='xl' bg='#3a86ff' onClick={() => navigateTo(`param/roomtemp/${workingFridge}`)}>
                                    <Box px="0.5rem">
                                        <Icon color="#003049" ml="0.7rem" boxSize="3.4rem" as={MdOutlineRoomPreferences} />
                                    </Box>
                                    <Box pl="0.7rem">
                                        <Text color="#003049" fontSize={((screenSize.width > 539 && screenSize.width < 700) || (screenSize.width > 750 && screenSize.width < 1110)) ? '1.2rem' : '1.5rem'} fontWeight="bold">Room Temp</Text>
                                        <Text color="#fff" fontSize="1.3rem" fontWeight="bold">{Number(kpiData?.roomtemp).toFixed(2)} C</Text>
                                    </Box>
                                </Box>
                                <Box boxShadow='2xl' cursor="pointer" py='5' display="flex" rounded='xl' bg='#3a86ff' onClick={() => navigateTo(`param/roomhum/${workingFridge}`)}>
                                    <Box px="0.5rem">
                                        <Icon color="#003049" ml="0.7rem" boxSize="3.4rem" as={WiHumidity} />
                                    </Box>
                                    <Box pl="0.7rem">
                                        <Text color="#003049" fontSize={((screenSize.width > 539 && screenSize.width < 700) || (screenSize.width > 750 && screenSize.width < 1110)) ? '1.2rem' : '1.5rem'} fontWeight="bold">Room Humidity</Text>
                                        <Text color="#fff" fontSize="1.3rem" fontWeight="bold">{Number(kpiData?.roomhum).toFixed(2)} %</Text>
                                    </Box>
                                </Box>
                            </SimpleGrid>
                        </Box>

                    </Box>
                    <Flex mx="auto" flexWrap="wrap" pt="2rem" width={{ base: '100%', sm: '80%', md: '60%' }} justify="space-between">
                        <Box width={{ base: "100%", md: "48%" }} marginBottom={{ base: "4", md: "0" }}>
                            {fridgeData &&
                                <Box shadow="dark-lg" my="1.7rem" mx="auto" >
                                    <Chart
                                        chartType="LineChart"
                                        width="100%"
                                        height="420px"
                                        data={fridgeData}
                                        options={options}
                                    />
                                </Box>
                            }
                        </Box> 
                        <Box width={{ base: "100%", md: "48%" }}>
                            {roomData &&
                                <Box shadow="dark-lg" my="1.7rem" mx="auto">
                                    <Chart
                                        chartType="LineChart"
                                        width="100%"
                                        height="420px"
                                        data={roomData}
                                        options={option2}
                                    />
                                </Box>
                            }
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </>
    )
}

