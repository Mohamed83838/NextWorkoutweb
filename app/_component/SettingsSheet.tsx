// components/SettingSheet.tsx
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
import { Dumbbell, EllipsisVertical, EyeIcon, Settings2, SquareMousePointer, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Login, Logout } from "../_methods/auth";
import { useWorkouts } from "../_methods/UseGetWorkouts";
import AddWorkout from "./AddWorkout";
import { DeleteWorkout, SaveWorkout } from "../_methods/workouts";
import { WorkoutType } from "@/types/WorkoutTypes";
import { UseGetUser } from "../_methods/UseGetUser";
import { DisplayWorkout } from "./DisplayWorkout";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"

interface SettingsSheetProbs {
    islogged: boolean;
    onstateChange: (islogged: boolean) => void
    onselectworkout: (workout: WorkoutType) => void
}

export default function SettingSheet(params: SettingsSheetProbs) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user, loadinguser, refetchuser } = UseGetUser();
    const [open, setOpen] = useState(false);
    const { workouts, loading, error, refetch } = useWorkouts();

    const deleteWorkout = async (delworkout: WorkoutType) => {

        await DeleteWorkout(delworkout)
        refetch();
    }
    const handleSaveWorkout = async (workout: WorkoutType) => {
        await SaveWorkout(workout);
        await refetch(); // Trigger immediate refresh after save
    }
    // Fix 1: Add useEffect to handle user refetch
    useEffect(() => {
        if (params.islogged) {
            refetchuser(); // Actually call the function
            refetch();
        }
    }, [params.islogged]); // Add dependencies

    // Fix 2: Handle loading state in UI
    if (loadinguser) {
        return <div>Loading user...</div>;
    }

    return (
        <Sheet  >
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="hover:cursor-pointer hover:bg-gray-400 ">
                    <Settings2 onClick={() => setIsDrawerOpen(true)} />
                </Button>
            </SheetTrigger>
            <SheetContent className=" min-h-100vh">
                <SheetHeader>
                    <SheetTitle>
                        {params.islogged ? (
                            <div className="flex flex-row gap-x-1 items-center">
                                <Avatar className="w-6 h-6 rounded-full">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <span>{user?.email}</span>
                            </div>
                        ) : (
                            <div>Settings</div>
                        )}
                    </SheetTitle>
                    <SheetDescription>
                        This is still under development
                    </SheetDescription>
                </SheetHeader>

                <div className="px-4 h-[calc(100vh-180px)] overflow-y-auto">
                    {params.islogged ? (
                        <div className="flex flex-col gap-y-2 w-full ">
                            <h1 className="text-xl font-medium h-full w-full items-center justify-center">Workouts:</h1>
                            {loading ? (
                                <div className=" absolute self-center">Loading workouts...</div>
                            ) : error ? (
                                <Button onClick={() => { }}> Refrech</Button>
                            ) : workouts?.length === 0 ? (
                                <h1 className="font-light text-gray-400">
                                    No workouts exist
                                </h1>
                            ) : (
                                <div className="space-y-2">
                                    {workouts.map((item) => (

                                        <div className=" flex flex-row justify-between items-center  outline-2 p-2 rounded-md" key={item.id}>
                                           
                                            <h1 className=" font-bold">
                                                {item.title}
                                            </h1>
                                            
                                            <div className=" flex flex-row gap-x-2 items-center ">
                                                <DisplayWorkout workout={item} trigger={<EyeIcon className=" hover:cursor-pointer " size={20}/>}/>
                                            <Menubar>
                                                <MenubarMenu>
                                                    <MenubarTrigger><EllipsisVertical size={20}/></MenubarTrigger>
                                                    <MenubarContent>
                                                      
                                                        <MenubarItem onClick={()=>{deleteWorkout(item)}}>Delete<MenubarShortcut><Trash/></MenubarShortcut></MenubarItem>
                                                        <MenubarItem onClick={()=>{params.onselectworkout(item)}}>Select<MenubarShortcut><SquareMousePointer/></MenubarShortcut></MenubarItem>
                                                       
                                                    </MenubarContent>
                                                </MenubarMenu>
                                            </Menubar>

                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <h1 className="font-medium text-gray-500">
                                Login to save and load workouts
                            </h1>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    {!params.islogged ? (
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={async () => {
                                const isloggedd = await Login();
                                params.onstateChange(isloggedd);
                            }}
                        >
                            <Dumbbell className="mr-2 h-4 w-4" />
                            <span>LOG IN</span>
                        </Button>
                    ) : (
                        <div className="flex justify-between gap-2 w-full">
                            <Button onClick={async()=>{
                                const result =await  Logout()
                                if (result === true){
                                    params.onstateChange(false)
                                    
                                }
                            }}
                                variant="outline"
                                className=""
                            >
                                Log out
                            </Button>
                            <AddWorkout
                                getworkout={handleSaveWorkout}
                                button="Add Workout"
                                islogged={params.islogged}
                                workout={null}
                                trigger={
                                    <Button>
                                        Add Workout
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}