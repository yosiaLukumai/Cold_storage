import "./../../App.scss"
import { useEffect, useState } from "react"
import { Box, Text, Table, TableContainer, Tr, Td, Tfoot, Tbody, Thead, Th, TableCaption, Center, Tabs, TabList, Tab } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import { MainUrl } from "../../../variables"
import { Spinner } from '@chakra-ui/react'
import { retriveData } from "../../utils/localStorage"
import TableParameter from "./../../components/tableParameter"
import TableParametersBox from "../../components/tableParameterBox"
export const History = () => {
    const { parameter, workingfridge } = useParams()
    const [loading, setLoading] = useState(parameter == "size" ? false : true)

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
                console.log(result?.body);
            }
            setLoading(false);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        let url = `${MainUrl}fridge/data/specific/${parameter}/${workingfridge}/${retriveData("ColdStorage")._id}`
        console.log(url);
        
        fetchData(url)
        
    }, [])

    return (
        <>
            <Box px="0.7rem" mx="auto">
                <Box mx="auto" pt="2rem" pb="1rem" width={{ base: '100%', sm: '80%', md: '70%' }}>
                    <Text fontWeight="bold" fontSize="1.7rem" color="#023047"> {parameter} Logs.</Text>
                </Box>
                {
                    ((parameter == "roomtemp" || parameter == "roomhum" || parameter =="fridgeMax"  || parameter == "fridgeMin") && !loading) ? <TableParameter data={data} parameter={parameter} /> : <Center sx={{ my: 20 }}><Spinner size='xl' /></Center>
                }
            </Box>

        </>
    )
}