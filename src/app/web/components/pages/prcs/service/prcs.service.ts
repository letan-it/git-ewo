import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class PrcsService {
    constructor(private httpClient: HttpClient) {}

    private api_EWO_Attendance = environment.api_EWO_Attendance + 'Prcs/';

    // Prc_ATD_Result
    Prc_ATD_Result(
        project_id: number,
        employee_id: number,
        from_date: number,
        to_date: number
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Prc_ATD_Result',
            {
                project_id,
                employee_id,
                from_date,
                to_date,
            }
        );
    }

    // PrcRegisterRemove_plan
    PrcRegisterRemove_plan(
        project_id: number,
        transaction_uuid: string,
        prc_id: number,
        step_id: number,
        action_id: number,
        note: string,
        data: any
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcRegisterRemove_plan',
            {
                project_id,
                transaction_uuid,
                prc_id,
                step_id,
                action_id,
                note,
                data,
            }
        );
    }

    //
    PrcGetprocess(project_id: number) {
        return this.httpClient.post(this.api_EWO_Attendance + 'PrcGetprocess', {
            project_id,
        });
    }

    PrcActionStatus(project_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Prc_ActionStatus',
            {
                project_id,
            }
        );
    }

    PrcGetStorePermission(project_id: number, employee_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetStorePermission',
            {
                project_id,
                employee_id,
            }
        );
    }

    PrcGetEmployeeLeave(project_id: number, employee_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetEmployeeLeave',
            {
                project_id,
                employee_id,
            }
        );
    }

    PrcGetListLeave(
        project_id: number,
        leave_code: string,
        leave_name: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetListLeave',
            {
                project_id,
                leave_code,
                leave_name,
            }
        );
    }

    PrcEmployeeLeaveAction(
        id: number,
        project_id: number,
        year: number,
        employee_id: number,
        leave_year: number,
        days_off_used: number,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcEmployeeLeaveAction',
            {
                id,
                project_id,
                year,
                employee_id,
                leave_year,
                days_off_used,
                action,
            }
        );
    }

    PrcListLeaveAction(
        leave_id: number,
        project_id: number,
        leave_code: string,
        leave_name: string,
        configuration: string,
        is_leave: number,
        min_value: number,
        max_value: number,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcListLeaveAction',
            {
                leave_id,
                project_id,
                leave_code,
                leave_name,
                configuration,
                is_leave,
                min_value,
                max_value,
                action,
            }
        );
    }

    PrcGetEmployeeList(project_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetEmployeeList',
            {
                project_id,
            }
        );
    }

    // PrcGetprocesbyProjects
    PrcGetprocesbyProjects(
        project_id: number,
        process_id: number,
        status: number
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetprocesbyProjects',
            {
                project_id,
                process_id,
                status,
            }
        );
    }

    // PrcGetprocesbyProjectsDetail
    PrcGetprocesbyProjectsDetail(project_id: number, Prc_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetprocesbyProjectsDetail',
            {
                project_id,
                Prc_id,
            }
        );
    }

    // Prc_process_project_Action
    Prc_process_project_Action(
        prc_id: number,
        project_id: number,
        process_id: number,
        process_name: number,
        is_send_mail: number,
        is_notification: number,
        config: string,
        status: number,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Prc_process_project_Action',
            {
                prc_id,
                project_id,
                process_id,
                process_name,
                is_send_mail,
                is_notification,
                config,
                status,
                action,
            }
        );
    }

    // Prc_process_step_Action
    Prc_process_step_Action(
        prc_id: number,
        step_id: number,
        action_id: number,
        layout_id: number,
        employee_type_action: number,
        order: number,
        desc: string,
        template_notification_id: number,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Prc_process_step_Action',
            {
                prc_id,
                step_id,
                action_id,
                layout_id,
                employee_type_action,
                order,
                desc,
                template_notification_id,
                action,
            }
        );
    }

    // PrcGetMaster
    PrcGetMaster(project_id: number) {
        return this.httpClient.post(this.api_EWO_Attendance + 'PrcGetMaster', {
            project_id,
        });
    }

    // PrcGetAction
    PrcGetAction(project_id: number) {
        return this.httpClient.post(this.api_EWO_Attendance + 'PrcGetAction', {
            project_id,
        });
    }

    // PrcGetLayout
    PrcGetLayout(project_id: number) {
        return this.httpClient.post(this.api_EWO_Attendance + 'PrcGetLayout', {
            project_id,
        });
    }

    // PrcGetNotificationTemplate
    PrcGetNotificationTemplate(connent: string, project_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetNotificationTemplate',
            {
                connent,
                project_id,
            }
        );
    }

    // CreateNotificationTemplate
    PrcNotificationTemplateAction(
        template_notification_id: number,
        connent: string,
        title: string,
        project_id: number,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcNotificationTemplateAction',
            {
                template_notification_id,
                connent,
                title,
                project_id,
                action,
            }
        );
    }

    // PrcGetNoteList
    PrcGetNoteList(
        project_id: number,
        process_id: number,
        note: string,
        is_edit: number
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetNoteList',
            {
                project_id,
                process_id,
                note,
                is_edit,
            }
        );
    }

    // PrcCreateNoteList
    PrcNoteListAction(
        id: number,
        project_id: number,
        process_id: number,
        note: string,
        is_edit: number,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcNoteListAction',
            {
                id,
                project_id,
                process_id,
                note,
                is_edit,
                action,
            }
        );
    }

    // PrcGetLayoutTemplate
    PrcGetLayoutTemplate(
        layout_name: string,
        action_type: string,
        process_id: number,
        layout_type: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcGetLayoutTemplate',
            {
                layout_name,
                action_type,
                process_id,
                layout_type,
            }
        );
    }

    // PrcCreateLayoutTemplate
    PrcLayoutTemplateAction(
        layout_id: number,
        layout_image: string,
        layout_name: string,
        action_type: string,
        process_id: number,
        layout_type: string,
        storedProc: string,
        url_api: string,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcLayoutTemplateAction',
            {
                layout_id,
                layout_image,
                layout_name,
                action_type,
                process_id,
                layout_type,
                storedProc,
                url_api,
                action,
            }
        );
    }

    //#region api request
    Prc_ProjectGetRequest(
        project_id: number,
        prc_id: number,
        created_date_from: number,
        created_date_to: number,
        action_status: string,
        uuid: any,
        emp_id: number,
        manager_id: number
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Prc_ProjectGetRequest',
            {
                project_id,
                prc_id,
                created_date_from,
                created_date_to,
                action_status,
                uuid,
                emp_id,
                manager_id,
            }
        );
    }
    Prc_ProjectGetRequestDetail(project_id: number, request_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Prc_ProjectGetRequestDetail',
            {
                project_id,
                request_id,
            }
        );
    }
    Prc_ProjectExplanationDetail(project_id: number, request_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Prc_ProjectExplanationDetail',
            {
                project_id,
                request_id,
            }
        );
    }
    //#endregion
    //#region PrcRegisterWorkingplan
    PrcRegisterWorkingplan(
        project_id: number,
        transaction_uuid: string,
        prc_id: number,
        step_id: number,
        action_id: number,
        note: string,
        data: any
    ) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'PrcRegisterWorkingplan',
            {
                project_id,
                transaction_uuid,
                prc_id,
                step_id,
                action_id,
                note,
                data,
            }
        );
    }
    Prc_AddPlan_GetTemplate(project_id: number, type: number) {
        const body = {
            project_id,
            type,
        };
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(
                this.api_EWO_Attendance + 'Prc_Working_Plan_GetTemplate',
                body,
                options
            )
            .subscribe((response: any) => {
                this.saveFile(response, '.xlsx', 'Prc_AddPlan_GetTemplate');
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
    prc_working_plan_importdata(
        formDataUpload: FormData,
        project_id: number,
        type: number,
        transaction_uuid: string,
        prc_id: number,
        step_id: number
    ) {
        formDataUpload.append('project_id', project_id.toString());
        formDataUpload.append('type', type.toString());
        formDataUpload.append('transaction_uuid', transaction_uuid.toString());
        formDataUpload.append('prc_id', prc_id.toString());
        formDataUpload.append('step_id', step_id.toString());
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Prc_Working_Plan_import',
            formDataUpload
        );
    }
}
