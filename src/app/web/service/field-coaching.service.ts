import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FieldCoachingService {
    constructor(private httpClient: HttpClient) {}

    private apiUrl = environment.api_EWO_FIELDCOACHING + 'FieldCoaching/';

    GetFieldCoaching(
        year_month: number,
        project_id: number,
        employee_id: number,
        manager_id: number,
        survey_id: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'GetFieldCoaching', {
            year_month,
            project_id,
            employee_id,
            manager_id,
            survey_id,
            rowPerPage,
            pageNumber,
        });
    }
    GetFieldCoachingReport(project_id: number, report_id: number) {
        return this.httpClient.post(this.apiUrl + 'GetFieldCoachingReport', {
            project_id,
            report_id,
        });
    }
    Works_Coaching_Getlist(
        project_id: number, 
        report_id: string,
        from_date: number, 
        to_date: number, 
        survey_id: number, 
        shop_list: string, 
        province_id: number,
        field_type: number,
        confirm_result: number,
        employee_checker_id: number,
        employee_id: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Works_Coaching_Getlist', {
            project_id, 
            report_id,
            from_date, 
            to_date, 
            survey_id, 
            shop_list, 
            province_id,
            field_type,
            confirm_result,
            employee_checker_id,
            employee_id,
            rowPerPage,
            pageNumber   
        });
    }

    Works_Coaching_GetDetail(
        project_id: number, 
        work_id: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Works_Coaching_GetDetail', {
            project_id, 
            work_id
        });
    }

    FieldCoaching_RawData(
        year_month: number,
        project_id: number,
        employee_id: number,
        manager_id: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        const url = this.apiUrl + 'FieldCoaching_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            year_month,
            project_id,
            employee_id,
            manager_id,
            rowPerPage,
            pageNumber,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'atd');
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
    // Get template
    FieldCoaching_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(this.apiUrl + 'FieldCoaching_GetTemplate', body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'FieldCoaching_GetTemplate');
            });
    }
    FieldCoaching_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'FieldCoaching_ImportData',
            formDataUpload
        );
    }

    FieldCoaching_Action(
        project_id: number,
        id: number,
        emp_checker_id: number,
        emp_id: number,
        field_date_from: number,
        field_date_to: number,
        survey_id: number,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'FieldCoaching_Action', {
            project_id,
            id,
            emp_checker_id,
            emp_id,
            field_date_from,
            field_date_to,
            survey_id,
            action,
        });
    }
}
