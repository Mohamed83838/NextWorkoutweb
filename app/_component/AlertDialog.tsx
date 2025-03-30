"use client"
import {
    AlertDialog,
    AlertDialogAction,

    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
  



interface AlertDialogprobs{
    title:string;
    description:string;
    button:string;
}

export default function AlertDalog(probs:AlertDialogprobs){
return (
    <AlertDialog>
  <AlertDialogTrigger asChild>

  <Button variant="outline" className="hover:scale-110">Workouts</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{probs.title}</AlertDialogTitle>
      <AlertDialogDescription>
       {
        probs.description
       }
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     
      <AlertDialogAction>{probs.button}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
)

}