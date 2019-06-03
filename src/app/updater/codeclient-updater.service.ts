import { Injectable, NgZone } from "@angular/core";
import { UpdateNotifier, ActionType, DownloadNotifier, InfoNotifier } from '@ngxeu/notifier';
import { ElectronService } from "ngx-electron";
import { CodeClientUpdater } from './codeclient.updater';
import { CodeClientSettingService } from '../settings/service/codeclient-settings.service';
@Injectable({
    providedIn:'root'
})
export class CodeClientUpdaterService{
    manualUpdateCheck = false;
    constructor(
        private codeClientUpdater:CodeClientUpdater,
        private updateNotifier:UpdateNotifier,
        private downloadNotifier:DownloadNotifier,
        private infoNotifier:InfoNotifier,
        private electronService:ElectronService,
        private ngZone:NgZone,
        private codeClientSettingsService: CodeClientSettingService
    ){}

    init(){
      this.electronService.ipcRenderer.on("checkForUpdate",()=>{
        this.ngZone.run(()=>{
          this.checkForUpdate();
        });
        this.manualUpdateCheck = true;
      })
      let codeClientSetting = this.codeClientSettingsService.loadSetting();
      if(codeClientSetting && codeClientSetting.app) {
        if(codeClientSetting.autoCheckUpdates) {
            this.checkForUpdate();
        }
      }
    }

    checkForUpdate() {
        this.codeClientUpdater.checkForUpdate().subscribe(updateStatus=>{
          if(this.codeClientUpdater.hasPendingUpdates()){
            this.downloadNotifier.notify(null,ActionType.pending).subscribe(notifierAction=>{
              if(notifierAction.action===ActionType.install) {
                this.downloadNotifier.notify(this.codeClientUpdater.install(),ActionType.install).subscribe(notifierAction=>{
                  if(notifierAction.action===ActionType.restart) {
                    this.codeClientUpdater.restart();
                  }
                });
              }
            });
          }
          else if(updateStatus.updateAvailable){        
            this.updateNotifier.notify(updateStatus).subscribe(notifierAction=>{
              if(notifierAction.action===ActionType.download) {
                this.downloadNotifier.notify(this.codeClientUpdater.download(),ActionType.download).subscribe(notifierAction=>{
                  if(notifierAction.action===ActionType.install) {
                    this.downloadNotifier.notify(this.codeClientUpdater.install(),ActionType.install).subscribe(notifierAction=>{
                      if(notifierAction.action===ActionType.restart) {
                        this.codeClientUpdater.restart();
                      }
                    });
                  }
                });
              }
              else if(notifierAction.action===ActionType.downloadInstall) {
                this.downloadNotifier.notify(this.codeClientUpdater.download(),ActionType.downloadInstall).subscribe(notifierAction=>{
                  if(notifierAction.action===ActionType.install) {
                    this.downloadNotifier.notify(this.codeClientUpdater.install(),ActionType.install).subscribe(notifierAction=>{
                      if(notifierAction.action===ActionType.restart) {
                        this.codeClientUpdater.restart();
                      }
                    });
                  }
                });
              }
            });                
          }
          else if(this.manualUpdateCheck){
            if(updateStatus.noInfo){
              this.infoNotifier.notify("Looks like you app is in the development mode,\n\n hence no release found!","400px");
            }
            else{
              this.infoNotifier.notify("Your app is up to date!");
            }
          }
        });
      }
    
}