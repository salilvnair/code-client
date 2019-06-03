import { Component, OnInit } from '@angular/core';
import { CodeClientUpdaterService } from './updater/codeclient-updater.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor( private codeClientUpdaterService:CodeClientUpdaterService) {
  }
  ngOnInit(): void {
    this.codeClientUpdaterService.init();
  }
  title = 'code-client';
}
