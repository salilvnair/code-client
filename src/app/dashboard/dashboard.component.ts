import { Component, OnInit } from '@angular/core';
import { BitbucketService } from '../client/bitbucket/service/bitbucket.service';
import { DashBoardModel } from '../client/bitbucket/model/dashboard.model';
import { Router } from '@angular/router';
import { CodeClientSettingService } from '../settings/service/codeclient-settings.service';
import { CodeClientSetting } from '../settings/model/codeclient-setting.model';
import { MatHeaderProgressData } from '../util/mat-header-progress/mat-header-progress.data';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    public = true;
    dataSource: DashBoardModel[];
    constructor(
        private bitbucketService:BitbucketService,
        private codeClientSettingsService: CodeClientSettingService,
        private router: Router,
        private matHeaderProgressData:MatHeaderProgressData
        ){}
    ngOnInit(){
        setTimeout(() => {
            this.init();
        }, 0);        
    }

    loadRecentRepo() {
        this.matHeaderProgressData.setHidden(false);
        this.bitbucketService.getRecentRepo().subscribe(response=>{
            this.matHeaderProgressData.setHidden(true);
            let recentRepoResp = response.body;
            recentRepoResp.values.forEach(recentRepo=>{
               if(recentRepo.project.type!='PERSONAL'){
                    let dashBoardModel = new DashBoardModel();
                    dashBoardModel.public = recentRepo.public;
                    dashBoardModel.project_key = recentRepo.project.key;
                    dashBoardModel.repo_slug = recentRepo.slug;
                    dashBoardModel.repo_name = recentRepo.name;
                    dashBoardModel.project_name = recentRepo.project.name;
                    if(!this.dataSource){
                        this.dataSource =  [];                        
                    }
                    this.dataSource.push(dashBoardModel);
               }
            })
        })
    }

    loadCommitHistory(dashBoardModel:DashBoardModel) {
        this.bitbucketService.setSelectedFileHistoryData(null);
        this.bitbucketService.setSelectedDashBoardData(dashBoardModel);
        this.router.navigate(["commit-history"]);
    }

    init() {
        let codeClientSetting = this.codeClientSettingsService.loadSetting();
        let profileSetting = this.codeClientSettingsService.loadProfileSetting();
        if(codeClientSetting && 
            codeClientSetting.bearerToken
            ) {
            if(!profileSetting || !profileSetting.profile ||
                !profileSetting.apiProviderSetting ||
                !profileSetting.apiProviderSetting.apiPrefixUrl) {
                this.bitbucketService.openProfileSettingDialog().subscribe(data=>{
                    if(data.profile) {
                        this.loadRecentRepo();
                    }
                })
            }
            else {
                this.loadRecentRepo();
            }
        }
        else {
            this.showSettingsDialog();
        }
    }

    showSettingsDialog() {        
        this.bitbucketService.openSettingsDialog().subscribe(codeClientSetting=>{
            let profileSetting = this.codeClientSettingsService.loadProfileSetting();
            if(codeClientSetting && 
                codeClientSetting.bearerToken
                ) {
                if(!profileSetting || !profileSetting.profile ||
                    !profileSetting.apiProviderSetting ||
                    !profileSetting.apiProviderSetting.apiPrefixUrl) {
                    this.bitbucketService.openProfileSettingDialog().subscribe(data=>{
                        if(data.profile) {
                            this.loadRecentRepo();
                        }
                    })
                }
                else {
                    this.loadRecentRepo();
                }
            }
        })
    }

}
