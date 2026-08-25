import React from 'react'
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";

const DashboardPage = () => {
  return (
    <div >
      <Navbar/>
      <WelcomeSection/>
    </div>
  )
}

export default DashboardPage