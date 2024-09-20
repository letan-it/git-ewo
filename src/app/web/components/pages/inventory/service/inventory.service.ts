import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class InventoryService {
    constructor(private httpClient: HttpClient) { }

    private api_EWO_Inventory = environment.api_EWO_Inventory + 'Inven/';

    // Config
    Config_inventory_GetList(project_id: number, fromdate: number, todate: number) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Config_inventory_GetList', {
            project_id, fromdate, todate
        })
    }
    Config_inventory_Add(
        project_id: number,
        active_date: number,
        before_input: number,
        after_input: number,
        reason_input: number,
        add_Product: number,
        image_result: number,
        image_by_product: number
    ) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Config_inventory_Add', {
            project_id, active_date, before_input, after_input, reason_input, add_Product, image_result, image_by_product
        })
    }
    Config_inventory_Update(
        project_id: number,
        id: number,
        before_input: number,
        after_input: number,
        reason_input: number,
        add_Product: number,
        image_result: number,
        image_by_product: number,
        action: string,
    ) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Config_inventory_Update', {
            project_id, id, before_input, after_input, reason_input, add_Product, image_result, image_by_product, action
        })
    }

    // Reason
    Reasons_inventory_GetList(project_id: number, reason_name: string) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Reasons_inventory_GetList', {
            project_id, reason_name
        })
    }
    Reasons_inventory_Action(project_id: number, reason_id: number, reason_name: string, action: string) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Reasons_inventory_Action', {
            project_id, reason_id, reason_name, action
        })
    }

    // Shop
    Inventory_Shop_GetList(project_id: number, shop_code: string, product_id: number, year_month: number, from_date: number, to_date: number, rowPerPage: number, pageNumber: number) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Inventory_Shop_GetList', {
            project_id, shop_code, product_id, year_month, from_date, to_date, rowPerPage, pageNumber
        })
    }
    Inventory_Shop_Action(project_id: number, shop_code: string, product_id: number, year_month: number, from_date: number, to_date: number, target: number) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Inventory_Shop_Action', {
            project_id, shop_code, product_id, year_month, from_date, to_date, target
        })
    }

    // Import Data
    Inventory_Shop_ImportData(formDataUpload: FormData, project_id: number, year_month: number, from_date: number, to_date: number) {
        
        formDataUpload.append('project_id', project_id.toString());
        formDataUpload.append('year_month', year_month.toString());
        formDataUpload.append('from_date', from_date.toString());
        formDataUpload.append('to_date', to_date.toString());

        return this.httpClient.post(this.api_EWO_Inventory + 'Inventory_Shop_ImportData', formDataUpload)
    }

    // Get Template
    Inventory_Shop_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient.post(this.api_EWO_Inventory + 'Inventory_Shop_GetTemplate', body, options).subscribe((response) => {
            this.saveFile(response, '.xlsx', 'Inventory_Shop_GetTemplate');
        })
    }

    // Raw Data
    Inventory_Shop_RawData(project_id: number, year_month: number, shop_code: string) {
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient.post(this.api_EWO_Inventory + 'Inventory_Shop_RawData', {
            project_id, year_month, shop_code
        }, options).subscribe((response) => {
            this.saveFile(response, '.xlsx', 'Inventory_Shop');
        });
    }

    // Clone
    Inventory_Shop_Clone(project_id: number, year_month_from: number, year_month_to: number) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Inventory_Shop_Clone', {
            project_id, year_month_from, year_month_to
        })
    }

    // Details Action
    Details_Action(project_id: number, id: number, before_input: number, after_input: number, reason_input: number, note: string) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Details_Action', {
            project_id, id, before_input, after_input, reason_input, note
        })
    }

    // Images Action
    Images_Action(project_id: number, id: number, result_id: number, image_type: number, product_id: number, image_url: string, action: string) {
        return this.httpClient.post(this.api_EWO_Inventory + 'Images_Action', {
            project_id, id, result_id, image_type, product_id, image_url, action
        })
    }

    // Result GetList
    Results_GetList(project_id: number, report_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('report_id', report_id.toString());

        return this.httpClient.post(this.api_EWO_Inventory + 'Results_GetList', body)
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