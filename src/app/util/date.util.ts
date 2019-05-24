import { Injectable } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class DateUtil {
    format(date: Date, displayFormat: string): string {
        if (displayFormat == "dd/mm/yyyy") {
          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          return this._to2digit(day)+ "/" + this._to2digit(month)+ "/" + year;
        }else if (displayFormat == "dd/mm/yyyy hh:mm:ss") {
          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          return this._to2digit(day)+ "/" + this._to2digit(month)+ "/" + year+" "+this._to2digit(date.getHours())+":"+this._to2digit(date.getMinutes())+":"+this._to2digit(date.getSeconds());
        } else if (displayFormat == "mm/yyyy") {
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          return this._to2digit(month) + "/" + year;
        } else {
          return date.toDateString();
        }
      }
      parse(value: any): Date | null {
        if (typeof value === "string" && value.indexOf("/") > -1) {
          const str = value.split("/");
          let year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
          let yearWithTimeStamp = str[2].split(" ");
          if(yearWithTimeStamp.length>1){
            year = Number(yearWithTimeStamp[0]);
          }
          return new Date(year, month, date);
        }
        const timestamp = typeof value === "number" ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
      }
    
      private _to2digit(n: number) {
        return ("00" + n).slice(-2);
      }
}