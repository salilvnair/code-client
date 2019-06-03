import { Database } from '@salilvnair/ngpa';
import { ApiProviderSetting } from './api-provider.model';
//import { DashBoardModel } from 'src/app/client/bitbucket/model/dashboard.model';

@Database("setting")
export class CodeClientSetting {
    app:string ='codeclient';
    bearerToken: string;
    autoCheckUpdates:boolean = true;
    //defaultRepo: DashBoardModel;    
}