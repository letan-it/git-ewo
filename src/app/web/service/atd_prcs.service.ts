import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Areas } from '../models/areas';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AtdPrcsService {
    constructor(private httpClient: HttpClient) {}

    private prc = environment.api_EWO_Attendance + 'Prcs/';
    private notifi = environment.apiUrl + 'Tasks/';

    GetTokenByEmpId(emp_id: number) {
        const body = new FormData();
        body.append('emp_id', emp_id.toString());
        return this.httpClient.post(this.prc + 'GetTokenByEmpId', body);
    }
    PushNoti(
        token_client: string,
        type_code: string,
        clickAction: string,
        title: string,
        desc: string,
        platform: string,
        project_id: number
    ) {
        return this.httpClient.post(this.notifi + 'PushNotification', {
            token_client,
            type_code,
            clickAction,
            title,
            desc,
            platform,
            project_id,
        });
    }
    Prc_process_request_explanation(
        project_id: number,
        transaction_uuid: string,
        request_note: string,
        report_id: number,
        status: number,
        atd_result_id: number,
        action?: string
    ) {
        return this.httpClient.post(
            this.prc + 'Prc_process_request_explanation',
            {
                project_id,
                transaction_uuid,
                request_note,
                report_id,
                status,
                atd_result_id,
                action,
            }
        );
    }
    Web_Notification_Save(
        employee_id: number,
        project_id: number,
        title: string,
        desc: string,
        content: string,
        type_code: string,
        platform: string
    ) {
        return this.httpClient.post(this.prc + 'Web_Notification_Save', {
            employee_id,
            project_id,
            title,
            desc,
            content,
            type_code,
            platform,
        });
    }
    PrcCheckIsRequest(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.prc + 'PrcCheckIsRequest', body);
    }
    Prc_Request_Explanation_GetList(report_id: number, project_id: number) {
        return this.httpClient.post(
            this.prc + 'Prc_Request_Explanation_GetList',
            { report_id, project_id }
        );
    }
}
