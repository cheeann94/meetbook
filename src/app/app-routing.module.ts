import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ViewEventListComponent } from './view-event-list/view-event-list.component';

const routes: Routes = [
  { path: 'sign-in', component: AppComponent },
  { path: 'view-event-list', component: ViewEventListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
