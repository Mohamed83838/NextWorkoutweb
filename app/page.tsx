"use client"
import AppBar from "./_component/AppBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useWindowSize } from 'react-use';
import { GetAuthToken, Login } from "./_methods/auth";


export default function Home() {

  useEffect(() => {
    async function checkAuth() {
      const token = await GetAuthToken();
      setIslogged(token !== null); // Set true if token exists
      setIsmobile(width < 700)

    }
    checkAuth();
  }, []);




  const { width } = useWindowSize();
  const [islogged, setIslogged] = useState(false);
  const [ismobile, setIsmobile] = useState(false);

  // Callback function to update parent state
  const handleAppBarAction = (newValue: boolean) => {
    setIslogged(newValue);
    // Can update other states here too
  };


  return (
    <main className="flex flex-col w-screen h-screen bg-black">

      <AppBar islogged={islogged} ismobile={ismobile} onStateChange={handleAppBarAction} />


    </main>
  );
}

