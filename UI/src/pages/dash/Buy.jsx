import "./../../App.scss"
import buy from "../../assets/set1.png"
import { useState } from "react"
import { retriveData, save } from "../../utils/localStorage"
import { Button } from "../../components/Button"
import { useEffect } from "react"
import { MainUrl } from "../../../variables"
export const Buy = () => {
    const [amount, changeAmount] = useState("")
    const [error, setError] = useState("")
    const [hit, setHit] = useState(false)
    const changesAmount = (e) => {
        e.preventDefault();
        setError("")
        changeAmount(e.target.value)
    }
    const buyUnit = () => {
        setHit(!hit)
    }
    const buyUnits = async () => {
        try {
            setError("")
            let url = `${MainUrl}/user/buy/${retriveData("userEm")._id}/${(parseFloat(amount)/100).toFixed(2)}"`
            const data = await fetch(url)
            const resp = await data.json()
            if (resp.success) {
                if(resp.body._id) {
                    save("userEm", resp.body)
                }
                setError("Transaction  successful")
                changeAmount("")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    useEffect(() => {
        if(amount.trim() !== "" && parseFloat(amount) > 0) {
            buyUnits()
        }
    }, [hit])
    return (
        <>
            <div className="buy">
                
                <div className="dashIcon" style={{ padding: "1rem 0" }}>
                    <img src={buy} alt="bu icon"></img>
                </div>
                <div style={{ paddingTop: "1.2rem 0",textAlign: "center",paddingLeft:"0.5rem", fontSize: "1.5rem", fontWeight: "bolder", color: "#2B1736ff" }}>
                    Buy units
                </div>
               
                <div className="container">
                    <div className="col s8 cent">
                        <input id="amountInput" placeholder="Enter Amount" value={amount} type="number" onChange={(e) => changesAmount(e)}></input>
                    </div>
                </div>

                <div className="container">
                    {amount / 100 > 0 && <div className="col s8 centT">
                        <span style={{ color: "orange", paddingRight: "1rem", }}>{(amount / 100).toFixed(2)}</span><span >Units</span>
                    </div>}

                </div>
                <div className="container">
                    <div className="col s8 cents">
                        <Button actionCalled={() => buyUnit()} width="10rem" height="2.8rem" fontWeight="bolder" color="hsla(60, 92%, 61%, 1)" fontSize="1.3rem" radius="22px" backgroundColor="rgba(0, 128, 0, 0.474)" name="Buy"></Button>
                    </div>
                </div>
                <div style={{ marginTop: "5rem 0", textAlign: "center", textDecoration:"underline", fontSize: "1.5rem", fontWeight: "bolder", color: "#eb8258ff" }}>
                    {error}
                </div>
            </div>
        </>
    )
}