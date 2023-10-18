import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, getDocs, addDoc, setDoc, doc, query } from "firebase/firestore";
import { Subject, Subscription, from, map, subscribeOn } from 'rxjs';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise | undefined>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise?: Exercise;
  private firebaseSubscriptions: Subscription[] = [];

  //Old version with no db
  // private availableExercises: Exercise[] = [
  //   { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
  //   { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
  //   { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
  //   { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  // ];
  // private finishedExercises: Exercise[] = [];

  constructor(private firestore: Firestore,
    private uiServise: UiService) { }

  fetchAvailableExercises() {
    this.uiServise.loadingStateChanged.next(true);
    const itemCollection = collection(this.firestore, 'availableExercises');
    //First way without doc id
    // this.exercises$ = collectionData(itemCollection);

    //Second way with doc id and maping to Exercise
    const q = query(itemCollection);
    const querySnapshot$ = from(getDocs(q));  //From Promise to Observable

    this.firebaseSubscriptions.push(querySnapshot$.pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            name: doc.data()['name'],
            duration: doc.data()['duration'],
            calories: doc.data()['calories']
          }
        })
      )
    ).subscribe({
      next: (exercises: Exercise[]) => {
        this.uiServise.loadingStateChanged.next(false);
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      },
      error: (error) => {
        this.uiServise.loadingStateChanged.next(false);
        this.uiServise.showSnackbar('Fetching Exercise failed, please try again later', undefined, 3000);
      },
      complete: () => console.log('complete')
    }));
  }

  startExercise(selectedId: string) {
    //Update existing doc
    // setDoc(
    //   doc(this.firestore, 'availableExercises/', selectedId),
    //   { lastSelected: new Date() }
    // );

    this.runningExercise = this.availableExercises.find(
      exercise => exercise.id === selectedId
    );
    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    }
  }

  completeExercise() {
    if (this.runningExercise) {
      //No db
      // this.exercises.push({

      this.addDataToDatabase({
        ...this.runningExercise,
        progress: 100,
        date: new Date(),
        state: 'completed'
      });
    }
    this.runningExercise = undefined;
    this.exerciseChanged.next(undefined);
  }

  cancelExercise(progress: number) {
    if (this.runningExercise) {
      //No db
      // this.exercises.push({

      this.addDataToDatabase({
        ...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        progress: progress,
        date: new Date(),
        state: 'cancelled'
      });
    }
    this.runningExercise = undefined;
    this.exerciseChanged.next(undefined);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }


  fetchCompletedOrCancelledExercises() {
    const itemCollection = collection(this.firestore, 'finishedExercise');
    this.firebaseSubscriptions.push(collectionData(itemCollection).subscribe((docD) => {
      const ex = docD.map((doc) => {
        return {
          id: doc['id'],
          name: doc['name'],
          duration: doc['duration'],
          calories: doc['calories'],
          progress: doc['progress'],
          state: doc['state'],
          date: doc['date']
        }
      });
      console.log(ex)
      this.finishedExercisesChanged.next(ex);
    }));
    // return this.finishedExercises.slice();
  }

  private addDataToDatabase(exercise: Exercise) {
    setDoc(doc(this.firestore, 'finishedExercise', exercise.id), exercise);
  }

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(subscribtion =>
      subscribtion.unsubscribe()
    )
  }
}
