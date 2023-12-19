import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  name = '...';
  version = '...';
  isProduction = environment.production;

  constructor() {}

  async ngOnInit() {
    this.name = 'mrsi.portal.claims.fnol';
    this.version = '0.1.0';
  }
}
