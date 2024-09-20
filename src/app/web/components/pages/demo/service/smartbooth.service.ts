import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SmartBoothService { 

    constructor(private httpClient: HttpClient) { }

    private apiUrl = environment.apiUrl + 'Demos/';
   
  

    web_GetFakeData() {
        return this.httpClient.get(this.apiUrl + 'web_GetFakeData'
        );
    }
}