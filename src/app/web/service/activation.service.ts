import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ActivationService {
    constructor(private httpClient: HttpClient) {}

    private apiUrl = environment.api_EWO_Activation + 'Promotion/';
    private apiUrlActivation = environment.api_EWO_Activation + 'Activation/';
    private apiUrlGotIT = environment.api_EWO_Activation + 'GotIT/';

    MOBILE_web_GetSellOutReport(
        project_id: number,
        fromDate: number,
        toDate: number,
        action: string,
        UUID: any
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'MOBILE_web_GetSellOutReport',
            {
                project_id,
                fromDate,
                toDate,
                action,
                UUID,
            }
        );
    }

    MOBILE_web_GetSellOutReport_byLeader(
        project_id: number,
        fromDate: number,
        toDate: number,
        action: string,
        UUID: any,
        employee_id: number
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'MOBILE_web_GetSellOutReport_byLeader',
            {
                project_id,
                fromDate,
                toDate,
                action,
                UUID,
                employee_id,
            }
        );
    }
    MOBILE_web_GetSellOutReport_detailLeader(
        project_id: number,
        fromDate: number,
        toDate: number,
        action: string,
        UUID: any,
        employee_id: number
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'MOBILE_web_GetSellOutReport_detailLeader',
            {
                project_id,
                fromDate,
                toDate,
                action,
                UUID,
                employee_id,
            }
        );
    }

    activation_form_GetList(
        project_id: number,
        form_name: string,
        status: number,
        from_date: number,
        to_date: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'activation_form_GetList',
            {
                project_id,
                form_name,
                status,
                from_date,
                to_date,
                rowPerPage,
                pageNumber,
            }
        );
    }
    activation_form_Action(
        project_id: number,
        form_id: number,
        form_name: string,
        form_decription: string,
        configuration: string,
        status: number,
        from_date: number,
        to_date: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'activation_form_Action',
            {
                project_id,
                form_id,
                form_name,
                form_decription,
                configuration,
                status,
                from_date,
                to_date,
                action,
            }
        );
    }

    activation_form_RawData(
        project_id: number,
        form_name: string,
        status: number,
        from_date: number,
        to_date: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        const url = this.apiUrlActivation + 'activation_form_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };
        const requestBody = {
            project_id,
            form_name,
            status,
            from_date,
            to_date,
            rowPerPage,
            pageNumber,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, 'activation_form_RawData');
            });
    }

    activation_form_setting_GetList(project_id: number, form_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('form_id', form_id.toString());

        return this.httpClient.post(
            this.apiUrlActivation + 'activation_form_setting_GetList',
            body
        );
    }

    activation_form_setting_Action(
        project_id: number,
        id: number,
        form_id: number,
        type_form: string,
        survey_id: number,
        formula_file: number,
        status: number,
        orders: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'activation_form_setting_Action',
            {
                project_id,
                id,
                form_id,
                type_form,
                survey_id,
                formula_file,
                status,
                orders,
                action,
            }
        );
    }

    activation_form_setting_ActionV2(
        project_id: number,
        id: number,
        form_id: number,
        type_form: string,
        survey_id: number,
        formula_file: number,
        status: number,
        orders: number,
        action: string,
        action_type: string
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'activation_form_setting_ActionV2',
            {
                project_id,
                id,
                form_id,
                type_form,
                survey_id,
                formula_file,
                status,
                orders,
                action,
                action_type
            }
        );
    }

    activation_shop_GetList(
        project_id: number,
        activation_form: any,
        shop_code: string,
        status: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'activation_shop_GetList',
            {
                project_id,
                activation_form,
                shop_code,
                status,
                rowPerPage,
                pageNumber,
            }
        );
    }

    activation_shop_Action(
        project_id: number,
        activation_form: number,
        shop_code: string,
        status: number
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'activation_shop_Action',
            {
                project_id,
                activation_form,
                shop_code,
                status,
            }
        );
    }

    activation_shop_RawData(project_id: number, shop_code: string) {
        const request = {
            project_id,
            shop_code,
        };
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(
                this.apiUrlActivation + 'activation_shop_RawData',
                request,
                options
            )
            .subscribe((res: any) => {
                this.saveFile(res, 'activation_shop');
            });
    }

    Works_GetList(project_id: number, report_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('report_id', report_id.toString());
        return this.httpClient.post(
            this.apiUrlActivation + 'Works_GetList',
            body
        );
    }
    work_step_GetList(project_id: number, work_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('work_id', work_id.toString());
        return this.httpClient.post(
            this.apiUrlActivation + 'work_step_GetList',
            body
        );
    }

    work_item_GetList(
        project_id: number,
        work_id: number,
        work_item_id: number,
        key: string
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'work_item_GetList',
            {
                project_id,
                work_id,
                work_item_id,
                key,
            }
        );
    }

    promotion_getList(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrlActivation + 'promotion_getList',
            body
        );
    }
    gifts_getList_by_promotionId(promotion_id: number, project_id: number) {
        const body = new FormData();
        body.append('promotion_id', promotion_id.toString());
        body.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrlActivation + 'gifts_getList_by_promotionId',
            body
        );
    }

    work_gift_action_create(
        project_id: number,
        id: number,
        work_id: number,
        work_item_id: number,
        uuid: string,
        guid: string,
        gift_id: number,
        quantity: number,
        promotion_id: number,
        activation_form_id: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'work_gift_action_create',
            {
                project_id,
                id,
                work_id,
                work_item_id,
                uuid,
                guid,
                gift_id,
                quantity,
                promotion_id,
                activation_form_id,
                action,
            }
        );
    }
    work_file_Action(
        project_id: number,
        id: number,
        work_id: number,
        work_item_id: number,
        survey_id: number,
        question_id: number,
        question_name: string,
        url: string,
        activation_form_id: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'work_file_Action',
            {
                 project_id, id, work_id, work_item_id, survey_id, question_id, question_name, url, activation_form_id, action
            }
        );
    }
     

    Promotion_GetList(
        project_id: number,
        promotion_code: string,
        promotion_group: string,
        promotion_name: string,
        status: number,
        from_date: number,
        to_date: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_GetList', {
            project_id,
            promotion_code,
            promotion_group,
            promotion_name,
            status,
            from_date,
            to_date,
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
        from_date: number,
        to_date: number,
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
            from_date,
            to_date,
            action,
        });
    }

    Promotion_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

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

    Promotion_ImportData(
        formDataUpload: FormData,
        project_id: number,
        from_date: number,
        to_date: number
    ) {
        formDataUpload.append('project_id', project_id.toString());
        formDataUpload.append('from_date', from_date.toString());
        formDataUpload.append('to_date', to_date.toString());
        return this.httpClient.post(
            this.apiUrl + 'Promotion_ImportData',
            formDataUpload
        );
    }

    Promotion_Shop_GetList(
        project_id: number,
        promotion_id: any,
        shop_code: string,
        status: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_Shop_GetList', {
            project_id,
            promotion_id,
            shop_code,
            status,
            rowPerPage,
            pageNumber,
        });
    }

    Promotion_Shop_Action(
        project_id: number,
        promotion_id: number,
        shop_code: string,
        status: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_Shop_Action', {
            project_id,
            promotion_id,
            shop_code,
            status,
        });
    }

    Promotion_Shop_RawData(project_id: number, shop_code: string) {
        const request = {
            project_id,
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

    Promotion_gift_Action(
        project_id: number,
        promotion_gift_id: number,
        promotion_id: number,
        gift_code: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_gift_Action', {
            project_id,
            promotion_gift_id,
            promotion_id,
            gift_code,
            action,
        });
    }

    Promotion_product_Action(
        project_id: number,
        promotion_product_id: number,
        promotion_id: number,
        product_code: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'Promotion_product_Action', {
            project_id,
            promotion_product_id,
            promotion_id,
            product_code,
            action,
        });
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
        status: number,
        from_date: number,
        to_date: number,
        rowPerPage: number,
        pageNumber: number
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
            status,
            from_date,
            to_date,
            rowPerPage,
            pageNumber,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, 'promotion');
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
    Promotion_Shop_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
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
    Promotion_UploadFile(promotion_id: number, formula: string) {
        const body = new FormData();
        body.append('promotion_id', promotion_id.toString());
        body.append('formula', formula.toString());
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

    work_gift_Action(
        project_id: number,
        id: number,
        gift_id: number,
        quantity: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrlActivation + 'work_gift_Action',
            {
                project_id,
                id,
                gift_id,
                quantity,
                action,
            }
        );
    }

    // GotIT
    GotIT_config_GetList(
        project_id: number,
        authorization: string,
        prefix: string
    ) {
        return this.httpClient.post(this.apiUrlGotIT + 'GotIT_config_GetList', {
            project_id,
            authorization,
            prefix,
        });
    }

    GotIT_config_Action(
        project_id: number,
        authorization: string,
        prefix: string,
        url: string
    ) {
        return this.httpClient.post(this.apiUrlGotIT + 'GotIT_config_Action', {
            project_id,
            authorization,
            prefix,
            url,
        });
    }

    // SMS Content
    SMS_Content_GetList(
        project_id: number,
        mobile: string,
        brandname: string,
        content_SMS: string,
        send_time_int_from: number,
        send_time_int_to: number,
        content_type: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrlGotIT + 'SMS_Content_GetList', {
            project_id,
            mobile,
            brandname,
            content_SMS,
            send_time_int_from,
            send_time_int_to,
            content_type,
            rowPerPage,
            pageNumber,
        });
    }

    // Log API GOTIT
    GotIT_CallAPI_GetList(
        project_id: number,
        uuid: string,
        guid: string,
        url: string,
        employee_code: string,
        start_time: number,
        end_time: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(
            this.apiUrlGotIT + 'GotIT_CallAPI_GetList',
            {
                project_id,
                uuid,
                guid,
                url,
                employee_code,
                start_time,
                end_time,
                rowPerPage,
                pageNumber,
            }
        );
    }

    // activation_config_GetList
    activation_config_GetList(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        return this.httpClient.post(
            this.apiUrlActivation + 'activation_config_GetList',
            body
        );
    }

    // activation_config_Action
    activation_config_Action(project_id: number, check_inventory: number) {
        return this.httpClient.post(
            this.apiUrlActivation + 'activation_config_Action',
            {
                project_id,
                check_inventory,
            }
        );
    }
}
