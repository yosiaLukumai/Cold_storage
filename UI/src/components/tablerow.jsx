import { Tr } from "@chakra-ui/react"
export default tableRow = ({ timestamp, value }) => {
    return (
        <>
            <Tr>
                <Td>{timestamp}</Td>
                <Td isNumeric>{value}</Td>
            </Tr>
        </>
    )
} 