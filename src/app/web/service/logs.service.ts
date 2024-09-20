import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class LogsService {
    constructor(private httpClient: HttpClient) {}
    private apiLogs = environment.apiUrl + 'Logs/';

    // https://localhost:32780/api/Logs/QuerySupport_GetList_Web

    QuerySupport_GetList_Web(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiLogs + 'QuerySupport_GetList_Web',
            body
        );
    }

    QuerySupport_Action(
        project_id: number,
        querySupport_id: number,
        employee_id: number,
        plan_date: number,
        query_string: string,
        action: string
    ) {
        return this.httpClient.post(this.apiLogs + 'QuerySupport_Action', {
            project_id,
            querySupport_id,
            employee_id,
            plan_date,
            query_string,
            action,
        });
    }

    ewo_Projects_Action(
        project_id: number,
        project_name: string,
        project_desc: string,
        image: string,
        configuration: string,
        action: string
    ) {
        return this.httpClient.post(this.apiLogs + 'ewo_Projects_Action', {
            project_id,
            project_name,
            project_desc,
            image,
            configuration,
            action,
        });
    }

    ewo_LogDevice_GetList(
        project_id: number,
        login_name: string,
        employee_code: string,
        year_month: number,
        created_date_int: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiLogs + 'ewo_LogDevice_GetList', {
            project_id,
            login_name,
            employee_code,
            year_month,
            created_date_int,
            rowPerPage,
            pageNumber,
        });
    }

    ewo_LogDevice_RawData(
        project_id: number,
        login_name: string,
        employee_code: string,
        year_month: number,
        created_date_int: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        const url = this.apiLogs + 'ewo_LogDevice_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };
        const requestBody = {
            project_id,
            login_name,
            employee_code,
            year_month,
            created_date_int,
            rowPerPage,
            pageNumber,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'LogDevice');
            });
    }
    Raw_register_the_device(project_id: number) {
        const url = this.apiLogs + 'Raw_register_the_device';
        const options = {
            responseType: 'blob' as 'json',
        };
        const body = new FormData();
        body.append('project_id', project_id.toString());

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'LogRegisterTheDevice');
            });
    }

    ewo_LogFiles_GetList(
        project_id: number,
        employee_code: string,
        year_month: number,
        created_date_int: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiLogs + 'ewo_LogFiles_GetList', {
            project_id,
            employee_code,
            year_month,
            created_date_int,
            rowPerPage,
            pageNumber,
        });
    }

    ewo_LogFiles_RawData(
        project_id: number,
        employee_code: string,
        year_month: number,
        created_date_int: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        const url = this.apiLogs + 'ewo_LogFiles_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };
        const requestBody = {
            project_id,
            employee_code,
            year_month,
            created_date_int,
            rowPerPage,
            pageNumber,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'LogFile');
            });
    }

    saveFile(response: any, title: any = '.xlsx', file_name: string = '') {
        const currentTime = new Date();
        const filename =
            'download_' +
            file_name +
            '_' +
            currentTime.getFullYear().toString() +
            (currentTime.getMonth() + 1) +
            currentTime.getDate() +
            currentTime
                .toLocaleTimeString()
                .replace(/[ ]|[,]|[:]/g, '')
                .trim() +
            title;

        saveAs(response, filename);
    }
}
