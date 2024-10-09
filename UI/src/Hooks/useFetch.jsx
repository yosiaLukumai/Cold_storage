import {useState, useEffect} from "react"

const useFetch = (url) => {
    const [data, setData] = useState(null)
    const [isPending, setPending] = useState(true)
    const [error, setError] = useState(null)
    let abort = new AbortController()
    useEffect(()=> {
        fetch(url,{signal:abort.signal}).then((res) => {
            if(!res.ok){
                throw Error("Failed to fetch data")
            }
            return res.json()
        }).then(data => {
            setData(data)
            setPending(false)
            setError(null)
        }).catch(err => {
            if(err.name == "AbortError"){
                console.log("Abort cmd received");
            }else {
                setError(err.message)
                setPending(false)
            }
        })
    }, [url])

    return {data, isPending, error}
}