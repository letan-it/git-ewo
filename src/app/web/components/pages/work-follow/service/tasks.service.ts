import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class TasksService {
    constructor(private httpClient: HttpClient) { }

    private apiUrl = environment.api_EWO_WORKFOLLOW + 'Tasks/';

    TaskList_GetAll(
        task_id: number,
        year_month: string,
        employee_id: number,
        tag: string,
        status: string,
        testing_status: string
    ) {
        return this.httpClient.post(this.apiUrl + 'TaskList_GetAll', {
            task_id,
            year_month,
            employee_id,
            tag,
            status,
            testing_status,
        });
    }

    TaskList_GetItem(task_id: any) {
        const body = new FormData();
        body.append('task_id', task_id.toString());
        return this.httpClient.post(this.apiUrl + 'TaskList_GetItem', body);
    }





    TaskNote_Create(task_id: number, note: string) {
        const body = new FormData()
        body.append('task_id', task_id.toString())
        body.append('note', note.toString())
        return this.httpClient.post(this.apiUrl + 'TaskNote_Create', body)
    }

    TaskList_Create(
        task_name: string,
        description: string,
        start_date: string,
        end_date: string,
        prioritize: number,
        tag: string,
        status: string,
        testing_status: string,
        assignees: number,
        team_follow: string,
        task_code: string
    ) {
        return this.httpClient.post(this.apiUrl + 'TaskList_Create', {
            task_name,
            description,
            start_date,
            end_date,
            prioritize,
            tag,
            status,
            testing_status,
            assignees,
            team_follow,
            task_code,
        });
    }


    Summary_TaskList() {
        return this.httpClient.get(this.apiUrl + 'Summary_TaskList')
    }

    TaskList_UpdateItem(

        task_name: string,
        description: string,
        start_date: string,
        end_date: number,
        prioritize: number,
        tag: string,
        status: string,
        testing_status: string,
        assignees: number,
        team_follow: string,
        task_code: string,
        task_id: number

    ) {

        // console.log('time', start_date)
        // console.log('end_date', end_date)


        return this.httpClient.post(this.apiUrl + 'TaskList_UpdateItem', {
            task_name,
            description,
            start_date,
            end_date,
            prioritize,
            tag,
            status,
            testing_status,
            assignees,
            team_follow,
            task_code,
            task_id
        })
    }

    TaskList_UploadFile(data: any) {
        return this.httpClient.post(this.apiUrl + 'TaskList_UploadFile', data);
    }

    TaskList_RawData(project_id: number, year_month: string) {
        const url = this.apiUrl + 'TaskList_RawData';
        const options = {
            responseType: 'blob' as 'json'
        }
        const request = {
            project_id, year_month
        }
        return this.httpClient.post(url, request, options)
            .subscribe((response) => {
                this.saveFile(response, 'TaskList_RawData')
            })
    }

    saveFile(response: any, file_name: string = '') {
        const currentTime = new Date();
        const filename = 'download_' + file_name + '_' +
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
