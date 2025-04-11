import "./../../App.scss"
import { useEffect, useState } from "react"
import { Box, Text, Table, TableContainer, Tr, Td, Tfoot, Tbody, Thead, Th, TableCaption, Center, Tabs, TabList, Tab, Button, useToast, Flex, Select, Input, useMediaQuery } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import { MainUrl } from "../../../variables"
import { Spinner } from '@chakra-ui/react'
import { retriveData } from "../../utils/localStorage"
import TableParameter from "./../../components/tableParameter"
export const History = () => {
    const { parameter, workingfridge } = useParams()
    const [loading, setLoading] = useState(parameter == "size" ? false : true)
    const toast = useToast()
    const [filterOption, setFilterOption] = useState("week");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    const [data, setData] = useState(null)
    const [error, setError] = useState("")
    const fetchData = async (url) => {
        try {
            setLoading(true);
            const response = await fetch(url);
            const result = await response.json();
            console.log(result);

            if (result.success) {
                setData(result?.body);
            }
            setLoading(false);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    const handleExport = async () => {
        const downloadLogs = async () => {
            try {
                const response = await fetch(`${MainUrl}fridge/export/${parameter}/${workingfridge}/${filterOption}/export-all?startDate=${startDate}&endDate=${endDate}`);
                if (!response.ok) {
                    const errorText = await response.text() ; 
                    throw new Error(errorText || "Failed to fetch data");
                }
                if(response.status == 404) {
                    console.log(response);
                    
                    return toast({
                        title: response.status,
                        status: 'error',
                        position: "top",
                        duration: 2500,
                        isClosable: true,
                    })  
                }

                const blob = await response.blob(); // Get file data as a blob
                // Create a URL for the blob
                const url = window.URL.createObjectURL(blob);

                // Create a link element to trigger the download
                const link = document.createElement("a");
                link.href = url;

                // Set the download attribute with a filename
                link.download = `logdata${parameter}-${workingfridge}-${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "numeric" })}.pdf`; // Replace with appropriate filename

                // Append the link to the document, click it, and remove it
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up the blob URL
                window.URL.revokeObjectURL(url);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error?.message || "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
            };
        };

        await downloadLogs();
    };




    useEffect(() => {
        let url = `${MainUrl}fridge/data/specific/${parameter}/${workingfridge}/${retriveData("ColdStorage")._id}`
        fetchData(url)

    }, [])

    return (
        <>
            <Box px="0.7rem" mx="auto">

                {/* <Box mx="auto" pt="2rem" flex={1} pb="1rem" width={{ base: '100%', sm: '80%', md: '70%' }} display="flex" justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold" fontSize="1.7rem" color="#023047">
                        {parameter} Logs.
                    </Text>
                    <Button bg={"#683ab7"} _hover={{ textColor: "#3a86fe" }} onClick={() => handleExport()} textColor={"white"}>Export Data</Button>


                    <Flex justifyContent="space-between" alignItems="center">
                        <Flex alignItems="center">
                            <Select value={filterOption} onChange={handleFilterChange} mr="4">
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                                <option value="range">Time Range</option>
                            </Select>

                            {filterOption === "range" && (
                                <>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        mr="2"
                                    />
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </>
                            )}
                        </Flex>
                    </Flex>
                </Box> */}

                <Box
                    mx="auto"
                    pt="2rem"
                    flex={1}
                    pb="1rem"
                    width={{ base: "100%", sm: "80%", md: "70%" }}
                >
                    <Flex justifyContent="space-between" alignItems="center" flexDirection="column">
                        <Flex justifyContent="space-between" alignItems="center" width="100%">
                            <Text fontWeight="bold" fontSize="1.7rem" color="#023047">
                                {parameter} Logs.
                            </Text>
                            <Button
                                bg={"#683ab7"}
                                _hover={{ textColor: "#3a86fe" }}
                                onClick={() => handleExport()}
                                textColor={"white"}
                            >
                                Export Data
                            </Button>
                        </Flex>

                        <Flex
                            alignItems="flex-start"
                            justifyContent="flex-end"
                            marginTop="1rem"
                            width={isMobile ? "100%" : "50%"}
                            flexDirection={isMobile && filterOption === "range" ? "column" : "row"}
                            alignSelf="flex-end" // Ensure it's at the end
                        >
                            <Select
                                value={filterOption}
                                onChange={handleFilterChange}
                                mr={isMobile && filterOption !== "range" ? "4" : "0"}
                                mb={isMobile && filterOption === "range" ? "2" : "0"}
                                width={isMobile ? "100%" : "auto"}
                            >
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                                <option value="range">Time Range</option>
                            </Select>

                            {filterOption === "range" && (
                                <>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        mr={isMobile ? "0" : "2"}
                                        mb={isMobile ? "2" : "0"}
                                        width={isMobile ? "100%" : "auto"}
                                    />
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        width={isMobile ? "100%" : "auto"}
                                    />
                                </>
                            )}
                        </Flex>
                    </Flex>
                </Box>

                {
                    ((parameter == "roomtemp" || parameter == "roomhum" || parameter == "fridgeMax" || parameter == "fridgeMin") && !loading) ? <TableParameter data={data} parameter={parameter} /> : <Center sx={{ my: 20 }}><Spinner size='xl' /></Center>
                }
            </Box>

        </>
    )
}