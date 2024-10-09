import { useState, useEffect } from "react"

export const useMediaQuery = () => {
    const [screenSize, getDimension] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    const setDimension = () => {
        getDimension({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

    useEffect(()=> {
        window.addEventListener("resize", setDimension)
        return(()=> window.removeEventListener("resize", setDimension))
    }, [screenSize])
    return screenSize
}