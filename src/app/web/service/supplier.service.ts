import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SupplierService {
    constructor(private httpClient: HttpClient) { }
    private apiUrl = environment.apiUrl + 'Supplier/';



    Supplier_GetList(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.apiUrl + 'Supplier_GetList', body);

    }

    Suppliers_Action(
        project_id: number,
        supplier_id: number,
        supplier_code: string,
        supplier_name: string,
        status: number,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'Suppliers_Action', {
            project_id,
            supplier_id,
            supplier_code,
            supplier_name,
            status,
            action
        })
    }


}
