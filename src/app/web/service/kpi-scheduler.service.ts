import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KpiSchedulerService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl + 'KPIScheduler/';

  KPI_Scheduler_GetItem(kpi_id: number, project_id: number) {
    const body = new FormData();
    body.append('kpi_id', kpi_id.toString())
    body.append('project_id', project_id.toString())
    return this.httpClient.post(this.apiUrl + 'KPI_Scheduler_GetItem', body);
  }
  KPI_Scheduler_Update(kpi_id: number, project_id: number, scheduler_type: string, week: string,
    month: string, position: string, category: string) {
    return this.httpClient.post(this.apiUrl + 'KPI_Scheduler_Update', {
      kpi_id, project_id, scheduler_type, week, month, position, category
    })
  }

}
