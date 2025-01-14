import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportedUsersComponent } from './reported-users.component';

const routes: Routes = [
  {
    path: '',
    component: ReportedUsersComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportedUsersRoutingModule {}
