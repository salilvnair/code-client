import { Component, OnInit } from '@angular/core';
import { CodeClientSettingService } from './service/codeclient-settings.service';
import { CodeClientSetting } from './model/codeclient-setting.model';
import { MatHeaderProgressData } from '../util/mat-header-progress/mat-header-progress.data';
import { Router } from '@angular/router';

@Component({
  selector: 'codeclient-settings',
  templateUrl: './codeclient-settings.component.html',
  styleUrls: ['./codeclient-settings.component.css']
})
export class CodeClientSettingsComponent implements OnInit {
    constructor(
        private codeClientSettingsService: CodeClientSettingService,
        private matHeaderProgressData:MatHeaderProgressData,
        private router: Router
        ) {}
    bearerToken:string;
    tokenChanged:boolean = false;
    codeClientSetting: CodeClientSetting;

    ngOnInit() {
      this.codeClientSetting = this.codeClientSettingsService.loadSetting();
      this.bearerToken = this.codeClientSetting.bearerToken
    }

    dirtyCheck() {
      this.tokenChanged = true;
    }

    saveConfig() {
      let codeClientSetting: CodeClientSetting = new CodeClientSetting();
      codeClientSetting.bearerToken = this.bearerToken;
      this.matHeaderProgressData.setHidden(false);
      if(this.tokenChanged){
        this.codeClientSettingsService.updateSetting(this.codeClientSetting,codeClientSetting).then(()=>{
          this.matHeaderProgressData.setHidden(true);
        })
      }
      else {
        if(this.bearerToken){
          this.codeClientSettingsService.updateSetting(this.codeClientSetting,codeClientSetting).then(()=>{
            this.matHeaderProgressData.setHidden(true);
          })
        }
        else {
          this.codeClientSettingsService.saveSetting(codeClientSetting).then(()=>{
            this.matHeaderProgressData.setHidden(true);
          })
        }
      }
      this.router.navigate(["dashboard"]);
    }
}
