import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleListComponent } from './sample-list/sample-list.component';

export const routes: Routes = [
  { path: 'samples', component: SampleListComponent },
  { path: '', redirectTo: '/samples', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
