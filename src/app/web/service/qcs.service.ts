import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class QcsService {
    constructor(private httpClient: HttpClient) { }
    // Methods for the encrypt and decrypt Using AES
    private apiUrl = environment.apiUrl + 'QCs/';

    ewo_QC_Result_Setup(report_id: number) {
        const body = new FormData();
        body.append('report_id', report_id.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_QC_Result_Setup', body);
    }

    ewo_QC_Result_Action(result: string, note: string, qc_result_id: number) {
        return this.httpClient.post(this.apiUrl + 'ewo_QC_Result_Action', {
            result,
            note,
            qc_result_id,
        });
    }
}
