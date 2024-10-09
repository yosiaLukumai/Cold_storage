import { Box } from '@chakra-ui/react'
import React from 'react'

export default function Loaders() {
    return (
        <Box display={"flex"} height={"92vh"} justifyContent={"center"} alignContent={"center"} alignItems={"center"}>
            <div className="loading-wave">
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
            </div>
        </Box>

    )
}