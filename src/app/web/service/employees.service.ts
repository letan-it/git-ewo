import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EmployeesService {
    constructor(private httpClient: HttpClient) { }

    private apiUrl = environment.apiUrl + 'Employee/';

    ewo_ChangePassWord(login_name: string, password: string) {
        return this.httpClient.post(this.apiUrl + 'ewo_ChangePassWord', {
            login_name,
            password,
        });
    }
    ChangePassWordS(user_codes: string, password: string) {
        return this.httpClient.post(this.apiUrl + 'ChangePassWordS', {
            user_codes,
            password,
        });
    }
    User_ResetDevice(employee_id: number, project_id: number) {
        return this.httpClient.post(this.apiUrl + 'User_ResetDevice', {
            employee_id,
            project_id,
        });
    }
    ewo_ChangePassword_Audit(user_id: number, new_password: string) {
        const body = new FormData();
        body.append('user_id', user_id.toString());
        body.append('new_password', new_password.toString());
        return this.httpClient.post(this.apiUrl + 'ewo_ChangePassword_Audit', body);
    }

    ewo_GetEmployeeList(
        rowPerPage: number,
        pageNumber: number,
        employee_code: string,
        employee_name: string,
        login_name: string,
        card_number: string,
        mobile: string,
        email: string,
        employee_type_id: number,
        manager_id: number,
        project_id: number,
        status: number,
        position: string,
        category: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_GetEmployeeList', {
            rowPerPage,
            pageNumber,
            employee_code,
            employee_name,
            login_name,
            card_number,
            mobile,
            email,
            employee_type_id,
            manager_id,
            project_id,
            status,
            position,
            category
        });
    }

    ewo_Employee_EmployeeType_GetList(
        project_id: number,
        employee_type_id: string,
        company: string,
        level: string,
        role: number
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_Employee_EmployeeType_GetList',
            {
                project_id,
                employee_type_id,
                company,
                level,
                role,
            }
        );
    }

    ewo_GetEmployeeType() {
        return this.httpClient.get(this.apiUrl + 'ewo_GetEmployeeType');
    }

    ewo_Update(
        login_name: string,
        password: string,
        employee_id: number,
        manager_id: number,
        employee_code: string,
        employee_name: string,
        card_number: string,
        mobile: string,
        birthday: number,
        gender: number,
        email: string,
        employee_type_id: number,
        image: string,
        image_card_before: string,
        image_card_after: string,
        image_face_left: string,
        image_face_right: string,
        verify: number,
        status: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Update', {
            login_name,
            password,
            employee_id,
            manager_id,
            employee_code,
            employee_name,
            card_number,
            mobile,
            birthday,
            gender,
            email,
            employee_type_id,
            image,
            image_card_before,
            image_card_after,
            image_face_left,
            image_face_right,
            verify,
            status,
        });
    }

    ewo_Create(
        login_name: string,
        password: string, // 123456
        employee_id: number,
        manager_id: number,
        employee_code: string,
        employee_name: string,
        card_number: string,
        mobile: string,
        birthday: number,
        email: string,
        employee_type_id: number,
        image: string,
        image_card_before: string,
        image_card_after: string,
        status: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Create', {
            login_name,
            password, // 123456
            employee_id,
            manager_id,
            employee_code,
            employee_name,
            card_number,
            mobile,
            birthday,
            email,
            employee_type_id,
            image,
            image_card_before,
            image_card_after,
            status,
        });
    }

    ewo_Create_Audit(
        login_name: string,
        password: string, // 123456
        project_id: number,
        employee_id: number,
        manager_id: number,
        employee_code: string,
        employee_name: string,
        card_number: string,
        mobile: string,
        birthday: number,
        gender: number,
        email: string,
        employee_type_id: number,
        image: string,
        image_card_before: string,
        image_card_after: string,
        image_face_left: string,
        image_face_right: string,
        status: number
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_Create_Audit', {
            login_name,
            password, // 123456
            project_id,
            employee_id,
            manager_id,
            employee_code,
            employee_name,
            card_number,
            mobile,
            birthday,
            gender,
            email,
            employee_type_id,
            image,
            image_card_before,
            image_card_after,
            image_face_left, image_face_right,
            status,
        });
    }

    ewo_Employee_checkExists(project_id: number, employee_code: any,
        login_name: any, card_number: any, mobile: any, email: any) {
        return this.httpClient.post(this.apiUrl + 'ewo_Employee_checkExists', {
            project_id, employee_code, login_name, card_number, mobile, email
        })
    }


    ewo_EmployeeProjects_Action(
        employee_id: number,
        project_id: string,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_EmployeeProjects_Action',
            {
                employee_id,
                project_id,
                action,
            }
        );
    }

    ewo_EmployeeProjects_ActionEmployee(
        employee_id: string,
        project_id: number,
        action: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_EmployeeProjects_ActionEmployee',
            {
                employee_id,
                project_id,
                action,
            }
        );
    }

    ewo_EmployeePosition_Action(
        project_id: number,
        employee_id: number,
        position: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_EmployeePosition_Action',
            {
                project_id,
                employee_id,
                position,
            }
        );
    }

    ewo_EmployeeCategory_Action(
        project_id: number,
        employee_id: number,
        category: string
    ) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_EmployeeCategory_Action',
            {
                project_id,
                employee_id,
                category,
            }
        );
    }

    ewo_menu_employee_Action(
        employee_id: number,
        project_id: number,
        action: number,
        menu_id: number,
        status: number,
        share_employee_code: string
    ) {
        return this.httpClient.post(this.apiUrl + 'ewo_menu_employee_Action', {
            employee_id,
            project_id,
            action,
            menu_id,
            status,
            share_employee_code,
        });
    }

    ewo_Employee_GetTemplate() {
        const url = this.apiUrl + 'ewo_Employee_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient.get(url, options).subscribe((response) => {
            this.saveFile(response, 'employee');
        });
    }

    ewo_Employee_GetTemplate_Audit() {
        const url = this.apiUrl + 'ewo_Employee_GetTemplate_Audit';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient.get(url, options).subscribe((response) => {
            this.saveFile(response, 'employee');
        });
    }


    ewo_Employee_ImportData(formDataUpload: FormData) {
        return this.httpClient.post(
            this.apiUrl + 'ewo_Employee_ImportData',
            formDataUpload
        );
    }

    ewo_Employee_ImportData_Audit(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString())
        return this.httpClient.post(
            this.apiUrl + 'ewo_Employee_ImportData_Audit',
            formDataUpload
        );
    }


    ewo_EmployeePositionCategory_ImportData(formDataUpload: FormData, project_id: number, name: string) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + name,
            formDataUpload
        );
    }

    ewo_EmployeeProjects_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.apiUrl + 'ewo_EmployeeProjects_ImportData',
            formDataUpload
        );
    }

    ewo_EmployeeProjects_GetTemplate(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());

        const url = this.apiUrl + 'ewo_EmployeeProjects_GetTemplate';
        const options = {
            responseType: 'blob' as 'json',
        };

        return this.httpClient
            .post(url, body, options)
            .subscribe((response) => {
                this.saveFile(response, 'employee_join_date');
            });


    }


    saveFile(response: any, file_name: string = '') {
        const currentTime = new Date();
        const filename = 'download_' + file_name + '_';
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
