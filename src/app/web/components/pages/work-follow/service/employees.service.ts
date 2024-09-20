import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EmployeesService { 

    constructor(private httpClient: HttpClient) { }

    private apiUrl = environment.api_EWO_WORKFOLLOW + 'Employees/';
    GetEmployees(employee_id: number) {
        const body = new FormData();
        body.append('employee_id', employee_id.toString());
        return this.httpClient.post(this.apiUrl + 'GetEmployees', body);
    }
}