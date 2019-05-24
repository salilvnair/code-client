import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { MatHeaderProgressData } from "./mat-header-progress.data";
import { Subscription } from "rxjs";

@Component({
  selector: "mat-header-progress",
  templateUrl: "./mat-header-progress.component.html",
  styleUrls: ["./mat-header-progress.component.css"]
})
export class MatHeaderProgressComponent implements OnInit,OnDestroy {
  @Input("value") value: number=0;
  headerHiddenSubscription:Subscription;
  @Input("mode") mode: string="indeterminate";
  @Input("height") height: string = "5px";
  @Input("color") color: string = "primary";
  @Input("hide") hidden:boolean=false;
  @Output('onProgressComplete') onProgressComplete = new EventEmitter<any>();

  constructor(private matHeaderData:MatHeaderProgressData){}
  ngOnInit() {
    this.value = this.matHeaderData.value;
    this.headerHiddenSubscription = this.matHeaderData.isHidden().subscribe(hidden=>{
      this.hidden = hidden;
    });
  }
  ngOnDestroy() {
    this.headerHiddenSubscription.unsubscribe();
  }

}
