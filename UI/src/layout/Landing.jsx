// import "./../App.sccs"
import "./../App.scss"
import { useState } from "react"
import { useMediaQuery } from "./../Hooks/mediaQuery"
import { useEffect } from "react"
import { Text, Box } from "@chakra-ui/react"
import { retriveData, save } from "../utils/localStorage"
import { Navigate } from "react-router-dom"
import { MainUrl } from "../../variables"
import GlassCard from "../components/GlassCard"
import Cardcomponet from "../components/card"
export const Landing = () => {
    let screenSize = useMediaQuery()
    const [user, setUser] = useState(retriveData("userEm"))

    const fetcher = async (url, payload) => {

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            const jsonResponse = await response.json();
            if (jsonResponse.success) {
                if (currentAction == "Sign in") {
                    // alert("u can now login ")
                    setDisable(false)
                    if (jsonResponse.success) {
                        save("userEm", jsonResponse.body.user)
                        setTimeout(() => {
                            console.log("setting user");
                            setUser(jsonResponse.body.user)
                        }, 300)

                        setDisable(false)
                    }
                } else {
                    setError("Account registered")
                    setDisable(false)
                }
            } else {
                setDisable(false)
                setError("Incorrect Login")
            }
        } catch (error) {
            setError("Failed to Connect")
            setDisable(false)
        }
    }

    const handleChildEvent = (message) => {
        // setMessageFromChild(message);
        // Trying to get the user from the local storage...
        if(message._id  ==  retriveData("ColdStorage")?._id) {
            setUser(message)
        }
      };

    // console.log(user, "-----");
    useEffect(() => {
        if(retriveData("ColdStorage")) {
            setUser(retriveData("ColdStorage"))
        }
    }, [])


    return (
        <>
            <div>
                {user ? (
                    <Navigate to={`/auth/${user._id}`}  />
                ) : <div>
                    <GlassCard>
                        <Cardcomponet onChildEvent={handleChildEvent} />
                    </GlassCard>
                </div>}
            </div>



        </>
    )
}