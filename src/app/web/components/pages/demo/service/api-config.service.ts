import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class APIConfigService { 

    constructor(private httpClient: HttpClient) { }

    private apiUrl = environment.api_EWO_WAREHOUSE + 'APIConfig/';
   
  

    API_GetList() {
        return this.httpClient.get(this.apiUrl + 'API_GetList'
        );
    }

    API_Create(url:string,desc:string,cache_minutes:number,param:any) {
        return this.httpClient.post(this.apiUrl + 'API_Create', {url,desc,cache_minutes,param}
        );
    }
    API_CreateToken(id: number, api_id: number, uuid: any , url_preview: string,status:number,header:any) {
        return this.httpClient.post(this.apiUrl + 'API_CreateToken', {id,api_id,uuid,url_preview,status,header}
        );
    }

}