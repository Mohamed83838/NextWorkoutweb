// Workout Plan Type

interface WorkoutItemType {
    id: string | null;
    title: string;
    duration: number;

}

//Workout Type
export type WorkoutType = {
    id: string | null;
    title: string;
    workoutplan: WorkoutItemType[];

};