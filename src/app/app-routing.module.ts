import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  //Lazy load child modules (only when needed)
  {
    path: 'training', loadChildren: () => import('./training/training.module').then(m => m.TrainingModule),
    canMatch: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]  //normaly should be added to root (app.module)
})
export class AppRoutingModule { }
