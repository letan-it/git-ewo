import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MonitorService {
    constructor(private httpClient: HttpClient) {}
    private apiUrl = environment.apiUrl + 'Monitor/';
    private api_authenticate = environment.api_authenticate + 'Monitor/';
    private api_EWO_Attendance = environment.api_EWO_Attendance + 'Monitor/';
    private api_EWO_Survey = environment.api_EWO_Survey + 'Monitor/';
    private api_file = environment.api_file + 'Monitor/';
    private api_EWO_POSM = environment.api_EWO_POSM + 'Monitor/'; 
    private api_EWO_OSA = environment.api_EWO_OSA + 'Monitor/';
    private api_EWO_DISPLAY = environment.api_EWO_DISPLAY + 'Monitor/';
    private api_EWO_WORKFOLLOW = environment.api_EWO_WORKFOLLOW + 'Monitor/';
    private api_EWO_WAREHOUSE = environment.api_EWO_WAREHOUSE + 'Monitor/';
    private api_EWO_SELL = environment.api_EWO_SELL + 'Monitor/';
    private api_EWO_OOL = environment.api_EWO_OOL + 'Monitor/';
    private api_EWO_Activation = environment.api_EWO_Activation + 'Monitor/';
    private api_EWO_Logistics = environment.api_EWO_Logistics + 'Monitor/';
    private api_EWO_Inventory = environment.api_EWO_Inventory + 'Monitor/';
    private api_EWO_SOS = environment.api_EWO_SOS + 'Monitor/';
    
    // https://localhost:32778/api/Monitor/GetMonitor
   
    GetMonitor( url : any  ) {
        return this.httpClient.get(url + 'GetMonitor');
    }  
    
}
