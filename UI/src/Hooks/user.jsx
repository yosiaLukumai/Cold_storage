import { useState, useEffect } from "react"
import { retriveData } from "./../utils/localStorage"

export const useUser = () => {
    const [user, getUser] = useState({
        user: retriveData("userE")
    })
    useEffect(() => {
        getUser({
            user: retriveData("userE")
        })
    }, [user])
    return user;
}