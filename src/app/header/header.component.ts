import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'codeclient-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  highLightElement: string;
  @Output() sideNavToggle = new EventEmitter<void>();

  constructor(
    private router: Router
    ) {}

  ngOnInit() {
    this.highlightElementOnRoute();
    //this.currentlyActive('/dashboard');
  }

  highlightElementOnRoute() {
    this.router.events.pipe(filter((event: any) => 
                    event instanceof NavigationEnd))
                    .subscribe(event => {
                       // //console.log(event.url);
                      this.currentlyActive(event.url) 
                    });
  }
  

  onToggleSidenav() {
    this.sideNavToggle.emit();
  }


  currentlyActive(id:any) {
    this.highLightElement = id;
  }
  
  getHighlightColor(id) {
    if (this.highLightElement && this.highLightElement === id) {
      return { color: "#3f51b5", "background-color": "white" };
    } else {
      return { color: "white", "background-color": "#3f51b5" };
    }
  }
}