import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private httpClient: HttpClient) { }

    private apiUrl = environment.apiUrl + 'Category/';

    Get_Categories(
        project_id: number,
        id: string,
        category: string,
        company: string,
        brand: string,
        packages: string,
        division: string,
        market: string,
    ) {
        return this.httpClient.post(this.apiUrl + 'Get_Categories', {
            project_id,
            id,
            category,
            company,
            brand,
            packages,
            division,
            market
        })
    }

    Categories_Action(
        project_id: number,
        category_id: number,
        category_name: string,
        category_name_vi: string,
        company: string,
        brand_code: string,
        brand: string,
        brand_name_vi: string,
        packages: string,
        orders: number,
        division_code: string,
        division_name: string,
        market_code: string,
        market_name: string,
        market_name_vi: string,
        color: string,
        action: string,
    ) {
        return this.httpClient.post(this.apiUrl + 'Categories_Action', {
            project_id,
            category_id,
            category_name,
            category_name_vi,
            company, brand_code, brand, brand_name_vi,
            packages, orders,
            division_code, division_name,
            market_code, market_name, market_name_vi,
            color, action
        });
    }

    ewo_Categories_ImportData(
        formDataUpload: FormData, project_id: number
    ) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_Categories_ImportData', formDataUpload);
    }


}
