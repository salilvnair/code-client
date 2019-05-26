import { Database } from '@salilvnair/ngpa';
import { ApiProviderSetting } from './api-provider.model';

@Database("profile-setting")
export class ProfileSetting {
    app:string ='codeclient';
    profile: string;
    apiProviderSetting: ApiProviderSetting;
    contextURLs: ContextURL[];
}

export class ContextURL {
    context: string;
    displayName:string;
    url: string;
    icon: string;
}