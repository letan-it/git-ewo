import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as saveAs from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class EmpShopService {
    constructor(private httpClient: HttpClient) {}

    private api_Root = environment.apiUrl + 'Employee/';
    getList(
        project_id: number,
        emp_code: string,
        employee_type_id: number,
        shop_code: string,
        year_month: number,
        fromdate: number,
        todate: number,
        rowPerPage: number,
        pageNumber: number,
        isActive: number
    ) {
        return this.httpClient.post(this.api_Root + 'GetListEmpShops', {
            project_id,
            emp_code,
            employee_type_id,
            shop_code,
            year_month,
            fromdate,
            todate,
            rowPerPage,
            pageNumber,
            isActive,
        });
    }
    action(
        empShops_id: number,
        project_id: number,
        emp_id: string,
        shop_code: string,
        from_date: number,
        to_date: number,
        is_active: number,
        action: string
    ) {
        return this.httpClient.post(this.api_Root + 'Emp_Shops_Action', {
            empShops_id,
            project_id,
            emp_id,
            shop_code,
            from_date,
            to_date,
            is_active,
            action,
        });
    }

    // Get template
    Emp_Shops_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(this.api_Root + 'Emp_Shops_GetTemplate', body, options)
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'Emp_Shops_GetTemplate');
            });
    }

    // Raw data
    Emp_Shops_RawData(
        project_id: number,
        emp_code: string,
        employee_type_id: number | null,
        shop_code: any,
        from_date: number,
        to_date: number,
        rowPerPage: number,
        pageNumber: number,
        isActive: number
    ) {
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(
                this.api_Root + 'Emp_Shops_RawData',
                {
                    project_id,
                    emp_code,
                    employee_type_id,
                    shop_code,
                    from_date,
                    to_date,
                    rowPerPage,
                    pageNumber,
                    isActive,
                },
                options
            )
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'Emp_Shops');
            });
    }

    // Import Data
    Emp_Shops_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        // formDataUpload.append('year_month', year_month.toString());
        // formDataUpload.append('from_date', from_date.toString());
        // formDataUpload.append('to_date', to_date.toString());

        return this.httpClient.post(
            this.api_Root + 'Emp_Shops_ImportData',
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
