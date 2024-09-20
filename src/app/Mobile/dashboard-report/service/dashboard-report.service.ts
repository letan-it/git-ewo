import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DashboardReportService {
    constructor(private httpClient: HttpClient) {}

    private api_EWO_Master_Mobiles = environment.apiUrl + 'Mobiles/';
    private api_EWO_Attendance_Mobiles = environment.api_EWO_Attendance + 'Mobiles/';
    private api_EWO_Attendance_Reports = environment.api_EWO_Attendance + 'Reports/';
    private api_EWO_SELL = environment.api_EWO_SELL + 'SellOuts/';

    // WebApp_EmployeeGetFunction
    WebApp_EmployeeGetFunction(project_id: number) {
        return this.httpClient.post(this.api_EWO_Master_Mobiles + 'WebApp_EmployeeGetFunction', {
            project_id
        })
    }

    // Mobile_SummarySellOut
    Mobile_SummarySellOut(project_id: number, year_month: number) {
        return this.httpClient.post(this.api_EWO_SELL + 'Mobile_SummarySellOut', {
            project_id, year_month
        })
    }   

    // Mobile_Summary_ATD
    Mobile_Summary_ATD(year_month: number, project_id: number) {
        return this.httpClient.post(this.api_EWO_Attendance_Reports + 'Mobile_Summary_ATD', {
            year_month, project_id
        })
    }

    // MOBILE_web_Timekeeping_ListEmployee_JSE
    MOBILE_web_Timekeeping_ListEmployee_JSE(project_id: number, from_date: number,  to_date: number) {
        return this.httpClient.post(this.api_EWO_Attendance_Mobiles + 'MOBILE_web_Timekeeping_ListEmployee_JSE', {
            project_id, from_date, to_date
        })
    }
}
