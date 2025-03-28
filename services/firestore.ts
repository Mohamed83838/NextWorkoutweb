import { collection, addDoc, doc, getDoc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { WorkoutType } from "@/types/WorkoutTypes";
import { UserType } from "@/types/UserTypes";
//Add Workout : Add a new workout to the database
export async function addWorkout(user: UserType, workout: WorkoutType) {
    try {
        const docRef = await addDoc(collection(db, "users", user.email, "workouts"), workout);
        await updateDoc(docRef, {
            id: docRef.id
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
}
// update Workout 
export async function updateWorkout(user: UserType, workout: WorkoutType) {
    try {
        const id = workout.id || ""
        const docRef = doc(db, "users", user.email, "workouts", id);
        await updateDoc(docRef, workout);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
}

//Get Workout
export async function getWorkout(user: UserType, workout: WorkoutType) {
    try {
        const id = workout.id || ""
        const docRef = doc(db, "users", user.email, "workouts", id);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (error) {
        return null
    }

}
//Get Workouts : Get all workouts for a user from the database
export async function getWorkouts(user: UserType) {
    try {
        const querySnapshot = await getDocs(collection(db, "users", user.email, "workouts"));
        const workouts: WorkoutType[] = [];
        querySnapshot.forEach((doc) => {
            workouts.push(doc.data() as WorkoutType);
        });
        return workouts;
    } catch (e) {
        console.error("Error getting documents: ", e);
        return null;
    }
}

//Delete Workout : Delete a workout from the database   
export async function deleteWorkout(user: UserType, workout: WorkoutType) {
    try {
        if (workout.id === null) {
            console.error("Error deleting document: Workout ID is null");
            return null;
        }
        const docref = await deleteDoc(doc(db, "users", user.email, "workouts", workout.id.toString()));
        return docref
    } catch (e) {
        console.error("Error deleting document: ", e);
        return null;
    }
}