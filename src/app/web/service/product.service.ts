import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    constructor(private httpClient: HttpClient) {}

    private apiUrl = environment.apiUrl + 'Product/';
    ProductBarCode_getbyitem(project_id: number, product_id: number) {
        return this.httpClient.post(this.apiUrl + 'ProductBarCode_getbyitem', {
            project_id,
            product_id,
        });
    }

    product_barcode_Action(
        project_id: number,
        product_id: number,
        product_barcode: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'product_barcode_Action', {
            project_id,
            product_id,
            product_barcode,
            action,
        });
    }

    ewo_Products_GetList(
        project_id: number,
        product_code: string,
        product_name: string,
        category_id: number,
        barcode: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Products_GetList', {
            project_id,
            product_code,
            product_name,
            category_id,
            barcode,
            rowPerPage,
            pageNumber,
        });
    }

    ewo_Products_GetListV2(
        project_id: number,
        product_code: string,
        product_name: string,
        category_id: number,
        barcode: string,
        groupcode: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Products_GetList', {
            project_id,
            product_code,
            product_name,
            category_id,
            barcode,
            groupcode,
            rowPerPage,
            pageNumber,
        });
    }

    Products_Action(
        project_id: number,
        product_id: number,
        product_code: string,
        product_name: string,
        category_id: number,
        image: string,
        price: number,
        order: number,
        unit: string,
        size: any,
        status: number,
        barcode: string,
        group_code: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'Products_Action', {
            project_id,
            product_id,
            product_code,
            product_name,
            category_id,
            image,
            price,
            order,
            unit,
            size,
            status,
            barcode,
            group_code,
            action,
        });
    }

    ewo_Products_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'ewo_Products_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '_TemplateImportDataProduct');
            });
    }

    ewo_Products_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_Products_ImportData',
            formDataUpload
        );
    }

    saveFile(response: any, title: any = '.xlsx', file_name: string = '', ) {
        const currentTime = new Date();
        const filename = 'download_' + file_name;
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

    // Group Code
    ewo_Product_Group_GetList(
        project_id: number,
        group_code: string,
        group_name: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Product_Group_GetList', {
            project_id,
            group_code,
            group_name,
            rowPerPage,
            pageNumber,
        });
    }

    ewo_Product_Group_Action(
        project_id: number,
        group_code: string,
        group_name: string,
        order: number,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Product_Group_Action', {
            project_id,
            group_code,
            group_name,
            order,
            action,
        });
    }

    ewo_Product_Group_RawData(
        project_id: number,
        group_code: string,
        group_name: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(
                this.apiUrl + 'ewo_Product_Group_RawData',
                {
                    project_id,
                    group_code,
                    group_name,
                    rowPerPage,
                    pageNumber,
                },
                options
            )
            .subscribe((response) => {
                this.saveFile(response, '.xlsx', 'Product_Group_RawData');
            });
    }

    ewo_Product_Group_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'ewo_Product_Group_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, '_TemplateProductGroup');
            });
    }

    ewo_Product_Group_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_Product_Group_ImportData',
            formDataUpload
        );
    }

    error(error_response: any) {
        console.log(error_response);
    }
}
