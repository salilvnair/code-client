import { Database } from '@salilvnair/ngpa';
import { DashBoardModel } from 'src/app/client/bitbucket/model/dashboard.model';

@Database("setting")
export class CodeClientSetting {
    app:string ='codeclient';
    bearerToken: string;
    //defaultRepo: DashBoardModel;    
}