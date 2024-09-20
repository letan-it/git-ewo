import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ShopsService {
    constructor(private httpClient: HttpClient) { }
    private apiUrl = environment.apiUrl + 'Shops/';

    ewo_GetShopTypes() {
        return this.httpClient.get(this.apiUrl + 'ewo_GetShopTypes');
    }
    ewo_ShopTypes_List(project_id: any){
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_ShopTypes_List', body );
    }

    ewo_GetShopRouter() {
        return this.httpClient.get(this.apiUrl + 'ewo_GetShopRouter');
    }

    ewoGetShopList(
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
        manager_id: number,
        areas: string,
        supplier_id: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewoGetShopList', {
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
            areas,
            supplier_id
        });
    }

    ewo_Shop_Action(
        status: number,
        shop_code: string,
        shop_name: string,
        shop_address: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        latitude: number,
        longitude: number,
        contact_name: string,
        contact_mobile: string,
        check_location: number,
        radius: number,
        verify: number,
        action: string,
        created_from: string,
        image: string,
        image_logo: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Shop_Action', {
            status,
            shop_code,
            shop_name,
            shop_address,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            latitude,
            longitude,
            contact_name,
            contact_mobile,
            check_location,
            radius,
            verify,
            action,
            created_from,
            image,
            image_logo,
        });
    }
    ewo_Shop_Action_Audit(
        project_id: number,
        status: number,
        shop_code: string,
        project_shop_code: string,
        customer_shop_code: string,
        shop_name: string,
        shop_address: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        manager_id: number,
        latitude: number,
        longitude: number,
        contact_name: string,
        contact_mobile: string,
        check_location: number,
        radius: number,
        verify: number,
        sign_name: string,
        tax_code: string,
        action: string,
        created_from: string,
        image: string,
        image_logo: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Shop_Action_Audit', {
            project_id,
            status,
            shop_code,
            project_shop_code,
            customer_shop_code,
            shop_name,
            shop_address,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            manager_id,
            latitude,
            longitude,
            contact_name,
            contact_mobile,
            check_location,
            radius,
            verify,
            sign_name,
            tax_code,
            action,
            created_from,
            image,
            image_logo,
        });
    }

    // ROUTER

    ewo_ShopRouter_Action(
        status: number,
        router_code: string,
        router_name: string,
        router_type: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ShopRouter_Action', {
            status,
            router_code,
            router_name,
            router_type,
            action,
        });
    }

    ewo_ShopTypes_Action(
        status: number,
        shop_type_code: string,
        shop_type_name: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ShopTypes_Action', {
            status,
            shop_type_code,
            shop_type_name,
            action,
        });
    }

    ewo_Channels_Action(
        status: number,
        channel_code: string,
        channel_name: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Channels_Action', {
            status,
            channel_code,
            channel_name,
            action,
        });
    }

    ewo_ShopInfoProject_Action(
        shop_code: string,
        customer_code: string,
        shop_id: number,
        project_id: number,
        manager_id: number,
        status: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ShopInfoProject_Action',
            {
                shop_code,
                customer_code,
                shop_id,
                project_id,
                manager_id,
                status,
                action,
            }
        );
    }

    ewo_ShopInfoProject_ListShop_Action(
        shop_id: string,
        project_id: number,
        project_id_add: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_ShopInfoProject_ListShop_Action',
            {
                shop_id,
                project_id,
                project_id_add,
                action,
            }
        );
    }
    ShopInfo_byMonth_listShop_Action(
        shop_id: string,
        project_id: number,
        year_month: string,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ShopInfo_byMonth_listShop_Action',
            {
                shop_id,
                project_id,
                year_month,
                action,
            }
        );
    }

    ShopInfo_byMonth_GetList(
        project_id: number,
        shop_code: string,
        year_month: string,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ShopInfo_byMonth_GetList', {
            project_id,
            shop_code,
            year_month,
            rowPerPage,
            pageNumber,
        });
    }

    ewo_ShopAreas_Action(project_id: number, shop_id: number, areas: string) {
        return this.httpClient.post(this.apiUrl + 'ewo_ShopAreas_Action', {
            project_id,
            shop_id,
            areas,
        });
    }



    Shop_Supplier_Action(project_id: number, shop_id: number, supplier_id: number) {
        return this.httpClient.post(this.apiUrl + 'Shop_Supplier_Action', {
            project_id,
            shop_id,
            supplier_id,
        });
    }

    // https://audit.ewoapi.acacy.com.vn/api/Shops/ewo_Shop_GetTemplate
    Shops_GetTemplateImport(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'Shops_GetTemplateImport';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, 'Template_Shop');
            });
    }

    ewo_Shop_GetTemplate_Audit(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'ewo_Shop_GetTemplate_Audit';
        const options = {
            responseType: 'blob' as 'json',
        };
        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, 'shop');
            })
    }
    ewo_Shop_ImportData_Audit(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_Shop_ImportData_Audit',
            formDataUpload
        );
    }
    Shops_ReadTemplateImport(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'Shops_ReadTemplateImport',
            formDataUpload
        );
    }

    ewo_ShopAreas_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_ShopAreas_ImportData',
            formDataUpload
        );
    }
    ewo_EmployeeShops_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_EmployeeShops_ImportData',
            formDataUpload
        );
    }

    Shop_Supplier_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'Shop_Supplier_ImportData',
            formDataUpload
        );
    }


    ewo_EmployeeShops_Action(
        project_id: number,
        employeeShops_id: number,
        employee_id: number,
        shop_id: number,
        fromDate: number,
        toDate: number,
        isActive: number,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_EmployeeShops_Action', {
            project_id,
            employeeShops_id,
            employee_id,
            shop_id,
            fromDate,
            toDate,
            isActive,
            action
        })
    }

    ewo_ShopInfoProject_UpdateManager(
        id: number,
        manager_id: number,
        sign_name: string,
        tax_code: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ShopInfoProject_UpdateManager', {
            id,
            manager_id,
            sign_name,
            tax_code
        })
    }

    ShopInfo_byMonth_ImportData(project_id: number, year_month: number, shop_code: string) {
        return this.httpClient.post(this.apiUrl + 'ShopInfo_byMonth_ImportData', {
            project_id,
            year_month,
            shop_code
        })
    }

    saveFile(response: any, file_name: string = '') {
        const currentTime = new Date();
        const filename = 'download_' + file_name + '_';
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


}
