import { cn } from '@/lib/utils';
import { WorkoutType, WorkoutItemType } from '@/types/WorkoutTypes';
import { useState, useEffect } from 'react';
import { playSound } from '../_methods/playSound';

interface BigTimerProps {
    workout: WorkoutType,
}

const BigTimer = (props: BigTimerProps) => {
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [endOfWorkout, setEndOfWorkout] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [workout, setWorkout] = useState(props.workout);
    const [activity, setActivity] = useState<WorkoutItemType>(props.workout.workoutplan[0]);
    const [isPassActivity, setIsPassActivity] = useState(activity.duration === 0);


    
    // Update workout state when props change
    useEffect(() => {
        props.workout.workoutplan.forEach((workoutitem, index) => {
            workoutitem.id = index.toString();
          });
        setWorkout(props.workout);
        const firstActivity = props.workout.workoutplan[0];
        setActivity(firstActivity);
        setIsPassActivity(firstActivity?.duration === 0);
    }, [props.workout]);

    // Main timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                setTotalSeconds(prev => prev + 1);

                if (!isPassActivity) {
                    const remaining = activity.duration - (totalSeconds % activity.duration);
                    if (remaining <= 1) {
                        moveToNextActivity();
                    }
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, activity, isPassActivity, totalSeconds]);

    const moveToNextActivity = () => {
        const currentIndex = workout.workoutplan.findIndex(act => act.id === activity.id);
        const nextActivity = workout.workoutplan[currentIndex + 1];
        setTotalSeconds(0)
        playSound()
        

        if (nextActivity) {
            setActivity(nextActivity);
            setIsPassActivity(nextActivity.duration === 0);
            if (nextActivity.duration > 0) {
                setTotalSeconds(0);
            }
        } else {
            setIsRunning(false);
            setEndOfWorkout(true);
        }
    };

    const formatTime = (time: number) => {
        return time.toString().padStart(2, '0');
    };

    const handleStartStop = () => {
        if (endOfWorkout){
            playSound();
            return;
        }
        setIsRunning(!isRunning);
        if(!isRunning){
            playSound()
        }
        if (!isRunning && isPassActivity) {
            setTotalSeconds(0);
        }
    };

    const handleReset = () => {
        setTotalSeconds(0);
        setIsRunning(false);
        setEndOfWorkout(false);
        const firstActivity = workout.workoutplan[0];
        setActivity(firstActivity);
        setIsPassActivity(firstActivity?.duration === 0);
    };

    const getDisplayTime = () => {
        if (isPassActivity) return totalSeconds;
        if (activity.duration > 0) {
            const remaining = activity.duration - (totalSeconds % activity.duration);
            return Math.min(remaining, activity.duration);
        }
        return totalSeconds;
    };

    const displayTime = getDisplayTime();
    const minutes = Math.floor(displayTime / 60);
    const seconds = displayTime % 60;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-black">
            <div className="text-6xl font-bold mb-8 bg-black p-8 rounded-lg shadow-lg">
                <span className="text-[100px] text-white sm:text-[300px] select-none">{formatTime(minutes)}</span>
                <span className="text-[100px] mx-2 text-white sm:text-[300px]">:</span>
                <span className="text-[100px] text-white sm:text-[300px]">{formatTime(seconds)}</span>
            </div>

            <div className="space-x-4 mb-8">
                <button
                    onClick={handleStartStop}
                    className={`px-6 py-3 rounded-lg text-black font-semibold hover:cursor-pointer ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white hover:bg-gray-400'
                        } transition-colors`}
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>

                <button
                    onClick={handleReset}
                    className="hover:cursor-pointer px-6 py-3 rounded-lg bg-[#FF6500] text-white font-semibold hover:bg-orange-600 transition-colors"
                >
                    Reset
                </button>

                {isRunning && isPassActivity && (
                    <button
                        onClick={moveToNextActivity}
                        className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:cursor-pointer ransition-colors hover:bg-gray-500"
                    >
                        Next Activity
                    </button>
                )}
            </div>

            <div className='absolute bottom-5 text-white font-bold text-xl flex flex-col sm:flex-row'>
                Current workout: {workout.title}
                {endOfWorkout && <span className="text-[#FF6500] ml-4"> - COMPLETED!</span>}
            </div>

            <div className='w-full top-28 sm:top-1/2 px-8 sm:px-0 absolute sm:right-8 flex flex-col gap-y-2 text-white sm:w-1/6'>
                {workout.workoutplan.length === 0 ? (
                    <h1 className='text-xl font-bold'>Add Some Activities to Start</h1>
                ) : (
                    <div className='flex flex-col gap-y-2'>
                        {workout.workoutplan
                            .filter(act => parseInt(act.id || "0") >= parseInt(activity.id || "0") - 2 &&
                                parseInt(act.id || "0") <= parseInt(activity.id || "0") + 2)
                            .map(activityItem => (
                                <div
                                    key={activityItem.id}
                                    className={cn(
                                        "ml-3 flex justify-between text-[18px] transition-all duration-400",
                                        {
                                            "text-[24px] font-bold ml-0 text-white":
                                                activityItem.id === activity.id,
                                            "opacity-50": activityItem.id !== activity.id
                                        }
                                    )}
                                >
                                    <h3>{activityItem.title}</h3>
                                    <p>{activityItem.duration === 0 ? 'Pass' : `${activityItem.duration}s`}</p>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BigTimer;