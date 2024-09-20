import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StreamInvocationMessage } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import * as saveAs from 'file-saver';
import { from } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class WorkingPlansService {
    constructor(private httpClient: HttpClient) {}
    private apiUrl = environment.api_EWO_Attendance + 'WorkingPlans/';

    ewo_GetPlanSetup(
        rowPerPage: number,
        pageNumber: number,
        plan_date: number,
        employee_id: number,
        project_id: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        status: number,
        is_test: number,
        manager_id: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_GetPlanSetup', {
            rowPerPage,
            pageNumber,
            plan_date,
            employee_id,
            project_id,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            status,
            is_test,
            manager_id,
        });
    }
    ewo_GetPlanSetup_Table(
        rowPerPage: number,
        pageNumber: number,
        year_month: number,
        employee_id: number,
        project_id: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        status: number,
        is_test: number,
        manager_id: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_GetPlanSetup_Table', {
            rowPerPage,
            pageNumber,
            year_month,
            employee_id,
            project_id,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            status,
            is_test,
            manager_id,
        });
    }

    ewo_ATD_GetListShop_TimekeepingReport(
        rowPerPage: number,
        pageNumber: number,
        year_month: number,
        from_date: number,
        to_date: number,
        employee_id: number,
        project_id: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        position: string,
        status: number,
        is_test: number,
        manager_id: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ATD_GetListShop_TimekeepingReport', {
            rowPerPage,
            pageNumber,
            year_month,from_date, to_date,
            employee_id,
            project_id,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,position,
            status,
            is_test,
            manager_id,
        });
    }

    ewo_ATD_working_plan_Action(
        action: string,
        project_id: number,
        employee_id: number,
        shop_id: string,
        plan_date: number,
        shift_id: number,
        from_time: string,
        to_time: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ATD_working_plan_Action',
            {
                action,
                project_id,
                employee_id,
                shop_id,
                plan_date,
                shift_id,
                from_time,
                to_time,
            }
        );
    }

    ewo_ATD_working_plan_ActionPlan(
        action: string,
        project_id: number,
        employee_id: number,
        shop_code: string,
        startDate: number,
        endDate: number,
        shift_id: number,
        from_time: string,
        to_time: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ATD_working_plan_ActionPlan',
            {
                action,
                project_id,
                employee_id,
                shop_code,
                startDate,
                endDate,
                shift_id,
                from_time,
                to_time,
            }
        );
    }

    ewo_atd_working_plan_template_from_to_time(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(
                this.apiUrl + 'ewo_atd_working_plan_template_from_to_time',
                body,
                options
            )
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'Emp_Shops_GetTemplate');
            });
    }

    ewo_atd_working_plan_importdata(
        formDataUpload: FormData,
        project_id: number
    ) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_atd_working_plan_importdata',
            formDataUpload
        );
    }
    ewo_atd_working_plan_importdata_from_to_time(
        formDataUpload: FormData,
        project_id: number
    ) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_atd_working_plan_importdata_from_to_time',
            formDataUpload
        );
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
