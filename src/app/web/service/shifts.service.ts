import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ShiftsService {
    constructor(private httpClient: HttpClient) {}
    private apiUrl = environment.api_EWO_Attendance + 'Shifts/';

    // https://attendant.ewoapi.acacy.com.vn/api/Shifts/ewo_GetShifts
    ewo_GetShifts(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_GetShifts', body);
    }

    ewo_ATD_shifts_GetList(
        project_id: number,
        shift_code: string,
        note: string,
        type: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ATD_shifts_GetList', {
            project_id,
            shift_code,
            note,
            type,
        });
    }
    ewo_ATD_shifts_Action(
        project_id: number,
        shift_id: number,
        shift_code: string,
        note: string,
        type: string,
        action: string,
        fromTime: string,
        toTime: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_ATD_shifts_Action', {
            project_id,
            shift_id,
            shift_code,
            note,
            type,
            action,
            fromTime,
            toTime,
        });
    }
}
