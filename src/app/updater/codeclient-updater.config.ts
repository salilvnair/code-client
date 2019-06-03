import { ReleaseInfo, Provider } from "@ngxeu/core";


export class CodeClientUpdaterConfig {
    @ReleaseInfo({
        user:"salilvnair",
        repo:"codeclient",
        provider:Provider.github
    }) 
    gitReleaseUrl:string;
    downloadSuffix:string;

}