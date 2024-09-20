import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OsaService {
    constructor(private httpClient: HttpClient) {}
    private api_EWO_OSA = environment.api_EWO_OSA + 'OSA/';
    Product_formula_GetList(project_id: number, year_month: number) {
        return this.httpClient.post(
            this.api_EWO_OSA + 'Product_formula_GetList',
            {
                project_id,
                year_month,
            }
        );
    }
    File_formula_GetList(project_id: number, year_month: number) {
        return this.httpClient.post(this.api_EWO_OSA + 'File_formula_GetList', {
            project_id,
            year_month,
        });
    }
    Product_formula_Action(
        project_id: number,
        year_month: number,
        product_code: string,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_OSA + 'Product_formula_Action',
            {
                project_id,
                year_month,
                product_code,
                action,
            }
        );
    }
    File_formula_Action(
        project_id: number,
        year_month: number,
        formular: string,
        formular_note: string
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'File_formula_Action', {
            project_id,
            year_month,
            formular,
            formular_note,
        });
    }
    Product_formula_DownloadFile(project_id: number, year_month: number) {
        const url = this.api_EWO_OSA + 'Product_formula_DownloadFile';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(
                url,
                {
                    project_id,
                    year_month,
                },
                options
            )
            .subscribe((response) => {
                this.saveFile(
                    response,
                    '.xlsx',
                    'Product_formula_DownloadFile'
                );
            });
    }

    GetOSA_Reason(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.api_EWO_OSA + 'GetOSA_Reason', body);
    }

    GetOSA_form(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.api_EWO_OSA + 'GetOSA_form', body);
    }

    OSA_form_Action(
        project_id: number,
        quantity: number,
        price: number,
        oos: number,
        ooc: number,
        facing: number,
        add_product: number
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'OSA_form_Action', {
            project_id,
            quantity,
            price,
            oos,
            ooc,
            facing,
            add_product,
        });
    }

    OSA_ReasonAction(
        reason_id: number,
        project_id: number,
        reason_name: string,
        action: string,
        status: number
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'OSA_ReasonAction', {
            reason_id,
            project_id,
            reason_name,
            action,
            status,
        });
    }

    OSA_Shop_GetList(
        project_id: number,
        year_month: number,
        product_id: number,
        shop_code: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'OSA_Shop_GetList', {
            project_id,
            year_month,
            product_id,
            shop_code,
            rowPerPage,
            pageNumber,
        });
    }

    // https://localhost:32770/api/OSA/OSA_Shop_Export

    OSA_Shop_Export(
        project_id: number,
        year_month: number,
        product_id: number,
        shop_code: string
    ) {
        const url = this.api_EWO_OSA + 'OSA_Shop_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            project_id,
            year_month,
            product_id,
            shop_code,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'OSA_Shop');
            });
    }

    OSA_Shop_RawData(
        project_id: number,
        year_month: number,
        shop_code: string
    ) {
        const url = this.api_EWO_OSA + 'OSA_Shop_RawData';
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
                this.saveFile(response, '.xlsx', 'OSA_Shop');
            });
    }

    OSA_Reason_Export(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.api_EWO_OSA + 'OSA_Reason_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'OSA_Reason');
            });
    }

    OSA_Shop_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.api_EWO_OSA + 'OSA_Shop_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'OSA_SHOP_Template');
            });
    }

    OSA_Shop_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.api_EWO_OSA + 'OSA_Shop_ImportData',
            formDataUpload
        );
    }
    CreateFormular(formDataUpload: FormData) {
        return this.httpClient.post(
            this.api_EWO_OSA + 'CreateFormular',
            formDataUpload
        );
    }

    // GetOSA_formula
    // GetOSA_formula(project_id: number) {
    //     const body = new FormData();
    //     body.append('project_id', project_id.toString());
    //     return this.httpClient.post(this.api_EWO_OSA + 'GetOSA_formula', body);
    // }

    GetOSA_formula(project_id: number, year_month: number) {
        return this.httpClient.post(this.api_EWO_OSA + 'GetOSA_formula', {
            project_id,
            year_month,
        });
    }

    OSA_formula_Action(
        project_id: number,
        osA_formula_id: number,
        year_month: number,
        formula_file: string,
        action: string
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'OSA_formula_Action', {
            project_id,
            osA_formula_id,
            year_month,
            formula_file,
            action,
        });
    }

    OSA_result_GetItem(report_id: number, project_id: number) {
        return this.httpClient.post(this.api_EWO_OSA + 'OSA_result_GetItem', {
            report_id,
            project_id,
        });
    }

    OSA_image_Action(
        osa_result_id: number,
        uuid: string,
        url: string,
        product_id: number,
        product_name: string,
        year_month: number,
        guid: string
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'OSA_image_Action', {
            osa_result_id,
            uuid,
            url,
            product_id,
            product_name,
            year_month,
            guid,
        });
    }
    // int user_login, int project_id, int id, int oos, int? oos_reason_id, int ooc, int? quantity, int? price, string? note, string action
    OSA_Detail_Action(
        project_id: number,
        id: number,
        oos: number,
        oos_reason_id: number,
        ooc: number,
        quantity: number,
        price: number,
        facing: number,
        note: string,
        action: string
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'OSA_Detail_Action', {
            project_id,
            id,
            oos,
            oos_reason_id,
            ooc,
            quantity,
            price,
            facing,
            note,
            action,
        });
    }
    Call_FormularReport(
        project_id: number,
        report_id: number,
        osa_id: number,
        year_month: number
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'Call_FormularReport', {
            project_id,
            report_id,
            osa_id,
            year_month,
        });
    }
    OSA_Shop_Action(
        project_id: number,
        year_month: number,
        product_id: number,
        shop_code: string,
        target: number
    ) {
        return this.httpClient.post(this.api_EWO_OSA + 'OSA_Shop_Action', {
            project_id,
            year_month,
            product_id,
            shop_code,
            target,
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
