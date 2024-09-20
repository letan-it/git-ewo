import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ChartService {
    constructor(private httpClient: HttpClient) {}
    private apiUrl = environment.apiUrl + 'Chart/';

    // https://files.ewoapi.acacy.com.vn/api/Files/UploadImage
 
    

    ChartATD_TotalWorkingTime( project_id: number, employee_id: string, manager_id: string,
        area: string, shop_code: string,fromDate: number, todate: number) {
        return this.httpClient.post(this.apiUrl + 'ChartATD_TotalWorkingTime', {
            project_id, employee_id, manager_id, area, shop_code,
            fromDate, todate
        });
    }
    
    ewo_chart_AuditbyMonth(project_id: number, year_month: number) {
        return this.httpClient.post(this.apiUrl + 'ewo_chart_AuditbyMonth', {
            project_id,
            year_month,
        });
    }

    ewo_chart_AuditReport(
        project_id: number,
        report_date: number,
        top: number
    ) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('report_date', report_date.toString());
        body.append('top', top.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_AuditReport',
            body
        );
    }
    ewo_chart_AuditTopEmployeeReport(
        project_id: number,
        report_date: number,
        top: number,
        typeOrder: string
    ): Observable<any> {
        // const body = new FormData();
        // body.append('project_id', project_id.toString());
        // body.append('report_date', report_date.toString());
        // body.append('top', top.toString());
        // body.append('typeOrder', typeOrder.toString())
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_AuditTopEmployeeReport',
            {
                project_id,
                report_date,
                top,
                typeOrder,
            }
        );
    }

    ewo_chart_POSM_TotalQuantity(
        project_id: number,
        year_month: number,
        posm_id: string
    ) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('posm_id', posm_id.toString());
        body.append('year_month', year_month.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_POSM_TotalQuantity',
            body
        );
    }

    ewo_chart_SellOut_TotalSalesAmount(
        project_id: number,
        startDate: number,
        endDate: number,
        product_id: string
    ) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('startDate', startDate.toString());
        body.append('endDate', endDate.toString());
        body.append('product_id', product_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_TotalSalesAmount',
            body
        );
    }
    ewo_chart_SellOut_TotalSalesQuantity(
        project_id: number,
        startDate: number,
        endDate: number,
        product_id: string
    ) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('startDate', startDate.toString());
        body.append('endDate', endDate.toString());
        body.append('product_id', product_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_TotalSalesQuantity',
            body
        );
    }
    ewo_chart_SellOut_TotalSalesArea(
        project_id: number,
        startDate: number,
        endDate: number,
        area: string
    ) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('startDate', startDate.toString());
        body.append('endDate', endDate.toString());
        body.append('area', area.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_TotalSalesArea',
            body
        );
    }

    ewo_chart_SellOut_TotalSalesProduct(
        project_id: number,
        startDate: number,
        endDate: number,
        product_id: string
    ) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('startDate', startDate.toString());
        body.append('endDate', endDate.toString());
        body.append('product_id', product_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_TotalSalesProduct',
            body
        );
    }
    ewo_chart_SellOut_TotalSalesTopShop(
        project_id: number,
        startDate: number,
        endDate: number,
        key: string,
        top: number,
        order: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_TotalSalesTopShop',
            {
                project_id,
                startDate,
                endDate,
                key,
                top,
                order,
            }
        );
    }
    ewo_chart_SellOut_TotalSalesTopEmployee(
        project_id: number,
        startDate: number,
        endDate: number,
        key: string,
        top: number,
        order: string,
        manager_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_TotalSalesTopEmployee',
            {
                project_id,
                startDate,
                endDate,
                key,
                top,
                order,
                manager_id,
            }
        );
    }
    ewo_chart_SellOut_TotalAmountEmployee(
        project_id: number,
        startDate: number,
        endDate: number,
        employee_id: string,
        manager_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_TotalAmountEmployee',
            {
                project_id,
                startDate,
                endDate,
                employee_id,
                manager_id,
            }
        );
    }
    ewo_chart_SellOut_SalesReport_Area_Region(
        project_id: number,
        startDate: number,
        endDate: number,
        area_code: string,
        region_code: string,
        shop_type_id: string,
        manager_id: string,
        brand_name: string,
        category_id: string,
        product_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_SalesReport_Area_Region',
            {
                project_id,
                startDate,
                endDate,
                area_code,
                region_code,
                shop_type_id,
                manager_id,
                brand_name,
                category_id,
                product_id,
            }
        );
    }
    ewo_chart_SellOut_SalesReport_BR(
        project_id: number,
        startDate: number,
        endDate: number,
        area_code: string,
        region_code: string,
        shop_type_id: string,
        manager_id: string,
        employee_id: string,
        brand_name: string,
        category_id: string,
        product_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_SalesReport_BR',
            {
                project_id,
                startDate,
                endDate,
                area_code,
                region_code,shop_type_id,
                manager_id,
                employee_id,
                brand_name,
                category_id,
                product_id,
            }
        );
    }

    ewo_chart_SellOut_SalesReport_Date(
        project_id: number,
        startDate: number,
        endDate: number,
        date: number,
        area_code: string,
        region_code: string,
        shop_type_id: string,
        manager_id: string,
        shop_code: string,
        brand_name: string,
        category_id: string,
        product_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_SalesReport_Date',
            {
                project_id,
                startDate,
                endDate,
                date,
                area_code,
                region_code,
                shop_type_id,
                manager_id,
                shop_code,
                brand_name,
                category_id,
                product_id,
            }
        );
    }

    ewo_chart_SellOut_SalesReport_Outlet(
        project_id: number,
        startDate: number,
        endDate: number,
        area_code: string,
        region_code: string,
        shop_type_id: string,
        manager_id: string,
        shop_code: string,
        shop_name: string,
        brand_name: string,
        category_id: string,
        product_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_SalesReport_Outlet',
            {
                project_id,
                startDate,
                endDate,
                area_code,
                region_code,shop_type_id,
                manager_id,
                shop_code,
                shop_name,
                brand_name,
                category_id,
                product_id,
            }
        );
    }
    ewo_chart_SellOut_SalesReport_Product(
        project_id: number,
        startDate: number,
        endDate: number,
        area_code: string,
        region_code: string,
        shop_type_id: string,
        manager_id: string,
        shop_code: string,
        brand_name: string,
        category_id: string,
        product_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_SalesReport_Product',
            {
                project_id,
                startDate,
                endDate,
                area_code,
                region_code, shop_type_id,
                manager_id,
                shop_code,
                brand_name,
                category_id,
                product_id,
            }
        );
    }

    ewo_chart_SellOut_SalesReport_SKU_Employee(
        project_id: number,
        startDate: number,
        endDate: number,
        area_code: string,
        region_code: string,
        shop_type_id: string,
        manager_id: string,
        employee_id: string,
        brand_name: string,
        category_id: string,
        product_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_SalesReport_SKU_Employee',
            {
                project_id,
                startDate,
                endDate,
                area_code,
                region_code, shop_type_id,
                manager_id,
                employee_id,
                brand_name,
                category_id,
                product_id,
            }
        );
    }

    ewo_chart_SellOut_SalesReport_SKU_Shop(
        project_id: number,
        startDate: number,
        endDate: number,
        area_code: string,
        region_code: string,
        shop_type_id: string,
        manager_id: string,
        shop_code: string,
        shop_name: string,
        brand_name: string,
        category_id: string,
        product_id: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_chart_SellOut_SalesReport_SKU_Shop',
            {
                project_id,
                startDate,
                endDate,
                area_code,
                region_code,shop_type_id,
                manager_id,
                shop_code,
                shop_name,
                brand_name,
                category_id,
                product_id,
            }
        );
    }

    ChartATD_EmployeeByDay(
        project_id: number,
        startDate: number,
        endDate: number,
        area: string,
        manager_id: string,
        employee_id: string,
        shop_code: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ChartATD_EmployeeByDay', {
            project_id,
            startDate,
            endDate,
            area,
            manager_id,
            employee_id,
            shop_code,
        });
    }

    ChartATD_EmployeeByDay_Percent(
        project_id: number,
        startDate: number,
        endDate: number,
        area: string,
        manager_id: string,
        employee_id: string,
        shop_code: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ChartATD_EmployeeByDay_Percent', {
            project_id,
            startDate,
            endDate,
            area,
            manager_id,
            employee_id,
            shop_code,
        });
    }
    ChartATD_EmployeeByDay_Detail(
        project_id: number,
        planDate: number,
        area: string,
        manager_id: string,
        employee_id: string,
        shop_code: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ChartATD_EmployeeByDay_Detail',
            {
                project_id,
                planDate,
                area,
                manager_id,
                employee_id,
                shop_code,
            }
        );
    }
    ChartATD_EmployeeBySup(
        project_id: number,
        startDate: number,
        endDate: number,
        area: string,
        manager_id: string,
        employee_id: string,
        shop_code: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ChartATD_EmployeeBySup', {
            project_id,
            startDate,
            endDate,
            area,
            manager_id,
            employee_id,
            shop_code,
        });
    }
    ChartATD_EmployeeByShop(
        project_id: number,
        startDate: number,
        endDate: number,
        area: string,
        manager_id: string,
        employee_id: string,
        shop_code: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ChartATD_EmployeeByShop', {
            project_id,
            startDate,
            endDate,
            area,
            manager_id,
            employee_id,
            shop_code,
        });
    }
    ChartATD_EmployeeByArea(
        project_id: number,
        startDate: number,
        endDate: number,
        area: string,
        manager_id: string,
        employee_id: string,
        shop_code: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ChartATD_EmployeeByArea', {
            project_id,
            startDate,
            endDate,
            area,
            manager_id,
            employee_id,
            shop_code,
        });
    }
}
