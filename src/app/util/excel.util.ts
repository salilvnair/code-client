import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as dateFormat from 'dateformat';
@Injectable({
    providedIn:'root'
})
export class ExcelUtil {


    exportToExcel(data:any[],repo:string,branch:string){
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CodeClient');
        

        /* save to file */
        const fileName = "CodeClient_"+repo+"_"+branch+"_"+dateFormat(new Date(),'dd/mm/yyyy h:MM:ss TT Z');
        XLSX.writeFile(wb, fileName+'.xlsx');
    }


}