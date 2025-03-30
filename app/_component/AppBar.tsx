"use client";

import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { Login } from "../_methods/auth";
import { useEffect, useState } from "react";
import { WorkoutType } from "@/types/WorkoutTypes";
import AlertDalog from "./AlertDialog";
import AddWorkout from "./AddWorkout";
import { DisplayWorkout } from "./DisplayWorkout";
import SettingSheet from "./SettingsSheet";

interface AppBarProps {
    islogged: boolean;
    ismobile: boolean;
    onStateChange: (newValue: boolean) => void;
    onWorkoutChange: (newValue: WorkoutType) => void;
}

export default function AppBar(probs: AppBarProps) {
    const [workout, setWorkout] = useState<WorkoutType>({
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

    // Sync workout state with parent
    useEffect(() => {
        probs.onWorkoutChange(workout);
    }, [workout]);

    const handlecomingeworkout = (workoutt: WorkoutType) => {
        setWorkout(workoutt);
    };

    const isDesktop = !probs.ismobile;

    return (
        <div className="w-full p-2 sm:p-4 justify-between items-center flex flex-row font-sans">
            <div className="flex flex-row gap-2 items-center">
                <h1 className="text-xl sm:text-3xl text-white font-bold">NEXT WORKOUT</h1>
            </div>

            <div className="flex flex-row gap-x-1 items-center">
                {!probs.islogged && (
                    <Button 
                        className="hover:bg-gray-400 bg-white text-black"
                        onClick={async () => {
                            const loggedIn = await Login();
                            probs.onStateChange(loggedIn);
                        }}
                    >
                        <Dumbbell />
                        <h1 className="hidden sm:block">Continue</h1>
                    </Button>
                )}

                {probs.islogged ? (
                    workout.id === "-1" ? (
                        <AlertDalog 
                            title="Current Workout" 
                            description="You didn't choose any current workout. Choose one or create one from settings" 
                            button="Close" 
                        />
                    ) : (
                        <DisplayWorkout workout={workout} trigger={<Button className="bg-white hover:cursor-pointer text-black hover:bg-gray-400">Workout</Button>}/>
                    )
                ) : !probs.islogged &&(
                    <AddWorkout 
                        getworkout={handlecomingeworkout} 
                        button="Workout" 
                        islogged={probs.islogged} 
                        workout={workout} 
                        trigger={
                            <Button variant="default" className="bg-white text-black hover:bg-gray-400">
                                Workout
                            </Button>
                        }
                    />
                )}

                <SettingSheet 
                    onstateChange={probs.onStateChange} 
                    islogged={probs.islogged} 
                    onselectworkout={handlecomingeworkout}
                />
            </div>
        </div>
    );
}