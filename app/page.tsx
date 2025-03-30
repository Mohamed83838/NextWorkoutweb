"use client"
import AppBar from "./_component/AppBar";
import { useEffect, useState } from "react";
import { useWindowSize } from 'react-use';
import { GetAuthToken, Login } from "./_methods/auth";
import BigTimer from "./_component/TimerScreen";
import { WorkoutType } from "@/types/WorkoutTypes";



export default function Home() {

  const [version, setVersion] = useState(0);
  const [Workout, setWorkout] = useState<WorkoutType>({
    id: "-1",
    title: "default Workout",
    workoutplan: [
     {
      id:"0",
      title:"Jumping Jacks",
      duration:10
     }
    ]
  });
  function onworkoutchange(nworkout: WorkoutType) {
    setWorkout(nworkout)
    console.log(nworkout)
    setVersion(v => v + 1);
  }
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
    <main className="flex flex-col w-screen h-screen bg-black select-none">

      <AppBar islogged={islogged} ismobile={ismobile} onStateChange={handleAppBarAction} onWorkoutChange={onworkoutchange} />
      <BigTimer workout={Workout} key={`${Workout.id}-${version}`} isdesktop={!ismobile}/>
    </main>
  );
}

