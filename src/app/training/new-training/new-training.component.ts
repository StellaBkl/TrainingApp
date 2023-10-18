import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, from, map } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  exercises$: Observable<Exercise[]> = new Observable<Exercise[]>;
  private exerciseSubscription: Subscription = {} as Subscription;
  private loadingSubscription: Subscription = {} as Subscription;
  isLoading = true;

  constructor(private trainingService: TrainingService,
    private uiServise: UiService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.uiServise.loadingStateChanged.subscribe(loading => {
      this.isLoading = loading;
    });
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe((exercises) => {
      this.exercises = exercises;
    });
    this.trainingService.fetchAvailableExercises();

    //Without db
    // this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    console.log(form.value.exercise);
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

}
