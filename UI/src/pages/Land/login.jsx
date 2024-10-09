import "./../../App.scss"
export const Login = ({getValues}) => {
    const obtainEmail = (e) => {
        getValues(1, e.target.value)
    }
    const obtainPassword = (e) => {
        getValues(2, e.target.value)
    }
    return (
        <>
        <div className="column">
                <input className=""  placeholder="Email" type="text" onChange={(e) => obtainEmail(e)}></input>
                <input className="" style={{margin:"2rem  0rem"}} placeholder="Password"  type="password" onChange={(e) => obtainPassword(e)}></input>
        </div>
        <div>

        </div>
        </>
    )
}