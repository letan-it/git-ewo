import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OolService {
    constructor(private httpClient: HttpClient) {}
    // https://ool-api.acacy.vn/api/OOL/OOL_Target_GetList
    private api_EWO_OOL = environment.api_EWO_OOL + 'OOL/';

    // OOL_TARGET
    OOL_Target_GetList(
        project_id: number,
        year_month: number,
        shop_code: string,
        ool_id: string,
        target_type: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.api_EWO_OOL + 'OOL_Target_GetList', {
            project_id,
            year_month,
            shop_code,
            ool_id,
            target_type,
            rowPerPage,
            pageNumber,
        });
    }

    OOL_Target_Action(
        project_id: number,
        year_month: number,
        shop_code: string,
        ool_id: string,
        target: number,
        target_type: number
    ) {
        return this.httpClient.post(this.api_EWO_OOL + 'OOL_Target_Action', {
            project_id,
            year_month,
            shop_code,
            ool_id,
            target,
            target_type,
        });
    }

    OOL_Target_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        const url = this.api_EWO_OOL + 'OOL_Target_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, 'OOL_Target_GetTemplate');
            });
    }

    OOL_Target_ImportData(
        formDataUpload: FormData,
        project_id: number,
        year_month: number
    ) {
        formDataUpload.append('project_id', project_id.toString());
        formDataUpload.append('year_month', year_month.toString());
        return this.httpClient.post(
            this.api_EWO_OOL + 'OOL_Target_ImportData',
            formDataUpload
        );
    }

    OOL_Target_RawData(
        project_id: number,
        year_month: number,
        shop_code: string,
        ool_id: string,
        target_type: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        const url = this.api_EWO_OOL + 'OOL_Target_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };
        const request = {
            project_id,
            year_month,
            shop_code,
            ool_id,
            target_type,
            rowPerPage,
            pageNumber,
        };
        return this.httpClient
            .post(url, request, options)
            .subscribe((response) => {
                this.saveFile(response, 'OOL_Target_RawData');
            });
    }

    // OOL_LIST
    OOL_List_GetList(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.api_EWO_OOL + 'OOL_List_GetList',
            body
        );
    }

    OOL_List_Action(
        project_id: number,
        ool_id: number,
        ool_type: number,
        ool_name: string,
        ool_code: string,
        system_code: string,
        configuration: string,
        description: string,
        min_image: number,
        max_image: number,
        order: number,
        status: number,
        is_comment: number,
        action: string
    ) {
        return this.httpClient.post(this.api_EWO_OOL + 'OOL_List_Action', {
            project_id,
            ool_id,
            ool_type,
            ool_name,
            ool_code,
            system_code,
            configuration,
            description,
            min_image,
            max_image,
            order,
            status,
            is_comment,
            action,
        });
    }

    OOL_List_RawData(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        const url = this.api_EWO_OOL + 'OOL_List_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, 'OOL_List_RawData');
            });
    }

    // OOL_ITEM
    OOL_item_GetList(project_id: number, ool_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('ool_id', ool_id.toString());
        return this.httpClient.post(
            this.api_EWO_OOL + 'OOL_item_GetList',
            body
        );
    }

    OOL_item_Action(
        project_id: number,
        ool_item_id: number,
        ool_id: number,
        item_name: string,
        unit: string,
        is_allow: number,
        system_code: string,
        question_type: string,
        support_data: string,
        _typeOf: string,
        min_data: number,
        max_data: number,
        order: number,
        status: number,
        action: string
    ) {
        return this.httpClient.post(this.api_EWO_OOL + 'OOL_item_Action', {
            project_id,
            ool_item_id,
            ool_id,
            item_name,
            unit,
            is_allow,
            system_code,
            question_type,
            support_data,
            _typeOf,
            min_data,
            max_data,
            order,
            status,
            action,
        });
    }

    // OOL_ITEM_ANSWER
    OOL_item_answers_GetList(project_id: number, ool_item_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('ool_item_id', ool_item_id.toString());
        return this.httpClient.post(
            this.api_EWO_OOL + 'OOL_item_answers_GetList',
            body
        );
    }

    OOL_item_answers_Action(
        project_id: number,
        ool_answer_id: number,
        ool_item_id: number,
        value: string,
        status: number,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_OOL + 'OOL_item_answers_Action',
            {
                project_id,
                ool_answer_id,
                ool_item_id,
                value,
                status,
                action,
            }
        );
    }

    OOL_item_Master(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.api_EWO_OOL + 'OOL_item_Master', body);
    }

    OOL_Results_GetList(project_id: number, report_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('report_id', report_id.toString());
        return this.httpClient.post(
            this.api_EWO_OOL + 'OOL_Results_GetList',
            body
        );
    }

    OOL_Detail_items_Action(
        project_id: number,
        id: number,
        value_string: string,
        value_int: number,
        value_decimal: number,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_OOL + 'OOL_Detail_items_Action',
            {
                project_id,
                id,
                value_string,
                value_int,
                value_decimal,
                action,
            }
        );
    }
    OOL_Detail_items_MultiAction(
        ool_detail_id: number,
        layer: number,
        ool_item_id: number,
        ool_item_name: string,
        question_type: string,
        support_data: string,
        typeOf: string,
        data: any
    ) {
        return this.httpClient.post(
            this.api_EWO_OOL + 'OOL_Detail_items_MultiAction',
            {
                ool_detail_id,
                layer,
                ool_item_id,
                ool_item_name,
                question_type,
                support_data,
                typeOf,
                data,
            }
        );
    }

    OOL_Image_Action(
        project_id: number,
        id: number,
        ool_result_id: number,
        ool_detail_id: number,
        ool_id: number,
        url: string,
        action: string
    ) {
        return this.httpClient.post(this.api_EWO_OOL + 'OOL_Image_Action', {
            project_id,
            id,
            ool_result_id,
            ool_detail_id,
            ool_id,
            url,
            action,
        });
    }

    OOL_Detail_Action(project_id: number, id: number) {
        return this.httpClient.post(this.api_EWO_OOL + 'OOL_Detail_Action', {
            project_id,
            id,
        });
    }
    OOL_Detail_Clone(project_id: number, id: number) {
        return this.httpClient.post(this.api_EWO_OOL + 'OOL_Detail_Clone', {
            project_id,
            id,
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
