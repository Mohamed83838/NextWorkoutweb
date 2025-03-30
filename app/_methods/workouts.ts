import { WorkoutType } from "@/types/WorkoutTypes";
import { GetAuthToken } from "./auth";
import axios from "axios";

export async function SaveWorkout(workout:WorkoutType) {
    
    try {
        const token = await GetAuthToken()
      
        const response = await axios.post(
          "http://localhost:3001/api/workouts/add",
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
console.log(error)
        return null
    }
}

export async function DeleteWorkout(workout:WorkoutType) {
    
  try {
      const token = await GetAuthToken()
    
      const response = await axios.post(
        "http://localhost:3001/api/workouts/remove",
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
    console.log(error)
      return null
  }
}