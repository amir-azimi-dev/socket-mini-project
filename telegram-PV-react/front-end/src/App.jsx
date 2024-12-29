import Router from "./router";
import { useRoutes } from "react-router-dom";

import React from 'react'

function App() {
  const router = useRoutes(Router)

  return (
    router
  )
}

export default App