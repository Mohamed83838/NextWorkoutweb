"use client";

import { Button } from "@/components/ui/button";
import { Dumbbell, Settings2} from "lucide-react";
import { Login } from "../_methods/auth";
import { useState } from "react";
import { WorkoutType } from "@/types/WorkoutTypes";
import AlertDalog from "./AlertDialog";
import AddWorkout from "./AddWorkout";
import { DisplayWorkout } from "./DisplayWorkout";
import SettingSheet from "./SettingsSheet";


interface AppBarProps {
    islogged: boolean;
    ismobile: boolean;
    onStateChange: (newValue: boolean) => void;
   
}

export default function AppBar(probs: AppBarProps) {


    const [workout, setWorkout] = useState<WorkoutType>({
        id: "-1",
        title: "default Workout",
        workoutplan: [
            {
                title: "hello",
                id: "0",
                duration: 10,

            }
        ]
    });
const   handleofflineworkout=(workoutt:WorkoutType)=> {
setWorkout(workoutt)
}
const onStateChangeAppBar=(islogged:boolean)=>{
    probs.onStateChange(islogged)
}
    const isDesktop = !probs.ismobile

 
    return (
        <div className="w-full p-2 sm:p-4 justify-between items-center flex flex-row font-sans">
            <div className="flex flex-row gap-2 items-center">
                <h1 className="text-xl sm:text-3xl text-white font-bold">NEXT WORKOUT</h1>
            </div>

            <div className="flex flex-row gap-x-1  items-center">
                {!probs.islogged && (
                    <Button className=" hover:cursor-pointer  " variant="outline" onClick={async () => {
                        const islogged = await Login();
                        probs.onStateChange(islogged);
                    }}

                    >
                  <Dumbbell/>
                        <h1 className="hidden sm:block">Continue</h1>
                    </Button>
                )

                }

               {
                probs.islogged && workout.id === "-1" ? 
                (
                    <AlertDalog title="Current Workout" description="You didnt choose any current workout Choose one or create one from settings" button="close"/>
                ):probs.islogged && workout.id !== "-1" ? (
                   <DisplayWorkout workout={workout}/>

                ): !probs.islogged &&(
                    <AddWorkout getworkout={handleofflineworkout} button="Workout" />
                )
            
                    
                
               }
              


              <SettingSheet onstateChange={onStateChangeAppBar} islogged ={probs.islogged}/>


            </div>
        </div>
    );
}

