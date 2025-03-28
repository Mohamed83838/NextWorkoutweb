"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { WorkoutType } from "@/types/WorkoutTypes";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const WorkoutSchema = z.object({
    title: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    
})

const WorkoutItemSchema = z.object({
    title: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    duration: z.coerce.number()
})
interface AddWorkoutProbs{
    getworkout:(newValue: WorkoutType) => void;
    button:string
}

export default function AddWorkout(probs:AddWorkoutProbs) {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [workout, setWorkout] = useState<WorkoutType>({
        id: "0",
        title: "default Workout",
        workoutplan: [
            {
                title: "hello",
                id: "0",
                duration: 10,

            }
        ]
    });
    const workoutItemform = useForm<z.infer<typeof WorkoutItemSchema>>({
        resolver: zodResolver(WorkoutItemSchema),
        defaultValues: {
            title: '', // Empty string instead of undefined
            duration: 0 // Ensure number type
        }
    })
    const Workoutform = useForm<z.infer<typeof WorkoutSchema>>({
        resolver: zodResolver(WorkoutSchema),
        defaultValues: {
            title: '', // Empty string instead of undefined
        }
    })
    async function onSubmitWorkout(data: z.infer<typeof WorkoutSchema>) {

        setWorkout({...workout,title:data.title})
        setOpen(false)
        probs.getworkout(workout)
        Workoutform.reset()
        
    }
    async function onSubmitWorkoutItem(data: z.infer<typeof WorkoutItemSchema>) {
            const newWorkoutPlan = [...workout.workoutplan];
    
            // Get last ID safely
            const lastId = newWorkoutPlan.at(-1)?.id;
    
            // Calculate new ID with proper type handling
            const parsedId = Number.parseInt(lastId || '0', 10);
            const newId = (Number.isNaN(parsedId) ? 0 : parsedId) + 1;
    
            newWorkoutPlan.push({
                id: newId.toString(),
                title: data.title,
                duration: data.duration
            });
    
            setWorkout({
                ...workout,
                workoutplan: newWorkoutPlan
            });
            workoutItemform.reset();
            setOpen1(false)
        }
        async function deleteWorkoutItem(id: string) {
    
            setWorkout(prev => ({
                ...prev,
                workoutplan: prev.workoutplan.filter(item => item.id !== id)
            }));
        };

    return (
        <div>
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline" className="hover:scale-110">{probs.button}</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Add Workout</DialogTitle>
      <DialogDescription>Create a New Workout Plan</DialogDescription>
    </DialogHeader>

    <Form {...Workoutform}>
      <form onSubmit={Workoutform.handleSubmit(onSubmitWorkout)} className="w-full space-y-4">
        <FormField
          control={Workoutform.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout item</FormLabel>
              <FormControl>
                <Input placeholder="Workout title" {...field} />
              </FormControl>
              <FormDescription>This is the workout title</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="max-h-[300px] overflow-y-auto pr-2">
          <ol className="space-y-1 list-none">
            {workout.workoutplan.map((item) => (
              <li key={item.id} className="group">
                <div className="flex flex-row p-2 items-center justify-between bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex flex-row items-center gap-x-5">
                    <span className="text-gray-600">
                      {item.duration === 0 ? 'Pass' : `${item.duration}`}
                    </span>
                    <Trash2
                      className="h-5 w-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => deleteWorkoutItem(item.id || "")}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex flex-row items-center gap-x-1">
          {/* Nested dialog for adding items */}
          <Dialog open={open1} onOpenChange={setOpen1}>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">Add Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit workout</DialogTitle>
                <DialogDescription>Make changes to your workout</DialogDescription>
              </DialogHeader>
              
              <Form {...workoutItemform}>
                <form onSubmit={(e) => e.preventDefault()} className="w-full space-y-4">
                  <FormField
                    control={workoutItemform.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout item</FormLabel>
                        <FormControl>
                          <Input placeholder="Workout item" {...field} />
                        </FormControl>
                        <FormDescription>This is the workout item name</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={workoutItemform.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Duration" {...field} />
                        </FormControl>
                        <FormDescription>Leave it 0 for an open time</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button"
                    onClick={workoutItemform.handleSubmit(onSubmitWorkoutItem)}
                  >
                    Submit Item
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Main form submit button */}
          <Button type="submit">Save Workout</Button>
        </div>
      </form>
    </Form>
  </DialogContent>
</Dialog>

        </div>
    )
}