import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PromotionService {
    constructor(private httpClient: HttpClient) {}

    private apiUrl = environment.api_EWO_DISPLAY + 'Display/';

    Promotion_GetList(
        project_id: number,
        promotion_Code: string,
        promotion_group: string,
        promotion_name: string,
        survey: number,
        status: number,
        product: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_GetList', {
            project_id,
            promotion_Code,
            promotion_group,
            promotion_name,
            survey,
            status,
            product,
            rowPerPage,
            pageNumber,
        });
    }

    Promotion_Action(
        project_id: number,
        promotion_id: number,
        promotion_code: string,
        promotion_group: string,
        promotion_name: string,
        description: string,
        desc_image: string,
        status: number,
        add_product: number,
        product_survey_form: number,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_Action', {
            project_id,
            promotion_id,
            promotion_code,
            promotion_group,
            promotion_name,
            description,
            desc_image,
            status,
            add_product,
            product_survey_form,
            action,
        });
    }

    Promotion_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        // return this.httpClient.post(this.apiUrl + 'Promotion_GetTemplate', body);

        const url = this.apiUrl + 'Promotion_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, 'TemplateImportDataPromotion');
            });
    }

    Promotion_Clone(
        project_id: number,
        promotion_id: number,
        promotion_code: string,
        promotion_name: string
    ) {
        console.log(project_id, promotion_id, promotion_code, promotion_name);
        return this.httpClient.post(this.apiUrl + 'Promotion_Clone', {
            project_id,
            promotion_id,
            promotion_code,
            promotion_name,
        });
    }

    Promotion_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'Promotion_ImportData',
            formDataUpload
        );
    }
    Promotion_Shop_GetList(
        project_id: number,
        year_month: number,
        promotion_id: any,
        shop_code: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_Shop_GetList', {
            project_id,
            year_month,
            promotion_id,
            shop_code,
            rowPerPage,
            pageNumber,
        });
    }
    Promotion_Shop_Action(
        project_id: number,
        year_month: number,
        promotion_id: number,
        shop_code: string,
        target: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_Shop_Action', {
            project_id,
            year_month,
            promotion_id,
            shop_code,
            target,
        });
    }

    Promotion_item_product_Action(
        project_id: number,
        promotion_id: number,
        data_form_survey: number,
        product_code: string,
        min_data: number,
        max_data: number,
        product_target: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'Promotion_item_product_Action',
            {
                project_id,
                promotion_id,
                data_form_survey,
                product_code,
                min_data,
                max_data,
                product_target,
                action,
            }
        );
    }

    Promotion_item_survey_Action(
        project_id: number,
        promotion_id: number,
        data_form_survey: number,
        min_data: number,
        max_data: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'Promotion_item_survey_Action',
            {
                project_id,
                promotion_id,
                data_form_survey,
                min_data,
                max_data,
                action,
            }
        );
    }

    Promotion_item_GetList(project_id: number, promotion_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('promotion_id', promotion_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'Promotion_item_GetList',
            body
        );
    }

    saveFile(response: any, file_name: string = '') {
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
            '.xlsx';

        saveAs(response, filename);
    }
    // export

    Promotion_RawData(
        project_id: number,
        promotion_Code: string,
        promotion_group: string,
        promotion_name: string,
        survey: number,
        status: number,
        product: number
    ) {
        const url = this.apiUrl + 'Promotion_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };
        const requestBody = {
            project_id,
            promotion_Code,
            promotion_group,
            promotion_name,
            survey,
            status,
            product,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, 'promotion');
            });
    }

    Promotion_Shop_RawData(
        project_id: number,
        year_month: number,
        shop_code: string
    ) {
        const request = {
            project_id,
            year_month,
            shop_code,
        };
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(this.apiUrl + 'Promotion_Shop_RawData', request, options)
            .subscribe((res: any) => {
                this.saveFile(res, 'promotion_shop');
            });
    }

    Promotion_Shop_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'Promotion_Shop_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, 'Promotion_Shop_GetTemplate');
            });
    }
    Promotion_Shop_ImportData(
        formDataUpload: FormData,
        project_id: number,
        year_month: number
    ) {
        formDataUpload.append('project_id', project_id.toString());
        formDataUpload.append('year_month', year_month.toString());
        return this.httpClient.post(
            this.apiUrl + 'Promotion_Shop_ImportData',
            formDataUpload
        );
    }

    Promotion_result_GetList(project_id: number, report_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('report_id', report_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'Promotion_result_GetList',
            body
        );
    }

    Promotion_result_detail_file_Action(
        project_id: number,
        id: number,
        pr_item_id: number,
        pr_id: number,
        question_id: number,
        question_name: string,
        url: string,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'Promotion_result_detail_file_Action',
            {
                project_id,
                id,
                pr_item_id,
                pr_id,
                question_id,
                question_name,
                url,
                action,
            }
        );
    }

    Promotion_result_detail_Action(
        project_id: number,
        id: number,
        value_int: number,
        value_string: string,
        note: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'Promotion_result_detail_Action',
            {
                project_id,
                id,
                value_int,
                value_string,
                note,
            }
        );
    }

    Promotion_item_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'Promotion_item_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, 'Promotion_item_GetTemplate');
            });
    }

    Promotion_item_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'Promotion_item_ImportData',
            formDataUpload
        );
    }

    Promotion_result_UpdateQuestion(
        project_id: number,
        year_month: number,
        result: any
    ) {
        return this.httpClient.post(
            this.apiUrl + 'Promotion_result_UpdateQuestion',
            {
                project_id,
                year_month,
                result,
            }
        );
    }
    Promotion_UploadFile(promotion_id: number, formula_file_js: string) {
        const body = new FormData();
        body.append('promotion_id', promotion_id.toString());
        body.append('formula_file_js', formula_file_js.toString());
        return this.httpClient.post(this.apiUrl + 'Promotion_UploadFile', body);
    }

    Promotion_result_detail_Update(
        pr_id: number,
        pr_item_id: number,
        data: any
    ) {
        return this.httpClient.post(
            this.apiUrl + 'Promotion_result_detail_Update',
            {
                pr_id,
                pr_item_id,
                data,
            }
        );
    }
    Promotion_result_detail_JsonResult(project_id: number, pr_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('pr_id', pr_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'Promotion_result_detail_JsonResult',
            body
        );
    }
    Promotion_result_UpdateResult(
        project_id: number,
        pr_id: number,
        result: number,
        result_note: string,
        promotion_result: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'Promotion_result_UpdateResult',
            {
                project_id,
                pr_id,
                result,
                result_note,
                promotion_result,
            }
        );
    }
}
