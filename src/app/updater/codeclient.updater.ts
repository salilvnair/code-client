import { NgxElectronUpdater } from "@ngxeu/core";
import { Injectable } from "@angular/core";
import { CodeClientUpdaterConfig } from './codeclient-updater.config';
@Injectable({
    providedIn:'root'
})
export class CodeClientUpdater extends NgxElectronUpdater<CodeClientUpdaterConfig>{
    entityInstance(): CodeClientUpdaterConfig {
        return new CodeClientUpdaterConfig();
    }

    appName():string {
        return "codeclient";
    }
}