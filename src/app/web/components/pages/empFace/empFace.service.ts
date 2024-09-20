import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as saveAs from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class EmpFaceService {
    constructor(private httpClient: HttpClient) {}

    private api_Root = environment.apiUrl + 'Employee/';
    getList(
        source_app: string,
        system_source: string,
        project_id: number,
        employee_code: string,
        employee_id: number
    ) {
        return this.httpClient.post(this.api_Root + 'GetListEmpFace', {
            source_app,
            system_source,
            project_id,
            employee_code,
            employee_id,
        });
    }
}
