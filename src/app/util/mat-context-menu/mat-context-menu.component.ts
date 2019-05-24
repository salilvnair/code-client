import { Component, HostBinding, HostListener } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'mat-context-menu',
  template: '<ng-content></ng-content>',
  styles: ['']
})
export class MatContextMenuComponent extends MatMenuTrigger {

  @HostBinding('style.position') private position = 'fixed';
  @HostBinding('style.pointer-events') private events = 'none';
  @HostBinding('style.left') private x: string;
  @HostBinding('style.top') private y: string;

  // Intercepts the global context menu event
  //@HostListener('document:contextmenu', ['$event'])
  public open({ clientX, clientY }: MouseEvent, data?: any) {
    //////console.log(data);
    // Pass along the context data to support lazily-rendered content
    if(!!data) { this.menuData = data; }

    // Adjust the menu anchor position
    this.x = clientX + 'px';
    this.y = clientY + 'px';

    // Opens the menu
    this.openMenu();
    
    // prevents default
    return false;
  }
}