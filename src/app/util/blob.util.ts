import { Injectable } from "@angular/core";
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn:'root'
})
export class BlobUtil {
    saveBlobFile(blob:Blob, defaultFileName:string){
      if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, defaultFileName);
      } 
      else {
        const link = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = link;
        a.download = defaultFileName;
        a.click();
        window.URL.revokeObjectURL(link);
        a.remove();
      }
    }

    saveHttpResponseBlobFile(responseBlob:HttpResponse<Blob>){
      let blob = responseBlob.body;
      let defaultFileName = responseBlob.headers.get('filename');
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, defaultFileName);
      } 
      else {
        const link = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = link;
        a.download = defaultFileName;
        a.click();
        window.URL.revokeObjectURL(link);
        a.remove();
      }
    }

    constructBlob(blob:Blob,defaultFileName:string){
      var excelData = new Blob([blob]);
      var excelURL = window.URL.createObjectURL(excelData);
      var tempLink = document.createElement('a');
      tempLink.href = excelURL;
      tempLink.setAttribute('download', defaultFileName);
      tempLink.click();
    }
}