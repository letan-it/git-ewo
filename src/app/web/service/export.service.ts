import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    constructor(private httpClient: HttpClient) {}
    private apiUrl = environment.apiUrl + 'Exports/';
    // promotion

    ewo_ExportEmployeeList(
        rowPerPage: number,
        pageNumber: number,
        employee_id: number,
        employee_code: string,
        employee_name: string,
        login_name: string,
        card_number: string,
        mobile: string,
        email: string,
        employee_type_id: number,
        manager_id: number,
        project_id: number
    ) {
        const url = this.apiUrl + 'ewo_ExportEmployeeList';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            rowPerPage,
            pageNumber,
            employee_id,
            employee_code,
            employee_name,
            login_name,
            card_number,
            mobile,
            email,
            employee_type_id,
            manager_id,
            project_id,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'employee');
            });
    }

    ewo_Products_GetList_Export(
        project_id: number,
        product_code: string,
        product_name: string,
        category_id: number,
        barcode: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        const url = this.apiUrl + 'ewo_Products_GetList_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            project_id,
            product_code,
            product_name,
            category_id,
            barcode,
            rowPerPage,
            pageNumber,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'products');
            });
    }

    Suppliers_GetList_Export(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'Suppliers_GetList_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'supplier');
            });
    }

    ewo_Categories_RawData(
        project_id: number,
        category: string,
        company: string,
        brand: string,
        packages: string,
        division: string,
        market: string
    ) {
        const url = this.apiUrl + 'ewo_Categories_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };
        const requestBody = {
            project_id,
            category,
            company,
            brand,
            packages,
            division,
            market,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'category');
            });
    }

    ewo_Categories_Export(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'ewo_Categories_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'category');
            });
    }

    ewo_ExportShopList(
        rowPerPage: number,
        pageNumber: number,
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_ExportShopList';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            rowPerPage,
            pageNumber,
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
            manager_id,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'shop');
            });
    }

    ShopInfo_byMonth_GetList_Export(
        project_id: number,
        shop_code: string,
        year_month: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        const url = this.apiUrl + 'ShopInfo_byMonth_GetList_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            project_id,
            shop_code,
            year_month,
            rowPerPage,
            pageNumber,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'shopinfo');
            });
    }

    ewo_ExportShop(name: string) {
        const url = this.apiUrl + name;
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient.get(url, options).subscribe((response) => {
            this.saveFile(response, '.xlsx', 'shop');
        });
    }
    ewo_ShopTypes_List(project_id: any) {
        const requestBody = new FormData();
        requestBody.append('project_id', project_id.toString());

        const url = this.apiUrl + 'ewo_ShopTypes_List';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'ewo_ShopTypes_List');
            });
    }

    ewo_ATD_ExportPlan(
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
        manager_id: number,
        year_month: number
    ) {
        const url = this.apiUrl + 'ewo_ATD_ExportPlan';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            year_month,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'atd');
            });
    }

    ewo_SurveyShop_Export(
        year_month: number,
        survey_id: number,
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
        const url = this.apiUrl + 'ewo_SurveyShop_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            year_month,
            survey_id,
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'survey_shop');
            });
    }

    ewo_Survey_Export(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'ewo_Survey_Export';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'survey');
            });
    }
    ASO_Report_SummaryQC(
        project_id: number,
        year_month: number,
        is_test: number
    ) {
        const url = this.apiUrl + 'ASO_Report_SummaryQC';
        const options = {
            responseType: 'blob' as 'json',
        };
        const requestBody = {
            project_id,
            year_month,
            is_test,
        };
        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'ASO_Report_SummaryQC');
            });
    }

    ewo_Report_GetRawData(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report');
            });
    }
    ewo_Report_GetRawData_OSA(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_OSA';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_osa');
            });
    }
    ewo_Report_GetRawData_OOL(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_OOL';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_OOL');
            });
    }
    ewo_Report_GetRawData_POSM(
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
        manager_id: number
        // survey_id: number,
        // promotion_id: number,
        // uuid: string,
        // survey_list: string
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_POSM';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            // survey_id,
            // promotion_id,
            // uuid,
            // survey_list
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_POSM');
            });
    }

    ewo_Report_GetRawData_Mirinda(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_Mirinda';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_Mirinda');
            });
    }

    ReportSummaryTheWeekly_JSE(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ReportSummaryTheWeekly_JSE';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'ReportSummaryTheWeekly_JSE');
            });
    }

    ReportSummaryTheWeekly_Manager_JSE(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ReportSummaryTheWeekly_Manager_JSE';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'ReportSummaryTheWeekly_JSE');
            });
    }

    ewo_Report_GetRawData_INVENTORY(
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
        manager_id: number
        // survey_id: number,
        // promotion_id: number,
        // uuid: string,
        // survey_list: string
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_INVENTORY';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            // survey_id,
            // promotion_id,
            // uuid,
            // survey_list
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_INVENTORY');
            });
    }

    ewo_Report_GetRawData_SOS(
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
        manager_id: number
        // survey_id: number,
        // promotion_id: number,
        // uuid: string
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_SOS';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            // survey_id,
            // promotion_id,
            // uuid,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_SOS');
            });
    }

    ewo_Report_GetRawData_JSE(
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
        survey_id: number,
        promotion_id: number,
        uuid: string
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_JSE';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            survey_id,
            promotion_id,
            uuid,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_JSE');
            });
    }

    ewo_Report_GetRawData_COACHING(
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
        survey_id: number
        // promotion_id: number,
        // uuid: string,
        // survey_list: string
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_COACHING';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            survey_id,
            // promotion_id,
            // uuid,
            // survey_list
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_COACHING');
            });
    }

    Report_Attendance_JTI(
        project_id: number,
        from_date: number,
        to_date: number
    ) {
        const url = this.apiUrl + 'Report_Attendance_JTI';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            project_id,
            from_date,
            to_date,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'Report_Attendance_JSE');
            });
    }
    ewo_Report_GetRawData_Attendance(
        project_id: number,
        from_date: number,
        to_date: number
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_Attendance';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            project_id,
            from_date,
            to_date,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'report_Attendance');
            });
    }
    ewo_ReportSurvey_GetRawData(
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
        survey_id: number
    ) {
        const url = this.apiUrl + 'ewo_ReportSurvey_GetRawData';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            survey_id,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'reportSurvey');
            });
    }

    ewo_ReportDisplay_GetRawData(
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
        promotion_id: number
    ) {
        const url = this.apiUrl + 'ewo_ReportDisplay_GetRawData';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            promotion_id,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'reportDisplay');
            });
    }

    ewo_ReportSellOut_GetRawData(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_ReportSellOut_GetRawData';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'reportSellOut');
            });
    }

    ewo_ReportSellIn_GetRawData(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_ReportSellIn_GetRawData';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'reportSellIn');
            });
    }

    ewo_Report_GetRawData_PPT_bySurvey(
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
        survey_id: number
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_PPT_bySurvey';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            survey_id,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.pptx', 'report');
            });
    }

    ewo_ATD_results_PP(
        project_id: number,
        from_date: number,
        to_date: number,
        report_id: string,
        manager_id: string,
        employee_id: string,
        shop_code: string,
        province_id: string
    ) {
        const url = this.apiUrl + 'ewo_ATD_results_PP';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
            project_id,
            from_date,
            to_date,
            report_id,
            manager_id,
            employee_id,
            shop_code,
            province_id,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.pptx', 'report_cico');
            });
    }

    ewo_ReportSurvey_GetRawData_model(
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
        survey_id: number
    ) {
        const url = this.apiUrl + 'ewo_ReportSurvey_GetRawData_model';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
            survey_id,
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, 'MODEL');
            });
    }

    ewo_Report_GetRawData_PPT(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_PPT';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.pptx', 'report');
            });
    }
    ewo_Report_GetRawData_PDF(
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
        manager_id: number
    ) {
        const url = this.apiUrl + 'ewo_Report_GetRawData_PDF';
        const options = {
            responseType: 'blob' as 'json',
        };

        const requestBody = {
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
        };

        return this.httpClient
            .post(url, requestBody, options)
            .subscribe((response) => {
                this.saveFile(response, '.pdf', 'report');
            });
    }

    ewo_Shop_Export(project_id: number, nameExport: string) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + nameExport;
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', nameExport);
            });
    }

    ewo_Employee_Export(project_id: number, nameExport: string) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + nameExport;
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', nameExport);
            });
    }

    ewo_Report_Status_RawData(
        project_id: number,
        report_status_type: string,
        report_status_name: string,
        report_desc: string,
        status: number
    ) {
        const url = this.apiUrl + 'ewo_Report_Status_RawData';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(
                url,
                {
                    project_id,
                    report_status_type,
                    report_status_name,
                    report_desc,
                    status,
                },
                options
            )
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'ReportStatus');
            });
    }

    ewo_Master_RawData(
        project_id: number,
        listCode: string,
        table: string,
        code: string,
        status: number
    ) {
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(
                this.apiUrl + 'ewo_Master_RawData',
                {
                    project_id,
                    listCode,
                    table,
                    code,
                    status,
                },
                options
            )
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'ewo_Master_RawData');
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
