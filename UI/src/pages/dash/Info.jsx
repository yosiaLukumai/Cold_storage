import "./../../App.scss"
import { useState } from "react"
import { GiThermometerCold } from "react-icons/gi";
import { retriveData } from "../../utils/localStorage"
import { Icon } from "@chakra-ui/react";
export const Info = () => {
    const [user, changeUser] = useState(retriveData("ColdStorage"))
    
    return (
        <>
            <div className="buy">
                <div className="dashIcon" style={{ padding: "1rem 0" }}>

                    <Icon color="#023047" ml="0.7rem" boxSize="5.4rem" as={GiThermometerCold } />
                </div>
                <div style={{ paddingTop: "1.2rem 0", textAlign: "center", fontSize: "1.5rem", fontWeight: "bolder", color: "#2B1736ff" }}>
                    Your Account Info
                </div>
                <div style={{ paddingTop: "20px" }}></div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Fridge count</div>
                    <div className="col s6 namespec">0</div>
                </div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Email </div>
                    <div className="col s7 namespec">{user?.email}</div>
                </div>
            </div>
        </>
    )
}