import { Table, Thead, Tbody, Box, Tr, Th, Td, Text, Spinner, Flex, VStack, Tag, TagLabel, TagLeftIcon, HStack, TableContainer } from "@chakra-ui/react"
import { useMediaQuery } from "../Hooks/mediaQuery"
import { SiGraphql } from "react-icons/si";
import { AiOutlineColumnHeight } from "react-icons/ai"; // Height
import { BsTextareaResize } from "react-icons/bs";
// import { FaSquareLetterboxd } from "react-icons/fa6";
// import { FaSquareLetterboxd } from "react-icons/fa6";

const TableParametersBox = ({ data }) => {
    const screenSize = useMediaQuery();
    return (
        <>
            {data ?
                <TableContainer  mx="auto"  width={{ base: '100%', sm: '80%', md: '70%' }}  shadow="dark-lg" >
                    <Table  variant='striped' colorScheme="teal" size="md">
                        <Thead fontSize="0.4rem">
                            <Tr backgroundColor="#023047">
                                <Th fontSize={screenSize.width < 600 ? '0.9rem' : '1.2rem'} fontWeight="bold" color="white">Date</Th>
                                <Th fontSize={screenSize.width < 600 ? '0.9rem' : '1.2rem'} fontWeight="bold" color="white">Average Size</Th>
                                <Th fontSize={screenSize.width < 600 ? '0.9rem' : '1.2rem'} fontWeight="bold" color="white">Rectangles</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {data?.map((item, index) => (
                                <Tr py="1rem" key={index}>
                                    <Td fontWeight="bold">{(item?.createdAt)?.slice(0, 10)}</Td>
                                    <Td fontWeight="bold">{(item?.average)}</Td>
                                    <Td color="#fb8500" fontWeight="bold">
                                        <VStack>
                                            {item?.rectangles.map((val, inde) => (
                                                <HStack key={inde}>
                                                    <Tag size="sm" colorScheme='cyan' borderRadius='full' >
                                                        <TagLabel fontSize={"1.2rem"} fontWeight={"400"}> Area {val?.area}</TagLabel>
                                                    </Tag>
                                                    <Tag size="sm" colorScheme='green' borderRadius='full' >
                                                        <TagLabel fontSize={"1.2rem"} fontWeight={"400"}> Height {val?.height} Width:{val?.width} </TagLabel>
                                                    </Tag>
                                                    <Tag size="sm" colorScheme='gray' borderRadius='full' >
                                                        <TagLabel fontSize={"1.2rem"} fontWeight={"400"}> X:{val?.x}-Y:{val?.y}-</TagLabel>
                                                    </Tag>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>

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

export default TableParametersBox