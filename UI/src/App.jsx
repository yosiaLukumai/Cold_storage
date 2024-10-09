import { useState } from 'react'
import './App.scss'
import {Landing} from "./layout/Landing"


function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <Landing/>
   </>
  )
}

export default App
