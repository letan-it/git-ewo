import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import {
    ConfirmationService,
    MenuItem,
    Message,
    MessageService,
} from 'primeng/api';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import {
    EnumFolderFile,
    EnumLocalStorage,
    EnumStatus,
    EnumSystem,
} from 'src/app/Core/_enum';

import { stringify } from 'querystring';
import { Helper } from 'src/app/Core/_helper';
import { UserService } from 'src/app/web/service/user.service';
import { ThisReceiver } from '@angular/compiler';
import { Product } from 'src/app/web/models/product';
import { ProductService } from 'src/app/web/service/product.service';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { DatePipe } from '@angular/common';
import { Validators } from '@angular/forms';
import { Employee } from 'src/app/web/models/employee';
import { Pf } from 'src/app/_helpers/pf';
import { environment } from 'src/environments/environment';

interface Project {
    project_id: number;
    project_code: string;
    project_name: string;
    project_desc: string;
}

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
    providers: [ConfirmationService, MessageService, DatePipe]

})
export class AddUserComponent {
    items: MenuItem[] = [];
    itemsRemove: MenuItem[];
    value: string = 'IOS';
    constructor(
        private messageService: MessageService,
        private taskService: TaskFileService,
        private edService: EncryptDecryptService,
        private confirmationService: ConfirmationService,
        private userService: UserService,
        private employeesService: EmployeesService,
        private datePipe: DatePipe
    ) {
        this.itemsRemove = [
            {
                label: 'Remove All Store',
                icon: 'pi pi-times',
                command: () => {
                    this.removeAllStore();
                },
            },
        ];
    }
    msgs: Message[] = [];
    msgsAccount: Message[] = [];
    msgsInfo: Message[] = [];
    msgsStore: Message[] = [];
    currentUser: any;
    userProfile: any;

    stateDeviceOptions: any[] = [
        { label: 'IOS', value: 'IOS' },
        { label: 'Android', value: 'Android' },
    ];
    value_device: string = 'Android';

    project_list: any[] = [];
    store_list: any[] = [];
    selected_project: any;
    selected_store: any;
    user_profile: string = 'current';
    logUser: any;

    projects: Project[] = [];
    selectedProject!: Project;
    password_old!: string;
    confirmPassword!: string;

    disabled: boolean = true;
    disabledPassword: boolean = false;

    checked: boolean = false;

    // uploadedFiles
    uploadedFiles: any[] = [];
    maxFileSize: number = 1000000;
    convertBirthday!: number;

    employee!: Employee;

    birthday_date!: string;
    login_name!: string;
    password!: string;
    employee_id!: number;
    employee_code!: string;
    employee_name!: string;
    card_number!: string;
    mobile!: number;
    birthday!: number;
    email!: string;
    employee_type_id!: number;
    image!: string;
    is_test!: number;

    ngOnInit(): void {

        if (this.user_profile == EnumSystem.current) {

            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );

        } else {

            this.items = [
                {
                    label: 'Active',
                    icon: 'pi pi-check',
                    command: () => {
                        this.active();
                    },
                },
                {
                    label: 'In-Active',
                    icon: 'pi pi-times',
                    command: () => {
                        this.inactive();
                    },
                },
            ];
        }

        this.userProfile = this.currentUser.employee[0];
        this.password_old = this.userProfile.passEncrypt;
        this.value_device = this.userProfile.device

