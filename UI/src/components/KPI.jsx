export default Kpi = ({ parameter, value, icon }) => {
    return (
        <>
            <Box boxShadow='2xl' py='5' display="flex" rounded='xl' bg='#8ecae6'>
                <Box px="0.5rem">
                    <Icon color="#023047" ml="0.7rem" boxSize="3.4rem" as={IoMdResize} />
                </Box>
                <Box pl="0.7rem">
                    <Text color="pink.900" fontSize={((screenSize.width > 539 && screenSize.width < 700) || (screenSize.width > 750 && screenSize.width < 1110)) ? '1.2rem' : '1.5rem'} fontWeight="bold">Size</Text>
                    <Text color="#fb8500" fontSize="1.3rem" fontWeight="bold">(23 * 23)</Text>
                </Box>
            </Box>
        </>
    )
}