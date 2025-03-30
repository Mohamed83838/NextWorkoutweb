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
import { useEffect, useState } from "react";
import { WorkoutType } from "@/types/WorkoutTypes";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const WorkoutSchema = z.object({
  title: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),


})

const WorkoutItemSchema = z.object({
  title: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  duration: z.coerce
    .number()
    .min(0, { message: "Age cannot be 0" }),
})
interface AddWorkoutProbs {
  islogged: boolean;
  getworkout: (newValue: WorkoutType) => void;
  button: string
  workout: WorkoutType | null;
  trigger: React.ReactNode
}

export default function AddWorkout(probs: AddWorkoutProbs) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const [workout, setWorkout] = useState<WorkoutType>({
    id: "-1",
    title: "default Workout",
    workoutplan: [

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
    defaultValues: { // Add this
      title: '' // Provide empty string as default value
    }
  })
  async function onSubmitWorkout(data: z.infer<typeof WorkoutSchema>) {
    if (workout.workoutplan.length === 0) {

      toast("You have to add at least one Activity")
      return;
    }
    // Create new workout object first
    const newWorkout = {
      ...workout,
      title: data.title,
      id: Date.now().toString() // Add proper unique ID
    };

    // Update state and pass the NEW object immediately
    setWorkout(newWorkout);
    probs.getworkout(newWorkout); // Use the new object here

    setOpen(false);
    Workoutform.reset();

    // Reset to initial state after delay
    setTimeout(() => {
      setWorkout({
        id: "-1",
        title: "default Workout",
        workoutplan: []
      });
    }, 500);
  }
  function handleSubmitOffline() {
    if (workout.workoutplan.length === 0) {

      toast("You have to add at least one Activity")
      return;
    }
    probs.getworkout(workout)
    setOpen(false)
  }
  async function onSubmitWorkoutItem(data: z.infer<typeof WorkoutItemSchema>) {
    const newWorkoutPlan = [...workout.workoutplan];

    // Generate unique ID using timestamp
    const newId = Date.now().toString();

    newWorkoutPlan.push({
      id: newId,
      title: data.title,
      duration: data.duration
    });

    const updatedWorkout = {
      ...workout,
      workoutplan: newWorkoutPlan
    };

    setWorkout(updatedWorkout);
    workoutItemform.reset();
    setOpen1(false);
  }
  async function deleteWorkoutItem(id: string) {

    setWorkout(prev => ({
      ...prev,
      workoutplan: prev.workoutplan.filter(item => item.id !== id)
    }));
  };
  useEffect(() => {
    if (probs.workout !== null) {
      setWorkout(probs.workout)
      // Reset form with workout data
      Workoutform.reset({ title: probs.workout.title })
    } else {
      // Reset to default when creating new
      Workoutform.reset({ title: '' })
    }
  }, [probs.workout]);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {probs.trigger}
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
                  <FormItem className={cn(
                    "text-sm font-medium",  // Always applied
                    { "hidden": !probs.islogged }  // Conditional
                  )}>

                    <FormLabel >
                      Workout title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Workout title"  {...field} />
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
                      <div className="w-full flex flex-row p-2 items-center justify-between bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="flex flex-row items-center gap-x-5">
                          <span className="text-gray-600">
                            {item.duration === 0 ? 'Pass' : `${item.duration}`}
                          </span>
                          <Trash2
                            className="h-5 w-5 text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                              <FormLabel>Activity title</FormLabel>
                              <FormControl>
                                <Input placeholder="Activity item" {...field} />
                              </FormControl>
                              <FormDescription>This is the Activity title</FormDescription>
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


                {probs.islogged ? (
                  <Button type="submit">Save Workout</Button>
                ) : (
                  <Button type="button" onClick={handleSubmitOffline}>Save Workout</Button>
                )
                }
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

    </div>
  )
}