import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FormComponent } from "./components/form/form.component";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatModule } from "./material.module";
import { NgbConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from "./components/footer/footer.component";
import { ApiService } from "src/api/api.service";
import { RoutingModule } from "./routing.module";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { FormPageComponent } from "./form-page/form-page.component";
import { ConfirmationPageComponent } from "./confirmation-page/confirmation-page.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FormComponent,
    LandingPageComponent,
    FormPageComponent,
    ConfirmationPageComponent
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatModule,
    NgbModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngbConfig: NgbConfig) {
    ngbConfig.animation = false;
  }
}
