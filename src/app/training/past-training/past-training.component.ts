import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { EditTrainingComponent } from './edit-training/edit-training.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  subscription: Subscription = {} as Subscription;

  constructor(private trainingService: TrainingService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
    });
    this.trainingService.fetchCompletedOrCancelledExercises();
    // this.dataSource.data = this.trainingService.fetchCompletedOrCancelledExercises();
  }

  onRowClick(exercise: Exercise) {
    console.log(exercise);
    const dialogRef = this.dialog.open(EditTrainingComponent, { data: exercise });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result, exercise.id);
        this.trainingService.startExercise(exercise.id);
      }
      //   this.startOrResumeTimer();
      // }
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
