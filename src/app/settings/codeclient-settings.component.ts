import { Component, OnInit } from '@angular/core';
import { CodeClientSettingService } from './service/codeclient-settings.service';
import { CodeClientSetting } from './model/codeclient-setting.model';
import { MatHeaderProgressData } from '../util/mat-header-progress/mat-header-progress.data';
import { Router } from '@angular/router';
import { BitbucketService } from '../client/bitbucket/service/bitbucket.service';

@Component({
  selector: 'codeclient-settings',
  templateUrl: './codeclient-settings.component.html',
  styleUrls: ['./codeclient-settings.component.css']
})
export class CodeClientSettingsComponent implements OnInit {
    constructor(
        private codeClientSettingsService: CodeClientSettingService,
        private bitbucketService: BitbucketService,
        private matHeaderProgressData:MatHeaderProgressData,
        private router: Router
        ) {}
    bearerToken:string;
    tokenChanged:boolean = false;
    codeClientSetting: CodeClientSetting;
    autoCheckUpdates:boolean = true;
    apiProviders = [
      {
        name:'Bitbucket',
        value:'bitbucket',
        apiPrefixUrl:'https://api.bitbucket.org',
        disabled:false
      },
      {
        name:'Github',
        value:'github',
        apiPrefixUrl:'https://api.github.com',
        disabled:true
      },
      {
        name:'GitLab',
        value:'gitlab',
        apiPrefixUrl:'https://gitlab.com/api',
        disabled:true
      }
    ]
    selectedProvider = this.apiProviders[0];

    ngOnInit() {
      this.codeClientSetting = this.codeClientSettingsService.loadSetting();    
      this.bearerToken = this.codeClientSetting.bearerToken
      this.autoCheckUpdates = this.codeClientSetting.autoCheckUpdates;
    }

    dirtyCheck() {
      this.tokenChanged = true;
    }

    saveConfig() {
      let codeClientSetting: CodeClientSetting = new CodeClientSetting();
      codeClientSetting.bearerToken = this.bearerToken;
      codeClientSetting.autoCheckUpdates = this.autoCheckUpdates;
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

    closeConfig() {
      this.router.navigate(["dashboard"]);
    }

    viewProfiles() {
      this.bitbucketService.openProfileSettingDialog().subscribe(()=>{
      })
    }
}
