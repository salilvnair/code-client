import { ReleaseInfo, Provider } from "@ngxeu/core";


export class CodeClientUpdaterConfig {
    @ReleaseInfo({
        user:"salilvnair",
        repo:"code-client",
        provider:Provider.github
    }) 
    gitReleaseUrl:string;
    downloadSuffix:string;

}