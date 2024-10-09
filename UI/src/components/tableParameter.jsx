import { Table, Thead, Tbody, Box, Tr, Th, Td,Text, Spinner, Flex } from "@chakra-ui/react"
import { useMediaQuery } from "../Hooks/mediaQuery"
const TableParameters = ({ data, parameter }) => {
    const screenSize = useMediaQuery();
    return (
        <>
            {data ?
                <Table px="0.7rem" mx="auto" pt="2rem" width={{ base: '100%', sm: '80%', md: '70%' }} color={"#003049"} variant='striped' shadow="dark-lg"  size="md">
                    <Thead fontSize="0.4rem">
                        <Tr backgroundColor="#3a86ff">
                            <Th fontSize={screenSize.width < 600 ? '0.9rem' : '1.2rem'} fontWeight="bold" color="white">Date</Th>
                            <Th fontSize={screenSize.width < 600 ? '0.9rem' : '1.2rem'} fontWeight="bold" color="white">Time (Hrs)</Th>
                            <Th fontSize={screenSize.width < 600 ? '0.9rem' : '1.2rem'} fontWeight="bold" color="white">Value {parameter == 'roomhum' ? '%' : 'C'}</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {data?.map((item, index) => (
                            <Tr py="1rem" key={index}>
                                <Td fontWeight="bold">{(item?.createdAt)?.slice(0, 10)}</Td>
                                <Td fontWeight="bold">{(item?.createdAt)?.slice(11, 16)}</Td>
                                <Td color="#fb8500" fontWeight="bold">{(item?.roomtemp)?.toFixed(2) || (item?.roomhum)?.toFixed(2) || (item?.fridgeMax)?.toFixed(2) || item?.fridgeMin}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                :
                <Flex
                    height="50vh"
                    justifyContent="center"
                    alignItems="center"
                >

                    <Spinner
                        thickness='2px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='pink.500'
                        size='xl'
                    />
                </Flex>


            }

            <Box mb="1.2rem">
                <Text display="none">spacer</Text>
            </Box>



        </>
    )
}

export default TableParameters