import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MastersService {
    constructor(private httpClient: HttpClient) { }
    private apiUrl = environment.apiUrl + 'Masters/';

    ewo_GetLanguage(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_GetLanguage', body);
    }
    ewo_Language_Action(project_id: number, key_language: string, en: string, vn: string) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        body.append('key_language', key_language);
        body.append('en', en);
        body.append('vn', vn);
        return this.httpClient.post(this.apiUrl + 'ewo_Language_Action', body);
    }


    ewo_GetChannels() {
        return this.httpClient.get(this.apiUrl + 'ewo_GetChannels');
    }

    // ============================= //
    GetDomain() {
        return this.httpClient.get(environment.apiUrl + 'Publish/' + 'GetDomain');
    }

    GetProvince() {
        return this.httpClient.get(this.apiUrl + 'GetProvince');
    }
    GetDistricts(province_id: number) {
        const body = new FormData();
        body.append('province_id', province_id.toString());
        return this.httpClient.post(this.apiUrl + 'GetDistricts', body);
    }
    GetWards(district_id: number) {
        const body = new FormData();
        body.append('district_id', district_id.toString());
        return this.httpClient.post(this.apiUrl + 'GetWards', body);
    }

    // ============================= //

    GetRegion() {
        return this.httpClient.get(this.apiUrl + 'GetRegion');
    }
    GetUnits() {
        return this.httpClient.get(this.apiUrl + 'GetUnits');
    }

    GetAreas() {
        return this.httpClient.get(this.apiUrl + 'GetAreas');
    }

    ewo_GetReportStatus(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_GetReportStatus', body);
    }

    ewo_GetMaster(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_GetMaster', body);
    }

    ewo_Masters_GetList(project_id: number, listCode: string, table: string, code: string, status: number) {
        return this.httpClient.post(this.apiUrl + 'ewo_Masters_GetList', {
            project_id,
            listCode,
            table,
            code,
            status
        }) 
    }

    ewo_Masters_Action(
        project_id: number, 
        listCode: string, 
        table: string, 
        id: number,
        parentId: number,
        code: string, 
        nameVN: string,
        nameEN: string,
        status: number,
        orders: number,
        values: string,
        typeValues: string,
        action: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Masters_Action', {
            project_id,
            listCode,
            table, 
            id,
            parentId,
            code, 
            nameVN,
            nameEN,
            status,
            orders,
            values,
            typeValues,
            action
        })
    }

    ewo_Masters_Clone_Audit(project_id: number, project_id_clone: number, rawId: string) {
        return this.httpClient.post(this.apiUrl + 'ewo_Masters_Clone_Audit', {
            project_id,
            project_id_clone,
            rawId

        })
    }
}
