import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BitbucketService } from '../client/bitbucket/service/bitbucket.service';
import { Subject } from 'rxjs';
import { HeaderService } from './header.service';

@Component({
  selector: 'codeclient-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  highLightElement: string;
  logoSrc = "assets/logo/code-client-64.png";
  @Output() sideNavToggle = new EventEmitter<void>();
  showDashboardDependentTabs = false;
  constructor(
    private router: Router,
    private bitBucketService: BitbucketService,
    private headerService: HeaderService
    ) {}

  ngOnInit() {
    this.headerService.logoSrcListener().subscribe(logo=>{
      this.logoSrc = logo;
    })
    this.highlightElementOnRoute();
    this.toggleBrowseFileTab();
  }

  toggleBrowseFileTab() {
    this.bitBucketService.publishDashboardData().subscribe(dashBoardData=>{
      if(dashBoardData) {
        this.showDashboardDependentTabs = true;
      }
      else{
        this.showDashboardDependentTabs = false;
      }
    })
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