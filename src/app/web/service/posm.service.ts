import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PosmService {
    constructor(private httpClient: HttpClient) { }
    private api_EWO_POSM = environment.api_EWO_POSM + 'POSM/';

    GetPOSM_List(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.api_EWO_POSM + 'GetPOSM_List', body);
    }

    POSM_ListAction(
        project_id: number,
        posm_id: number,
        posm_code: string,
        posm_name: string,
        posm_image: string,
        action: string,
        status: number
    ) {
        return this.httpClient.post(this.api_EWO_POSM + 'POSM_ListAction', {
            project_id,
            posm_id,
            posm_code,
            posm_name,
            posm_image,
            action,
            status,
        });
    }
    POSM_Shop_Action(
        year_month: number,
        posm_id: number,
        shop_code: string,
        project_id: number,
        target: number

    ) {
        return this.httpClient.post(this.api_EWO_POSM + 'POSM_Shop_Action', {
            year_month,
            posm_id,
            shop_code,
            project_id,
            target
        });
    }

    GetPOSM_Reason(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.api_EWO_POSM + 'GetPOSM_Reason', body);
    }

    POSM_ReasonAction(
        reason_id: number,
        project_id: number,
        reason_name: string,
        action: string,
        status: number
    ) {
        return this.httpClient.post(this.api_EWO_POSM + 'POSM_ReasonAction', {
            reason_id,
            project_id,
            reason_name,
            action,
            status,
        });
    }

    POSMShop_GetList(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        year_month: number,
        posm_id: number,
        shop_code: string
    ) {
        return this.httpClient.post(this.api_EWO_POSM + 'POSMShop_GetList', {
            rowPerPage,
            pageNumber,
            project_id,
            year_month,
            posm_id,
            shop_code,
        });
    }

    // https://posm.ewoapi.acacy.com.vn/api/POSM/POSMShop_Export

    POSMShop_Export(project_id: number, year_month: number, shop_code: string) {
        const url = this.api_EWO_POSM + 'POSMShop_Export';
        const options = {
            responseType: 'blob' as 'json',
        };
        const requestBody = {
            project_id,
            year_month,
            shop_code,
        };
        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'POSMShop_Export');
            });
    }

    POSM_results_GetItem(project_id: number, report_id: number) {
        return this.httpClient.post(
            this.api_EWO_POSM + 'POSM_results_GetItem',
            {
                project_id,
                report_id,
            }
        );
    }

    POSMShop_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.api_EWO_POSM + 'POSMShop_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'POSMShop_GetTemplate');
            });
    }

    POSMShop_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.api_EWO_POSM + 'POSMShop_ImportData',
            formDataUpload
        );
    }


    Report_SurveyFile_Action(
        posm_result_id: number,
        uuid: string,
        url: string,
        posm_id: number,
        posm_name: string,
        year_month: number,
        posm_image_type: number
    ) {
        return this.httpClient.post(
            this.api_EWO_POSM + 'Report_POSMImage_Action',
            {
                posm_result_id,
                uuid,
                url,
                posm_id,
                posm_name,
                year_month,
                posm_image_type
            }
        );
    }

    POSM_Detail_Action(id: number, value: string, reason_id: number, column: string, note: string) {
        return this.httpClient.post(this.api_EWO_POSM + 'POSM_Detail_Action', {
            id,
            value,
            reason_id,
            column,
            note
        });
    }

    // POSM_Reason_Export
    POSM_Reason_Export(
        project_id: number
    ) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.api_EWO_POSM + 'POSM_Reason_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'POSM_Reason');
            });
    }

    POSM_results_SummaryPOSM( project_id: number, from_date: number, to_date: number,areas: string,
        province_id: string, shop_type_id: string,  manager_id: string, employee_id: string,posm_id: string ) {
        return this.httpClient.post(this.api_EWO_POSM + 'POSM_results_SummaryPOSM', { 
            project_id, from_date, to_date, areas, province_id,
            shop_type_id, manager_id, employee_id, posm_id
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

    error(error_response: any) {
        console.log(error_response);
    }


}
