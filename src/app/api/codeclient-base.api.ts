import { QueryParam } from './model/query-params.model';

export class CodeClientBaseApi {
  constructor(){}
  protected prepareEndpointURL(
                                apiPrefix:string,
                                endPointURL:string,
                                pathVariable?:string,
                                pathVariableValue?:string){
    let endpointUrl = endPointURL;
    if(pathVariable && pathVariableValue){
      endpointUrl = endpointUrl.replace(pathVariable,pathVariableValue);
    }
    return  apiPrefix + endpointUrl;
  }

  protected prepareEndpointURLWithQueryParam(
        apiPrefix:string,
        endPointURL:string,
        queryParam:QueryParam[]){
    let endpointUrl = endPointURL;
    if(queryParam && queryParam.length>0){
      queryParam.forEach(query=>{
        endpointUrl = endpointUrl.replace(query.param,query.value);
      })
    }
    return  apiPrefix + endpointUrl;
  }
}
