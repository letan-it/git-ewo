import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

@Injectable({
    providedIn: 'root',
})

export class MenuService {
    constructor(private httpClient: HttpClient) { }

    private apiUrl = environment.apiUrl + 'Menu/';

    menu_GetList(project_id: number): Observable<any> {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        return this.httpClient.post(this.apiUrl + 'menu_GetList', body);
    }

    menu_project_Action(project_id: number, menu_id: number, action: number) {
        return this.httpClient.post(this.apiUrl + 'menu_project_Action', {
            project_id,
            menu_id,
            action
        },
        httpOptions
        )
    }
}