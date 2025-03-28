import { WorkoutType } from "@/types/WorkoutTypes";
import { GetAuthToken } from "./auth";
import axios from "axios";

export async function SaveWorkout(workout:WorkoutType) {
    
    try {
        console.log("helooooooooooo ",workout)
        const token = await GetAuthToken()
      
        const response = await axios.post(
          "http://localhost:3000/api/workouts/add",
        {workout},
          {
            headers: { 
              "token":token
            }
          }
        );
  
    if (response.status !== 201){
        return null
    }
  
        return true
    } catch (error) {
        return null
    }
}