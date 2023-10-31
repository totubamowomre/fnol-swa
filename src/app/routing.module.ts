import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FormPageComponent } from './form-page/form-page.component';
import { ConfirmationPageComponent } from './confirmation-page/confirmation-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'form', component: FormPageComponent },
  { path: 'confirmation', component: ConfirmationPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }