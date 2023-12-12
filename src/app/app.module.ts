import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FormComponent } from './components/form/form.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatModule } from './material.module';
import { NgbConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { ApiService } from 'src/api/api.service';
import { RoutingModule } from './routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FormPageComponent } from './form-page/form-page.component';
import { ConfirmationPageComponent } from './confirmation-page/confirmation-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionReminderDialogComponent } from './components/session-reminder-dialog/session-reminder-dialog.component';
import { SessionExpiredDialogComponent } from './components/session-expired-dialog/session-expired-dialog.component';
import { TermsDialogComponent } from './components/terms-dialog/terms-dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EmailTooLargeDialogComponent } from './components/email-too-large-dialog/email-too-large-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FormComponent,
    LandingPageComponent,
    FormPageComponent,
    ConfirmationPageComponent,
    TermsDialogComponent,
    EmailTooLargeDialogComponent,
    SessionExpiredDialogComponent,
    SessionReminderDialogComponent,
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatModule,
    NgbModule,
  ],
  entryComponents: [
    TermsDialogComponent,
    EmailTooLargeDialogComponent,
    SessionExpiredDialogComponent,
    SessionReminderDialogComponent,
  ],
  providers: [
    ApiService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(ngbConfig: NgbConfig) {
    ngbConfig.animation = false;
  }
}
