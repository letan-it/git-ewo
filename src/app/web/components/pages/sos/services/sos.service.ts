import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as saveAs from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class SosService {
    constructor(private httpClient: HttpClient) {}

    private api_EWO_SOS = environment.api_EWO_SOS + 'SOS/';

    // Config
    Config_SOS_GetList(project_id: number, fromdate: number, todate: number) {
        return this.httpClient.post(this.api_EWO_SOS + 'Config_SOS_GetList', {
            project_id,
            fromdate,
            todate,
        });
    }
    Config_SOS_Action(
        project_id: number,
        id: number,
        active_date: number,
        input_width: number,
        input_width_total: number,
        unit: string,
        input_foot: number,
        input_facing: number,
        image_result: number,
        image_by_item: number,
        action: string
    ) {
        return this.httpClient.post(this.api_EWO_SOS + 'Config_SOS_Action', {
            project_id,
            id,
            active_date,
            input_width,
            input_width_total,
            unit,
            input_foot,
            input_facing,
            image_result,
            image_by_item,
            action,
        });
    }

    // List
    Web_SOSList_GetList(
        project_id: number,
        sos_type: string,
        category_id: string,
        product_id: string,
        sos_code: string,
        sos_name: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.api_EWO_SOS + 'Web_SOSList_GetList', {
            project_id,
            sos_type,
            category_id,
            product_id,
            sos_code,
            sos_name,
            rowPerPage,
            pageNumber,
        });
    }

    Web_SOSList_Action(
        project_id: number,
        sos_id: number,
        sos_type: string,
        category_id: number,
        product_id: number,
        sos_code: string,
        sos_name: string,
        company: string,
        width: number,
        unit: string,
        order: number,
        action: string
    ) {
        return this.httpClient.post(this.api_EWO_SOS + 'Web_SOSList_Action', {
            project_id,
            sos_id,
            sos_type,
            category_id,
            product_id,
            sos_code,
            sos_name,
            company,
            width,
            unit,
            order,
            action,
        });
    }
    // Get Template
    SOS_List_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(this.api_EWO_SOS + 'Web_SOSList_GetTemplate', body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'Web_SOSList_GetTemplate');
            });
    }
    //Raw Data
    SOS_List_RawData(
        project_id: number,
        sos_type: string,
        category_id: string,
        product_id: string,
        sos_code: string,
        sos_name: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(
                this.api_EWO_SOS + 'Web_SOSList_RawData',
                {
                    project_id,
                    sos_type,
                    category_id,
                    product_id,
                    sos_code,
                    sos_name,
                    rowPerPage,
                    pageNumber,
                },
                options
            )
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'SOS_List');
            });
    }
    // Import Data
    SOS_List_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());

        return this.httpClient.post(
            this.api_EWO_SOS + 'Web_SOSList_ImportData',
            formDataUpload
        );
    }
    // Shop
    SOS_Shop_GetList(
        project_id: number,
        shop_code: string,
        sos_id: number,
        year_month: number,
        from_date: number,
        to_date: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.api_EWO_SOS + 'SOS_Shop_GetList', {
            project_id,
            shop_code,
            sos_id,
            year_month,
            from_date,
            to_date,
            rowPerPage,
            pageNumber,
        });
    }

    SOS_Shop_Action(
        project_id: number,
        shop_code: string,
        sos_id: number,
        year_month: number,
        from_date: number,
        to_date: number,
        target: number
    ) {
        return this.httpClient.post(this.api_EWO_SOS + 'SOS_Shop_Action', {
            project_id,
            shop_code,
            sos_id,
            year_month,
            from_date,
            to_date,
            target,
        });
    }

    // Import Data
    SOS_Shop_ImportData(
        formDataUpload: FormData,
        project_id: number,
        year_month: number,
        from_date: number,
        to_date: number
    ) {
        formDataUpload.append('project_id', project_id.toString());
        formDataUpload.append('year_month', year_month.toString());
        formDataUpload.append('from_date', from_date.toString());
        formDataUpload.append('to_date', to_date.toString());

        return this.httpClient.post(
            this.api_EWO_SOS + 'SOS_Shop_ImportData',
            formDataUpload
        );
    }

    // Get Template
    SOS_Shop_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(this.api_EWO_SOS + 'SOS_Shop_GetTemplate', body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'SOS_Shop_GetTemplate');
            });
    }

    //Raw Data
    SOS_Shop_RawData(
        project_id: number,
        year_month: number,
        shop_code: string
    ) {
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(
                this.api_EWO_SOS + 'SOS_Shop_RawData',
                {
                    project_id,
                    year_month,
                    shop_code,
                },
                options
            )
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'SOS_Shop');
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

    // Clone
    SOS_Shop_Clone(
        project_id: number,
        year_month_from: number,
        year_month_to: number
    ) {
        return this.httpClient.post(this.api_EWO_SOS + 'SOS_Shop_Clone', {
            project_id,
            year_month_from,
            year_month_to,
        });
    }

    // Result GetList
    Results_GetList(project_id: number, report_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('report_id', report_id.toString());

        return this.httpClient.post(this.api_EWO_SOS + 'Results_GetList', body);
    }

    // Details_Action
    Details_Action(project_id: number, id: number, width: number, total_width: number, foot: number, facing: number, note: string) {
        return this.httpClient.post(this.api_EWO_SOS + 'Details_Action', {
            project_id, id, width, total_width, foot, facing, note
        })
    }

    // Image Action
    Images_Action(project_id: number, id: number, result_id: number, image_type: string, sos_id: number, sos_name: string, image_url: string, action: string) {
        return this.httpClient.post(this.api_EWO_SOS + 'Images_Action', {
            project_id, id, result_id, image_type, sos_id, sos_name, image_url, action
        })
    }
}
