import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
   providedIn:'root'
})
export class MatHeaderProgressData {

 private _value:number=0;
 private _hide:boolean=false;
 private _hideSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

 set value(value:number){
    this._value = value;
 }
 get value(){
    return this._value;
 }

 setHidden(hide:boolean){
    this._hideSubject.next(hide);
 }
 isHidden(){
    return this._hideSubject.asObservable();
 }

}