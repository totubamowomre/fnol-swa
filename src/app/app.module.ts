import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./components/home/home.component";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatModule } from "./material.module";
import { NgbConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from "./components/footer/footer.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatModule,
    NgbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngbConfig: NgbConfig) {
    ngbConfig.animation = false;
  }
}
