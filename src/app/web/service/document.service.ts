import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    constructor(private httpClient: HttpClient) {}

    private apiUrl = environment.apiUrl + 'Documents/';

    Documents_GetList(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        group_code: string,
        file_group: string,
        file_name: string,
        created_by: number,
        status: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Documents_GetList', {
            rowPerPage,
            pageNumber,
            project_id,
            group_code,
            file_group,
            file_name,
            created_by,
            status,
        });
    }

    Documents_Action(
        project_id: number,
        file_id: number,
        group_code: string,
        file_group: string,
        file_name: string,
        file_url: string,
        html_content: string,
        status: number,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'Documents_Action', {
            project_id,
            file_id,
            group_code,
            file_group,
            file_name,
            file_url,
            html_content,
            status,
            action,
        });
    }

    Documents_RawData(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        group_code: string,
        file_group: string,
        file_name: string,
        created_by: number,
        status: number
    ) {
        const body = {
            rowPerPage,
            pageNumber,
            project_id,
            group_code,
            file_group,
            file_name,
            created_by,
            status,
        };
        const url = this.apiUrl + 'Documents_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '_Documents_RawData');
            });
    }

    Document_employees_GetList(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        file_id: number,
        employee_code: string,
        from_date: number,
        to_date: number
    ) {
        return this.httpClient.post(
            this.apiUrl + 'Document_employees_GetList',
            {
                rowPerPage,
                pageNumber,
                project_id,
                file_id,
                employee_code,
                from_date,
                to_date,
            }
        );
    }
    Document_pushNotification(
        project_id: number,
        emp_idList: string,
        type_code: string,
        title: string,
        desc: string,
        content: string,
        platform: string
    ) {
        return this.httpClient.post(this.apiUrl + 'Document_PushNotification', {
            project_id,
            emp_idList,
            type_code,
            title,
            desc,
            content,
            platform,
        });
    }

    Document_employees_Action(
        project_id: number,
        file_id: number,
        employee_code: string,
        from_date: number,
        to_date: number,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'Document_employees_Action', {
            project_id,
            file_id,
            employee_code,
            from_date,
            to_date,
            action,
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
