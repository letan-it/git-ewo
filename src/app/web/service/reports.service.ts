import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    constructor(private httpClient: HttpClient) {}
    // Methods for the encrypt and decrypt Using AES
    private apiUrl = environment.apiUrl + 'Reports/';
    private api_EWO_Attendance = environment.api_EWO_Attendance + 'Reports/';
    private api_EWO_Survey = environment.api_EWO_Survey + 'Reports/';

    imageEmp: any = [];

    ewo_ReportGetList(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        shop_name: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string,
        survey_list: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ReportGetList', {
            rowPerPage,
            pageNumber,
            project_id,
            employee_id,
            report_status,
            from_date,
            to_date,
            shop_code,
            shop_name,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            is_test,
            manager_id,
            uuid,
            survey_list,
        });
    }

    Report_list_GetList(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.apiUrl + 'Report_list_GetList', body);
    }
    Report_CheckKpi(report_id: number) {
        const body = new FormData();
        body.append('report_id', report_id.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_ReportCheckKpi', body);
    }
    Report_project_Action(
        project_id: number,
        report_id: number,
        status: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Report_project_Action', {
            project_id,
            report_id,
            status,
        });
    }

    Report_WKP_Action(project_id: number, id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Report_WKP_Action',
            {
                project_id,
                id,
            }
        );
    }

    Report_permission_GetList(project_id: number, employee_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('employee_id', employee_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'Report_permission_GetList',
            body
        );
    }
    Report_permission_Action(
        project_id: number,
        report_id: number,
        employee_id: number,
        status: number
    ) {
        return this.httpClient.post(this.apiUrl + 'Report_permission_Action', {
            project_id,
            report_id,
            employee_id,
            status,
        });
    }

    ewo_ReportGetList_Survey(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string,
        survey_list: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ReportGetList_Survey', {
            rowPerPage,
            pageNumber,
            project_id,
            employee_id,
            from_date,
            to_date,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            is_test,
            manager_id,
            uuid,
            survey_list,
        });
    }
    ewo_ReportGetList_Promotion(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ReportGetList_Promotion',
            {
                rowPerPage,
                pageNumber,
                project_id,
                employee_id,
                report_status,
                from_date,
                to_date,
                shop_code,
                customer_shop_code,
                project_shop_code,
                shop_type_id,
                province_id,
                district_id,
                ward_id,
                channel_id,
                router_id,
                is_test,
                manager_id,
                uuid,
            }
        );
    }
    ewo_ReportGetList_OSA(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ReportGetList_OSA', {
            rowPerPage,
            pageNumber,
            project_id,
            employee_id,
            report_status,
            from_date,
            to_date,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            is_test,
            manager_id,
            uuid,
        });
    }
    ewo_ReportGetList_SOS(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ReportGetList_SOS', {
            rowPerPage,
            pageNumber,
            project_id,
            employee_id,
            report_status,
            from_date,
            to_date,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            is_test,
            manager_id,
            uuid,
        });
    }
    ewo_ReportGetList_POSM(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ReportGetList_POSM', {
            rowPerPage,
            pageNumber,
            project_id,
            employee_id,
            report_status,
            from_date,
            to_date,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            is_test,
            manager_id,
            uuid,
        });
    }
    ewo_ReportGetList_ATTENDANCE(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ReportGetList_ATTENDANCE',
            {
                rowPerPage,
                pageNumber,
                project_id,
                employee_id,
                report_status,
                from_date,
                to_date,
                shop_code,
                customer_shop_code,
                project_shop_code,
                shop_type_id,
                province_id,
                district_id,
                ward_id,
                channel_id,
                router_id,
                is_test,
                manager_id,
                uuid,
            }
        );
    }
    ewo_ReportGetList_OOL(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ReportGetList_OOL', {
            rowPerPage,
            pageNumber,
            project_id,
            employee_id,
            report_status,
            from_date,
            to_date,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            is_test,
            manager_id,
            uuid,
        });
    }

    ewo_ReportGetList_SELLOUT(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ReportGetList_SELLOUT', {
            rowPerPage,
            pageNumber,
            project_id,
            employee_id,
            report_status,
            from_date,
            to_date,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            is_test,
            manager_id,
            uuid,
        });
    }
    ewo_ReportGetList_SELLIN(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ReportGetList_SELLIN', {
            rowPerPage,
            pageNumber,
            project_id,
            employee_id,
            report_status,
            from_date,
            to_date,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            is_test,
            manager_id,
            uuid,
        });
    }

    ewo_ReportGetList_ACTIVATION(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ReportGetList_ACTIVATION',
            {
                rowPerPage,
                pageNumber,
                project_id,
                employee_id,
                report_status,
                from_date,
                to_date,
                shop_code,
                customer_shop_code,
                project_shop_code,
                shop_type_id,
                province_id,
                district_id,
                ward_id,
                channel_id,
                router_id,
                is_test,
                manager_id,
                uuid,
            }
        );
    }

    ewo_ReportGetList_INVENTORY(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ReportGetList_INVENTORY',
            {
                rowPerPage,
                pageNumber,
                project_id,
                employee_id,
                report_status,
                from_date,
                to_date,
                shop_code,
                customer_shop_code,
                project_shop_code,
                shop_type_id,
                province_id,
                district_id,
                ward_id,
                channel_id,
                router_id,
                is_test,
                manager_id,
                uuid,
            }
        );
    }

    ewo_ReportGetList_COACHING(
        rowPerPage: number,
        pageNumber: number,
        project_id: number,
        employee_id: number,
        field_type: number,
        confirm_result: number,
        confirm_note: string,
        report_status: number,
        from_date: number,
        to_date: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        is_test: number,
        manager_id: number,
        uuid: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ReportGetList_COACHING',
            {
                rowPerPage,
                pageNumber,
                project_id,
                employee_id,
                field_type,
                confirm_result,
                confirm_note,
                report_status,
                from_date,
                to_date,
                shop_code,
                customer_shop_code,
                project_shop_code,
                shop_type_id,
                province_id,
                district_id,
                ward_id,
                channel_id,
                router_id,
                is_test,
                manager_id,
                uuid,
            }
        );
    }

    ew_ATT_getItem(project_id: number, report_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'ew_ATT_getItem',
            {
                project_id,
                report_id,
            }
        );
    }
    ew_ATT_getItem_Shift(project_id: number, report_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'ew_ATT_getItem_Shift',
            {
                project_id,
                report_id,
            }
        );
    }
    ASO_Report_SummaryQC(
        project_id: number,
        year_month: number,
        is_test: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ASO_Report_SummaryQC', {
            project_id,
            year_month,
            is_test,
        });
    }
    ewo_Survey_getItem(project_id: number, report_id: number) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_getItem',
            {
                project_id,
                report_id,
            }
        );
    }

    ewo_Survey_getItem_Survey(
        project_id: number,
        report_id: number,
        survey_result_id: number
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_getItem_Survey',
            {
                project_id,
                report_id,
                survey_result_id,
            }
        );
    }

    ewo_Report_Action(action: string, report_id: number, value: any) {
        return this.httpClient.post(this.apiUrl + 'ewo_Report_Action', {
            action,
            report_id,
            value,
        });
    }

    ewo_Report_Status_GetList(
        project_id: number,
        report_status_type: string,
        report_status_name: string,
        report_desc: string,
        status: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Report_Status_GetList', {
            project_id,
            report_status_type,
            report_status_name,
            report_desc,
            status,
        });
    }

    ewo_Report_Status_Action(
        project_id: number,
        report_status_id: number,
        report_status_type: string,
        report_status_name: string,
        report_desc: string,
        status: boolean,
        order: any,
        color: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Report_Status_Action', {
            project_id,
            report_status_id,
            report_status_type,
            report_status_name,
            report_desc,
            status,
            order,
            color,
            action,
        });
    }

    ewo_Report_Status_Clone(project_id: number, project_id_clone: number) {
        return this.httpClient.post(this.apiUrl + 'ewo_Report_Status_Clone', {
            project_id,
            project_id_clone,
        });
    }

    ewo_Report_Status_Clone_Audit(
        project_id: number,
        project_id_clone: number,
        report_status_id: any
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_Report_Status_Clone_Audit',
            {
                project_id,
                project_id_clone,
                report_status_id,
            }
        );
    }

    Report_ATDImage_Action(url: string, atd_id: number) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Report_ATDImage_Action',
            {
                url,
                atd_id,
            }
        );
    }
    Report_ATD_ChooseImageEmployee(id: number, url: string, table: string) {
        return this.httpClient.post(
            this.api_EWO_Attendance + 'Report_ATD_ChooseImageEmployee',
            {
                url,
                id,
                table,
            }
        );
    }
    ewo_GetImageAll(UUID: string) {
        const body = new FormData();
        body.append('UUID', UUID);
        return this.httpClient.post(
            environment.apiUrl + 'Publish/' + 'ewo_GetImageAll',
            body
        );
    }
    ewo_ShopCheckResult_GetList(project_id: number, report_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('report_id', report_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_ShopCheckResult_GetList',
            body
        );
    }
}
