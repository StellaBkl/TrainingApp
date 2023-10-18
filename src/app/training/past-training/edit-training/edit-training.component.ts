import { Component, Inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Exercise } from '../../exercise.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class EditTrainingComponent {
  constructor(public dialogRef: MatDialogRef<EditTrainingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Exercise) { }

}
