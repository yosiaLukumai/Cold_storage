import "./../../App.scss"
import buy from "../../assets/set1.png"
import { useState } from "react"
import { retriveData, save } from "../../utils/localStorage"
import { Button } from "../../components/Button"
import { useEffect } from "react"
import { MainUrl } from "../../../variables"
export const Debt = () => {
    const [amount, changeAmount] = useState("")
    const [error, setError] = useState("")
    const [hit, setHit] = useState(false)
    const [user, setUser] = useState(retriveData("userEm"))
    const [firstTime, setFirstTime] = useState(false)
    const [exceed, setexceed] = useState(false)
    const changesAmount = (e) => {
      
        e.preventDefault();
        setError("")
        changeAmount(e.target.value)
        if(amount > 2.5){
            setexceed(true)
        }else {
            setexceed(false)
        }
        
    }
    const buyUnit = () => {
        changeAmount("3")
        // console.log("tring ");
        setHit(!hit)
    }
    // console.log((parseFloat(user.amount) - parseFloat(user.debt)));
    const buyUnits = async () => {
        try {
            setError("")
            let url = `${MainUrl}user/balance/${retriveData("userEm")._id}/3`
            const data = await fetch(url)
         
            const resp = await data.json()
            if (resp.success) {
                if (resp.body._id) {
                    save("userEm", resp.body)
                    setUser(resp.body)
                }
                setError("Loan  successful")
                changeAmount("")
                setFirstTime(true)
            }
        } catch (error) {
            setError(error.message)
        }
    }
    console.log(parseFloat(user.amount) - parseFloat(user.debt) == 0);
    useEffect(() => {
        if (amount.trim() !== "" && parseFloat(amount) > 0) {
            buyUnits()
        }
    }, [hit])
    return (
        <>
            <div className="buy">
                <div className="dashIcon" style={{ padding: "1rem 0" }}>
                    <img src={buy} alt="debt icon"></img>
                </div>
                {((parseFloat(user.amount) - parseFloat(user.debt)) <= 0 && (parseFloat(user.amount) - parseFloat(user.debt)) == 0 && !firstTime) ?
                    <div>
                        <div style={{ paddingTop: "1.2rem 0", textAlign: "center", paddingLeft: "0.5rem", fontSize: "1.5rem", fontWeight: "bolder", color: "#2B1736ff" }}>
                            Get loan on units
                        </div>

                        {/* <div className="container">
                            <div className="col s8 cent">
                                <input id="amountInput" placeholder="Enter Units" value={amount} type="number" onChange={(e) => changesAmount(e)}></input>
                            </div>
                        </div> */}

                        <div className="container">
                            {((parseFloat(amount) > 0) && parseFloat(amount) <=2.6) && <div className="col s8 centT">
                                <span style={{ color: "orange", paddingRight: "1rem", }}>{(amount * 100).toFixed(2)}</span><span >Tsh</span>
                            </div>}
                            {( parseFloat(amount) > 2.6) && <div className="col s8 centT">
                                <span style={{ color: "orange", paddingRight: "1rem",textAlign:"center" }}>You can't get more units than 2.5</span>
                            </div>}

                        </div>
                        <div className="container">
                            <div className="col s8 cents">
                                <Button disabled={ parseFloat(amount)>2.6} actionCalled={() => buyUnit()} width="10rem" height="2.8rem" fontWeight="bolder" color="hsla(60, 92%, 61%, 1)" fontSize="1.3rem" radius="22px" backgroundColor="rgba(0, 128, 0, 0.474)" name="Loan"></Button>
                            </div>
                        </div>
                       
                    </div> : <div style={{ paddingTop: "1.2rem 0", textAlign: "center", paddingLeft: "0.5rem", fontSize: "1.5rem", fontWeight: "bolder", color: "#eb8258ff" }}>
                    <div style={{ marginTop: "5rem 0", textAlign: "center", textDecoration: "underline", fontSize: "1.5rem", fontWeight: "bolder", color: "#eb8258ff" }}>
                            {error}
                        </div>
                        You can't get Loan pay previous debt
                    </div>
                }
            </div>
        </>
    )
}