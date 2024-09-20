import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private httpClient: HttpClient) { }
    // Methods for the encrypt and decrypt Using AES
    private apiUrl = environment.apiUrl + 'Account/';

    //https://audit.ewoapi.acacy.com.vn/api/Account/Login

    login(login_name: string, password: string) {

        return this.httpClient.post(this.apiUrl + 'Login', {
            login_name,
            password,
        });

    }
    loginByToken(token: string) {
        var header = new HttpHeaders({ "Authorization": token, "ContentType": 'application/json' });
        return this.httpClient.get(environment.api_EWO_Attendance + 'process/login/bytoken',{ headers: header });
    }

    // ========= //

    ChangePassWord(login_name: string, password: string) {
        return this.httpClient.post(this.apiUrl + 'ChangePassWord', {
            login_name,
            password,
        });
    }

    ChangeActive(value: number) {
        return this.httpClient.post(this.apiUrl + 'ChangeActive', {
            value,
        });
    }
    ChangeImage(value: string) {
        return this.httpClient.post(this.apiUrl + 'ChangeImage', {
            value,
        });
    }
}