        this.project_list = this.currentUser.projects;

    }

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 50;
    storelistPage: any = [];
    new_pass: any;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;

        this.storelistPage = this.store_list.slice(
            this.first,
            this.first + this.rows
        );
    }

    active() {
        this.currentUser.active = 1;
        this.userService
            .ChangeActive(this.currentUser.active)
            .subscribe((data: any) => {

                if (this.user_profile == EnumSystem.current) {
                    localStorage.setItem(
                        EnumLocalStorage.user,
                        this.edService.encryptUsingAES256(
                            JSON.stringify(this.currentUser)
                        )
                    );
                }

                if (data.status == EnumStatus.success) {
                    this.msgsAccount = [];
                    this.msgsAccount.push({
                        severity: EnumStatus.success,
                        summary: EnumSystem.Notification,
                        detail: 'Success update Active',
                        life: 3000,
                    });
                } else {
                    this.msgsAccount = [];
                    this.msgsAccount.push({
                        severity: EnumStatus.success,
                        summary: EnumSystem.Notification,
                        detail: data.message,
                        life: 3000,
                    });
                }

            });
    }

    inactive() {
        this.currentUser.active = 0;
        this.userService
            .ChangeActive(this.currentUser.active)
            .subscribe((data: any) => {
                if (this.user_profile == EnumSystem.current) {
                    localStorage.setItem(
                        EnumLocalStorage.user,
                        this.edService.encryptUsingAES256(
                            JSON.stringify(this.currentUser)
                        )
                    );
                }
                if (data.status == EnumStatus.success) {
                    this.msgsAccount = [];
                    this.msgsAccount.push({
                        severity: EnumStatus.success,
                        summary: EnumSystem.Notification,
                        detail: 'Success update In-Active',
                        life: 3000,
                    });
                } else {
                    this.msgsAccount = [];
                    this.msgsAccount.push({
                        severity: EnumStatus.success,
                        summary: EnumSystem.Notification,
                        detail: data.message,
                        life: 3000,
                    });
                }
            });
    }

    Change_Password() {

        // this.disabledPassword = false ;

        if (Helper.IsNull(this.userProfile.passEncrypt) == true) {
            this.msgsAccount = [];

            this.msgsAccount.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a new password',
                life: 3000,
            });
            return;

        }

        if (this.userProfile.passEncrypt == this.password_old) {
            this.msgsAccount = [];
            this.msgsAccount.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'New password medium with the original password',
                life: 3000,
            });
            return;
        }

        if (Helper.IsNull(this.confirmPassword) == true) {
            this.msgsAccount = [];

            this.msgsAccount.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please confirm password',
                life: 3000,
            });
            return;

        }

        if (this.userProfile.passEncrypt != this.confirmPassword) {
            this.msgsAccount = [];
            this.msgsAccount.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Password and confirm password do not match',
                life: 3000,
            });
            return;
        }

        this.employeesService
            .ewo_ChangePassWord(this.userProfile.login_name, this.userProfile.passEncrypt)
            .subscribe((data: any) => {

                if (data.result == EnumStatus.ok) {


                    // if (this.user_profile == EnumSystem.current) {

                    localStorage.setItem(
                        EnumLocalStorage.user_profile,
                        this.edService.encryptUsingAES256(
                            JSON.stringify(this.userProfile)
                        )
                    );
                    // }

                    this.msgsAccount = [];
                    this.msgsAccount.push({
                        severity: EnumStatus.success,
                        summary: EnumSystem.Notification,
                        detail: 'Success Change Password, ' + this.userProfile.passEncrypt,
                        life: 3000,
                    });
                }
            });

    }

    save_info() {

        // employee_name: string , card_number: string ,mobile : string , birthday : number, email

        if (Pf.checkMobile(this.userProfile.mobile) != true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Contact mobile is not valid',
                life: 3000,
            });
            return;

        }

        if (Helper.IsNull(this.userProfile.employee_name) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a employee name',
                life: 3000,
            });
            return;

        }

        if (Helper.IsNull(this.userProfile.card_number) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a CCCD',
                life: 3000,
            });
            return;

        }

        if (Helper.IsNull(this.userProfile.mobile) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a phone number',
                life: 3000,
            });
            return;

        }

        if (Helper.IsNull(this.userProfile.birthday) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a birthday',
                life: 3000,
            });
            return;

        }

        if (Helper.IsNull(this.userProfile.email) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a email',
                life: 3000,
            });
            return;

        }
        if (Helper.checkMail(this.userProfile.email) != true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Email address is not valid',
                life: 3000,
            });
            return;

        }
        if (Pf.cardNumber(this.userProfile.card_number) != true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'CCCD must have 9 digits or 12 digits',
                life: 3000,
            });
            return;

        }

        const conver = Helper.convertDateFormat(this.userProfile.birthday_date)
        this.convertBirthday = conver;

        this.employeesService
            .ewo_Update(this.userProfile.login_name, this.userProfile.password, this.userProfile.employee_id, 0, this.userProfile.employee_code,
                this.userProfile.employee_name, this.userProfile.card_number, this.userProfile.mobile,
                this.convertBirthday, this.userProfile.sex, this.userProfile.email, this.userProfile.employee_type_id,
                this.userProfile.image, '', '', -1, -1)

            .subscribe((data: any) => {

                if (data.result == EnumStatus.ok) {

                    localStorage.setItem(
                        EnumLocalStorage.user_profile,
                        this.edService.encryptUsingAES256(
                            JSON.stringify(this.userProfile)
                        )
                    );

                    this.msgsInfo = [];
                    this.msgsInfo.push({
                        severity: EnumStatus.success,
                        summary: EnumSystem.Notification,
                        detail: 'Success Update Account',
                        life: 3000,
                    });

                } else {

                    this.msgsInfo = [];
                    this.msgsInfo.push({
                        severity: EnumStatus.warning,
                        summary: EnumSystem.Notification,
                        detail: 'Error Update Account',
                        life: 3000,
                    });
                    return;
                }
            });

    }


    firstName(user_name: string) {
        try {
            return user_name.split(' ')[1].charAt(0);
        } catch (error) {
            return '?';
        }
    }

    RemoveStore() {

        let removeList = this.store_list.filter((x) => x.checked == true);

        if (removeList.length == 0) {
            this.msgsStore = [];
            this.msgsStore.push({
                severity: EnumStatus.danger,
                summary: EnumSystem.Notification,
                detail: 'Please select Store to remove',
                life: 3000,
            });
        }
    }

    removeAllStore() {
        this.confirmationService.confirm({
            key: 'confirmRemoveAll',
            message: 'Are you sure to perform this action?',
        });
    }


    hasSelectedFile: any;
    fileImage: any;

    onSelect(event: any) {

        this.fileImage = event;
    }
    onRemove(event: any) {
        this.fileImage = undefined;
    }

    onUpload1(event: any, fileUpload: any) {
        fileUpload = undefined;

        this.taskService
            .ImageRender(event[0], EnumFolderFile.avatars + '.jpg')
            .then((file) => {


                const image = environment.apiUrl + file.name;



            })
            .catch((error) => {
                console.error('Image rendering failed:', error);
            });
        this.fileImage = undefined;
    }


    goToLink(url: string) {
        window.open(url, '_blank');
    }

    onUpload(event: UploadEvent) {


        for (let file of event.files) {
            this.uploadedFiles.push(file);

        }

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }

    selectEmployeeType(event: any) {

    }

    checkAccountTest() {
        this.checked == false ? this.is_test = 0 : this.is_test = 1;
    }

}
