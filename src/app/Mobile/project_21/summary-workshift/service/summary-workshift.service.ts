import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SummaryWorkshiftService {
    constructor(private httpClient: HttpClient) {}

    private api_EWO_SummaryWorkshift = environment.api_EWO_Activation + 'Activation/';

    // MOBILE_web_SummarySellOut_JSE
    MOBILE_web_SummarySellOut_JSE(project_id: number, employee_id: number, shop_id: number, work_date: number) {
        return this.httpClient.post(this.api_EWO_SummaryWorkshift + 'MOBILE_web_SummarySellOut_JSE', {
            project_id, employee_id, shop_id, work_date
        })
    }

    // MOBILE_web_SummarySellOutByDate_JSE
    MOBILE_web_SummarySellOutByDate_JSE(project_id: number, employee_id: number, work_date_from: number, work_date_to: number) {
        return this.httpClient.post(this.api_EWO_SummaryWorkshift + 'MOBILE_web_SummarySellOutByDate_JSE', {
            project_id, employee_id, work_date_from, work_date_to
        })
    }
}
