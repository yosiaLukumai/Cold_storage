import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { MdOutlineSevereCold } from "react-icons/md";
import "./../App.scss"
import { useMediaQuery } from "./../Hooks/mediaQuery"
import { retriveData, save } from "../utils/localStorage"
import { IoLogInOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { Box, Flex, Heading, Spacer, Icon } from "@chakra-ui/react"
export const DashBoard = () => {
    let screenSize = useMediaQuery()
    const navigator = useNavigate()

    const navigateTo = (path) => {
        navigator(`/auth/${retriveData("ColdStorage")?._id}/${path}`)
    }

    const logout = () => {
        console.log("logging out");
        save("ColdStorage", null);

        navigator("/", { replace: true });

    }
    return (
        <>
            <Box background="white" height="100vh">
                <Box backgroundColor="#683ab7">
                    <Box py="0.7rem" px="0.7rem" mx="auto" width={{ base: '100%', sm: '80%', md: '60%' }}>
                        <Flex minWidth='max-content' alignItems='center' gap='2'>
                            <Box p='2' cursor="pointer" onClick={() => navigateTo("")}>
                                <Heading size='lg' color="white" display="flex" gap="2"> <MdOutlineSevereCold color="white" /> GeneBank </Heading>
                            </Box>
                            <Spacer />
                            <Icon color="white" cursor="pointer" ml="0.2rem" onClick={() => navigateTo("add")} boxSize="1.6rem" as={IoMdAddCircle} />
                            <Icon color="white" cursor="pointer" ml="0.2rem" onClick={() => navigateTo("image")} boxSize="1.5rem" as={IoMdAnalytics} />
                            <Icon color="white" cursor="pointer" onClick={() => navigateTo("info")} boxSize="1.5rem" as={FaInfoCircle} />
                            <Icon color="white" cursor="pointer" ml="0.7rem" boxSize="1.9rem" as={IoLogInOutline} onClick={() => logout()} />
                        </Flex>
                    </Box>
                </Box>
                <Box>
                    <Outlet />
                </Box>
            </Box>
        </>
    )
}
