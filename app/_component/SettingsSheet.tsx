"use client"


import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Check, Dumbbell, Settings2, Trash } from "lucide-react";
import { useState } from "react";
import { GetUser, Login } from "../_methods/auth";
import { useCurrentUser } from "../_methods/useCurrentUser";
import { useWorkouts } from "../_methods/UseGetWorkouts";
import AddWorkout from "./AddWorkout";
import { SaveWorkout } from "../_methods/workouts";
import { WorkoutType } from "@/types/WorkoutTypes";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface SettingsSheetProbs {
    islogged: boolean;
    onstateChange: (islogged: boolean) => void

}

export default function SettingSheet(params: SettingsSheetProbs) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user } = useCurrentUser()
    const { workouts, loading, error, refetch } = useWorkouts();

    const getWorkout = async (workout: WorkoutType) => {

        await SaveWorkout(workout)
        refetch()
    }
    return (
        <Sheet>
            <SheetTrigger asChild><Button variant="outline" size="icon" className="hover:scale-110">
                <Settings2
                    onClick={() => {
                        setIsDrawerOpen(true)
                    }}
                />
            </Button></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        {
                            params.islogged ?
                                (
                                    <div className=" flex flex-row gap-x-1">
                                        <Avatar className=" w-6 h-6 rounded-2xl">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <h1>
                                            {user?.email}
                                        </h1>
                                    </div>
                                ) : (
                                    <h1>
                                        Settings
                                    </h1>
                                )

                        }
                    </SheetTitle>
                    <SheetDescription>
                        This is still under development
                    </SheetDescription>
                </SheetHeader>
                <div className=" px-4">
                    {
                        params.islogged ? (
                            <div className=" flex flex-col gap-y-2 h-full w-full">
                                <h1 className=" text-xl font-medium">
                                    Workouts :
                                </h1>
                                {
                                    workouts?.length === 0 ? (
                                        <h1 className=" font-light text-gray-400">
                                            no workouts exist
                                        </h1>
                                    ) : (
                                        <div className="  max-h-[75vh] overflow-y-auto hover:cursor-pointer">
                                            {workouts.map((item, index) => (

                                                <Accordion type="single" collapsible key={item.id}>
                                                    <AccordionItem value={item.id || ""}>
                                                        <AccordionTrigger><div className=" flex flex-row items-center justify-between ">
                                                            
                                                            <h1>{item.title}</h1>
                                                            <div className=" flex flex-row gap-x-0.5">
                                                                <Trash/>
                                                                <Check/>
                                                            </div>
                                                            
                                                            </div></AccordionTrigger>
                                                        <AccordionContent>
                                                            {
                                                                item.workoutplan.map((wo) => (
                                                                    <div key={wo.id} className=" flex flex-row items-center justify-between px-2 w-full">
                                                                        <h1> {wo.title}</h1>
                                                                        {
                                                                            wo.duration === 0 ? (
                                                                                <p>
                                                                                    open time
                                                                                </p>
                                                                            ) : (
                                                                                <p>
                                                                                    {wo.duration} s
                                                                                </p>
                                                                            )
                                                                        }                                                                    </div>
                                                                ))
                                                            }
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>

                                            ))}


                                        </div>
                                    )
                                }

                            </div>
                        ) :
                            (
                                <div className="flex h-full w-full items-center justify-center absolute bottom-1 left-1">
                                    <h1 className=" font-medium text-gray-500">
                                        Login to save and load workouts
                                    </h1>

                                </div>
                            )
                    }
                </div>



                {
                    !params.islogged ? (
                        <Button className=" hover:cursor-pointer   absolute bottom-1 left-1" variant="outline" onClick={async () => {
                            const islogged = await Login();
                            params.onstateChange(islogged);
                        }}

                        >
                            <Dumbbell />
                            <h1 className="hidden sm:block">LOG IN</h1>
                        </Button>
                    ) : (
                        <div className=" flex flex-row justify-between absolute bottom-1 w-full px-4">
                            <Button variant='outline' className="hover:cursor-pointer   ">Log out</Button>
                            <AddWorkout getworkout={getWorkout} button="add workout" />
                        </div>

                    )
                }
            </SheetContent>
        </Sheet>
    )

}