"use client"
import { WorkoutType } from "@/types/WorkoutTypes";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
interface DisplayWorkoutprobs{
    workout:WorkoutType;
    trigger:React.ReactNode
}

export function DisplayWorkout(params:DisplayWorkoutprobs) {
        const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    {params.trigger}
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>{params.workout.title}</DialogTitle>
      <DialogDescription>
        Workout plan details
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
      {params.workout.workoutplan.map((item, index) => (
        <div 
          key={item.id || `item-${index}`}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {item.duration === 0 ? (
                  <span>Open time</span>
                ) : (
                  <span>{item.duration} seconds</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {params.workout.workoutplan.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No exercises in this workout
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>
    )
}