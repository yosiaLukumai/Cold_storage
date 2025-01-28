import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import App from './App'
import NotFound from './notFound'
import { DashBoard } from './layout/Dashboard'
import './index.scss'
import {Dash } from "./pages/dash/Dash"
import { Info } from './pages/dash/Info'
import { History } from './pages/dash/History'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Protected from './Hooks/Protect'
import { retriveData, save } from './utils/localStorage'
import { AllImages } from './pages/dash/Images'
import AddFridge from './pages/dash/addfridge'

const router  = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement:<NotFound />,
    
  }, {
    path: "/auth/:id",
    element:<Protected><DashBoard/></Protected>,
    errorElement: <NotFound/>,
    children:[
      {
        index:true,
        element: <Dash/>,
        
      },
      {
        path: "info",
        element: <Info/>
      },
      {
        path: "image",
        element: <AllImages/>
      },
      {
        path: "add",
        element: <AddFridge/>
      },
      {
        path:"param/:parameter/:workingfridge",
        element: <History/>
      }
    ]
    
  }
], {
  basename: "/coldroom"
})


const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
    blue: "blue",
  },
}

const theme = extendTheme({ colors })
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
    <RouterProvider router={router}  />

    </ChakraProvider>
  </React.StrictMode>,
)
