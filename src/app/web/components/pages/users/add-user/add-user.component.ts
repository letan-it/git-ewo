import { Component, ViewChild } from '@angular/core';
import {
    ConfirmationService,
    MenuItem,
    Message,
    MessageService,
} from 'primeng/api';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import {
    EnumFolderFile,
    EnumLocalStorage,
    EnumStatus,
    EnumSystem,
} from 'src/app/Core/_enum';

import { Helper } from 'src/app/Core/_helper';
import { UserService } from 'src/app/web/service/user.service';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { Employee } from 'src/app/web/models/employee';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { log } from 'console';
import { DatePipe } from '@angular/common';
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
    providers: [ConfirmationService, DatePipe],
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
        private _file: FileService,
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
    // msgsInfo: Message[] = [];
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
    password: string = '123456';
    employee_id!: number;
    employee_code!: string;
    employee_name!: string;
    card_number!: number;
    mobile!: string;
    birthday!: number;
    email!: string;
    employee_type_id!: number;

    is_test: number = 0;
    project_id!: number;

    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }

    items_menu: any;
    home: any;

    selectedGender: any = null;
    gerders: any[] = [
        { name: 'Male', key: 0 },
        { name: 'Female', key: 1 },
    ];
    project:any 
    projectName () {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }


    ngOnInit() {
        this.projectName ();
        this.items_menu = [
            { label: ' PROJECT' },
            { label: ' User', icon: 'pi pi-user', routerLink: '/users' },
            { label: ' Add user', icon: 'pi pi-user-plus' },
        ];
        this.home = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
        let newDate = new Date();
        this.date = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
    }
    status: boolean = false;
    changeStatus(event: any) {
        this.status = event.checked;
    }

    date: any;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    ListMonth: any = [];
    year: any;
    getMonth(date: Date, format: string) {
        let today = new Date();
        this.year = today.getFullYear();

        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        const dataMonth = Helper.getMonth()
        this.ListMonth = dataMonth.ListMonth
    }

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 10;
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
            .ewo_ChangePassWord(
                this.userProfile.login_name,
                this.userProfile.passEncrypt
            )
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
                        detail:
                            'Success Change Password, ' +
                            this.userProfile.passEncrypt,
                        life: 3000,
                    });

                    AppComponent.pushMsg(
                        'Page Add User',
                        'Change Password',
                        'Success Change Password, ' +
                        this.userProfile.passEncrypt,
                        EnumStatus.info,
                        0
                    );
                }
            });
    }

    imageFile!: any;
    image_card_before_File!: any;
    image_card_after_File!: any;

    image_face_left_File!: any;
    image_face_right_File!: any;
    @ViewChild('myInputImage') myInputImage: any;
    @ViewChild('myInputBefore') myInputBefore: any;
    @ViewChild('myInputAfter') myInputAfter: any;
    @ViewChild('myInputFaceLeft') myInputFaceLeft: any;
    @ViewChild('myInputFaceRight') myInputFaceRight: any;

    clearFileInput() {
        this.myInputImage.nativeElement.value = null;
        this.myInputBefore.nativeElement.value = null;
        this.myInputAfter.nativeElement.value = null;
        this.myInputFaceLeft.nativeElement.value = null;
        this.myInputFaceRight.nativeElement.value = null;
    }

    Clear() {
        this.login_name = '';
        this.item_ASM = 0;
        this.employee_code = '';
        this.employee_name = '';
        this.card_number = 0;
        this.mobile = '';
        this.birthday_date = '';
        this.selectedGender = null;
        this.email = '';
        this.employee_type_id = 0;
        this.imageFile = '';
        this.image_card_before_File = '';
        this.image_card_after_File = '';
        this.image_face_left_File = '';
        this.image_face_right_File = '';
        this.image = '';
        this.image_face_left = '';
        this.image_face_right = '';
        this.status = false;
        this.clearFileInput();
    }

    image!: string;
    image_card_before!: string;
    image_card_after!: string;

    image_face_left!: string;
    image_face_right!: string;

    onChangeImage(event: any) {
        this.imageFile = event.target.files[0];

        this.taskService
            .ImageRender(this.imageFile, this.imageFile.name)
            .then((file) => {
                this.imageFile = file;
            });
        this.loadImage();
    }

    onChangeImageBefore(event: any) {
        this.image_card_before_File = event.target.files[0];

        this.taskService
            .ImageRender(
                this.image_card_before_File,
                this.image_card_before_File.name
            )
            .then((file) => {
                this.image_card_before_File = file;
            });
        this.loadImageBefor();
    }
    onChangeImageAfter(event: any) {
        this.image_card_after_File = event.target.files[0];

        this.taskService
            .ImageRender(
                this.image_card_after_File,
                this.image_card_after_File.name
            )
            .then((file) => {
                this.image_card_after_File = file;
            });
        this.loadImageAfter();
    }

    onChangeImageFaceLeft(event: any) {
        this.image_face_left_File = event.target.files[0];

        this.taskService
            .ImageRender(
                this.image_face_left_File,
                this.image_face_left_File.name
            )
            .then((file) => {
                this.image_face_left_File = file;
            });
        this.loadImageFaceLeft();
    }

    onChangeImageFaceRight(event: any) {
        this.image_face_right_File = event.target.files[0];

        this.taskService
            .ImageRender(
                this.image_face_right_File,
                this.image_face_right_File.name
            )
            .then((file) => {
                this.image_face_right_File = file;
            });
        this.loadImageFaceRight();
    }

    loadImage() {
        if (this.imageFile == undefined) {
            this.image = EnumSystem.imageError;
        } else {
            const formUploadImage = new FormData();
            formUploadImage.append('files', this.imageFile);
            formUploadImage.append('ImageType', this.employee_code);
            formUploadImage.append('WriteLabel', this.employee_code);

            // this._file.UploadImage(formUploadImage).subscribe((data: any) => {
            //     if (data.result == EnumStatus.ok) {
            //         this.image = EnumSystem.fileLocal + data.data;
            //     }
            // });

            const fileName = AppComponent.generateGuid();
            const newFile = new File([this.imageFile], fileName+this.imageFile.name.substring(this.imageFile.name.lastIndexOf('.')),{type: this.imageFile.type});
            const modun = 'EMPLOYEE-PROFILE';
            const drawText = this.employee_code;
            this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                (response : any) => {   
                    this.image = response.url;   
                },
                (error : any) => { 
                    this.image = '';
                }
            );

        }
    }
    loadImageBefor() {
        if (this.image_card_before_File == undefined) {
            this.image_card_before = EnumSystem.imageError;
        } else {
            const formUploadImageBefore = new FormData();
            formUploadImageBefore.append('files', this.image_card_before_File);
            formUploadImageBefore.append('ImageType', this.employee_code);
            formUploadImageBefore.append('WriteLabel', this.employee_code);

            // this._file
            //     .UploadImage(formUploadImageBefore)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_card_before =
            //                 EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.image_card_before = EnumSystem.imageError;
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_card_before_File], fileName+this.image_card_before_File.name.substring(this.image_card_before_File.name.lastIndexOf('.')),{type: this.image_card_before_File.type});
                const modun = 'EMPLOYEE-CARD-BEFORE';
                const drawText = this.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.image_card_before = response.url;   
                    },
                    (error : any) => { 
                        this.image_card_before = EnumSystem.imageError;
                    }
                );
        }
    }

    loadImageAfter() {
        if (this.image_card_after_File == undefined) {
            this.image_card_after = EnumSystem.imageError;
        } else {
            const formUploadImageAfter = new FormData();
            formUploadImageAfter.append('files', this.image_card_after_File);
            formUploadImageAfter.append('ImageType', this.employee_code);
            formUploadImageAfter.append('WriteLabel', this.employee_code);

            // this._file
            //     .UploadImage(formUploadImageAfter)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_card_after =
            //                 EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.image_card_after = EnumSystem.imageError;
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_card_after_File], fileName+this.image_card_after_File.name.substring(this.image_card_after_File.name.lastIndexOf('.')),{type: this.image_card_after_File.type});
                const modun = 'EMPLOYEE-CARD-AFTER';
                const drawText = this.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.image_card_after = response.url;   
                    },
                    (error : any) => { 
                        this.image_card_after = EnumSystem.imageError;
                    }
                );
        }
    }

    loadImageFaceLeft() {
        if (this.image_face_left_File == undefined) {
            this.image_face_left = EnumSystem.imageError;
        } else {
            const formUploadImageFaceLeft = new FormData();
            formUploadImageFaceLeft.append('files', this.image_face_left_File);
            formUploadImageFaceLeft.append('ImageType', this.employee_code);
            formUploadImageFaceLeft.append('WriteLabel', this.employee_code);

            // this._file
            //     .UploadImage(formUploadImageFaceLeft)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_face_left =
            //                 EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.image_face_left = EnumSystem.imageError;
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_face_left_File], fileName+this.image_face_left_File.name.substring(this.image_face_left_File.name.lastIndexOf('.')),{type: this.image_face_left_File.type});
                const modun = 'EMPLOYEE-FACE-LEFT';
                const drawText = this.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.image_face_left = response.url;   
                    },
                    (error : any) => { 
                        this.image_face_left = EnumSystem.imageError;
                    }
                );
        }
    }

    loadImageFaceRight() {
        if (this.image_face_right_File == undefined) {
            this.image_face_right = EnumSystem.imageError;
        } else {
            const formUploadImageFaceRight = new FormData();
            formUploadImageFaceRight.append('files', this.image_face_right_File);
            formUploadImageFaceRight.append('ImageType', this.employee_code);
            formUploadImageFaceRight.append('WriteLabel', this.employee_code);

            // this._file
            //     .UploadImage(formUploadImageFaceRight)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_face_right =
            //                 EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.image_face_right = EnumSystem.imageError;
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_face_right_File], fileName+this.image_face_right_File.name.substring(this.image_face_right_File.name.lastIndexOf('.')),{type: this.image_face_right_File.type});
                const modun = 'EMPLOYEE-FACE-RIGHT';
                const drawText = this.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.image_face_right = response.url;   
                    },
                    (error : any) => { 
                        this.image_face_right = EnumSystem.imageError;
                    }
                );
        }
    }


    save_info() {
        // this.Clear();
        // return;  


        if (Helper.IsNull(this.image) == true) {
            this.image = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.image_card_before) == true) {
            this.image_card_before = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.image_card_after) == true) {
            this.image_card_after = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.image_face_left) == true) {
            this.image_face_left = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.image_face_right) == true) {
            this.image_face_right = EnumSystem.imageError;
        }

        if (Helper.IsNull(this.login_name) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a login name',
            });

            return;
        }
        if (Pf.checkUnsignedCode(this.login_name) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Login name is not allowed to enter accented characters',
            });

            return;
        }
        if (Pf.checkSpaceCode(this.login_name) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Login name must not contain empty characters',
            });

            return;
        }
        if (Helper.IsNull(this.employee_code) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a employee code',
            });

            return;
        }
        if (Pf.checkLengthCodeEmployee(this.employee_code) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Character length of employee code must be greater than 5',
            });

            return;
        }
        if (Pf.checkSpaceCode(this.employee_code) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Employee code must not contain empty characters',
            });

            return;
        }
        if (Pf.checkUnsignedCode(this.employee_code) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Employee code is not allowed to enter accented characters',
            });

            return;
        }
        if (Helper.IsNull(this.password) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a password',
            });

            return;
        }
        if (Helper.IsNull(this.employee_name) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a employee name',
            });

            return;
        }
        if (Helper.IsNull(this.card_number) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a CCCD',
                life: 3000,
            });

            return;
        }
        if (Pf.cardNumber(this.card_number) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'CCCD must have 9 digits or 12 digits',
                life: 3000,
            });
            return;
        }
        if (Helper.IsNull(this.mobile) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a mobile',
                life: 3000,
            });
            return;
        }
        if (Helper.IsNull(this.birthday_date) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a birthday date',
                life: 3000,
            });
            return;
        }

        const yearBirthday = parseInt(this.birthday_date.slice(0, 4));

        if (this.birthday_date.length > 10 || yearBirthday > this.year) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Birthday date is not valid',
                life: 3000,
            });
            return;
        }

        if (this.birthday_date.length > 10) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Birthday date is not valid',
                life: 3000,
            });
            return;
        }

        if (Helper.IsNull(this.email) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a email',
                life: 3000,
            });
            return;
        }
        if (Helper.checkMail(this.email) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Email address is not valid',
                life: 3000,
            });
            return;
        }
        if (Helper.IsNull(this.employee_type_id) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a employee type id',
                life: 3000,
            });
            return;
        }

        if (this.employee_type_id == 7) {
            if (this.item_ASM == 0) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Please enter a manager',
                    life: 3000,
                });
                return;
            }
        }

        const converBirth = Helper.convertDateFormat(this.birthday_date);
        this.birthday = converBirth;
        const numberString = Helper.numberToString(this.card_number);


        // if (this.checkExitsEmployee(this.employee_code, null, null, null, null) == 1) {
        //     console.log(1)
        //     return;
        // }
        // else {

        // }

        this.employeesService.ewo_Employee_checkExists(Helper.ProjectID(), this.employee_code, null, null, null, null)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.dataExits = data.data
                    if (Helper.IsNull(this.dataExits) != true && this.dataExits.length > 0) {
                        this.dataExits.forEach((element: any) => {
                            this.NofiDataExits(element.key, element.project_id, element.project_name, element.employee_id);
                        });
                        console.log(1)
                    } else {
                        this.employeesService.ewo_Employee_checkExists(Helper.ProjectID(), null, this.login_name, null, null, null)
                            .subscribe((data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    this.dataExits = data.data
                                    if (Helper.IsNull(this.dataExits) != true && this.dataExits.length > 0) {
                                        this.messageService.add({
                                            severity: 'warn',
                                            summary: 'Warning',
                                            detail: 'Login name already exists',
                                        });
                                        console.log(2)
                                    }
                                    else {
                                        console.log(3)
                                        this.dataExits = []
                                        this.employeesService
                                            .ewo_GetEmployeeList(10000, 1, this.employee_code, '', '',
                                                '', '', '', 0, 0, Helper.ProjectID(), -1, '', '')
                                            .subscribe((data: any) => {
                                                if (data.result == EnumStatus.ok) {
                                                    if (data.data[0]) {
                                                        this.messageService.add({
                                                            severity: EnumStatus.warning,
                                                            summary: EnumSystem.Notification,
                                                            detail: 'Employee code already exists',
                                                            life: 3000,
                                                        });

                                                        //   return;
                                                    } else {
                                                        this.employeesService
                                                            .ewo_GetEmployeeList(10000, 1, '', '', this.login_name, '',
                                                                '', '', 0, 0, Helper.ProjectID(), -1, '', '')

                                                            .subscribe((data: any) => {
                                                                if (data.result == EnumStatus.ok) {
                                                                    if (data.data[0]) {
                                                                        this.messageService.add({
                                                                            severity: EnumStatus.warning,
                                                                            summary: EnumSystem.Notification,
                                                                            detail: 'Login name already exists',
                                                                            life: 3000,
                                                                        });
                                                                        // return;
                                                                    } else {
                                                                        this.employeesService
                                                                            .ewo_GetEmployeeList(10000, 1, '', '', '',
                                                                                numberString, '', '', 0, 0, Helper.ProjectID(), -1, '', '')

                                                                            .subscribe((data: any) => {
                                                                                if (
                                                                                    data.result == EnumStatus.ok
                                                                                ) {
                                                                                    if (data.data[0]) {
                                                                                        this.messageService.add(
                                                                                            {
                                                                                                severity:
                                                                                                    EnumStatus.warning,
                                                                                                summary:
                                                                                                    EnumSystem.Notification,
                                                                                                detail: 'CCCD already exists',
                                                                                                life: 3000,
                                                                                            }
                                                                                        );
                                                                                        // return;
                                                                                    } else {
                                                                                        this.employeesService
                                                                                            .ewo_GetEmployeeList(10000, 1, '', '', '', '', this.mobile, '', 0,
                                                                                                0, Helper.ProjectID(), -1, '', '')
                                                                                            .subscribe(
                                                                                                (data: any) => {
                                                                                                    if (
                                                                                                        data.result ==
                                                                                                        EnumStatus.ok
                                                                                                    ) {
                                                                                                        if (
                                                                                                            data
                                                                                                                .data[0]
                                                                                                        ) {
                                                                                                            this.messageService.add(
                                                                                                                {
                                                                                                                    severity:
                                                                                                                        EnumStatus.warning,
                                                                                                                    summary:
                                                                                                                        EnumSystem.Notification,
                                                                                                                    detail: 'Mobile already exists',
                                                                                                                    life: 3000,
                                                                                                                }
                                                                                                            );
                                                                                                            // return;
                                                                                                        } else {
                                                                                                            this.employeesService
                                                                                                                .ewo_GetEmployeeList(10000, 1, '', '', '', '', '',
                                                                                                                    this.email, 0, 0, Helper.ProjectID(), -1, '', '')
                                                                                                                .subscribe((data: any) => {
                                                                                                                    if (data.result == EnumStatus.ok) {
                                                                                                                        if (data.data[0]) {
                                                                                                                            this.messageService.add(
                                                                                                                                {
                                                                                                                                    severity:
                                                                                                                                        EnumStatus.warning,
                                                                                                                                    summary:
                                                                                                                                        EnumSystem.Notification,
                                                                                                                                    detail: 'Email already exists',
                                                                                                                                    life: 3000,
                                                                                                                                }
                                                                                                                            );
                                                                                                                            // return;
                                                                                                                        } else {
                                                                                                                            this.project_id =
                                                                                                                                Helper.ProjectID();

                                                                                                                               
                                                                                                                            this.employeesService
                                                                                                                                .ewo_Create_Audit(
                                                                                                                                    this.login_name,
                                                                                                                                    this.password,
                                                                                                                                    Helper.ProjectID(),
                                                                                                                                    0, this.item_ASM,
                                                                                                                                    this.employee_code,
                                                                                                                                    this.employee_name,
                                                                                                                                    numberString,
                                                                                                                                    this.mobile,
                                                                                                                                    this.birthday,
                                                                                                                                    (Helper.IsNull(this.selectedGender) != true) ? this.selectedGender.key : null,
                                                                                                                                    this.email,
                                                                                                                                    this.employee_type_id,
                                                                                                                                    this.image,
                                                                                                                                    this.image_card_before,
                                                                                                                                    this.image_card_after,
                                                                                                                                    this.image_face_left,
                                                                                                                                    this.image_face_right,
                                                                                                                                    this.status == true ? 1 : 0
                                                                                                                                )

                                                                                                                                .subscribe((data: any) => {
                                                                                                                                    if (data.result == EnumStatus.ok) {
                                                                                                                                        this.NofiResult('Page Add User', 'Create User', 'Save employee successfully', 'success', 'Successful')

                                                                                                                                        this.Clear();
                                                                                                                                        return;
                                                                                                                                    } else {
                                                                                                                                        this.NofiResult('Page Add User', 'Create User', 'Save employee error', 'error', 'Error')


                                                                                                                                        return;
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                );
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                                );
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            );
                                                                                    }
                                                                                }
                                                                            });
                                                                    }
                                                                }
                                                            });
                                                    }
                                                }
                                            });
                                    }
                                }
                            })
                    }
                }

            })


    }


    dataExits: any = []
    checkExitsEmployee(employee_code: any, login_name: any, card_number: any, mobile: any, email: any): any {
        let check = 0
        this.employeesService.ewo_Employee_checkExists(Helper.ProjectID(), employee_code, login_name, card_number, mobile, email)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.dataExits = data.data
                    this.dataExits.forEach((element: any) => {
                        this.NofiDataExits(element.key, element.project_id, element.project_name, element.employee_id);
                        // this.confirmSaveInfo(element.employee_id + '');
                    });
                    check = 1
                    console.log('ewo_Employee_checkExists : ', check)
                } else {
                    this.dataExits = data.data
                }
                // return check
            })
        return 1
    }

    NofiDataExits(name: any, project_id: any, project_name: any, employee_id: any): any {
        const detail = (project_id == Helper.ProjectID()) ? `${name} already exists` :
            `Duplicate ${name} in project ${project_name} \n Do you want to add employees to your project?`;

        this.confirmationService.confirm({
            message: detail,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.shareProject(employee_id + '')
                this.Clear();
                // this.messageService.add({ severity: 'success', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                this.employee_code = ''
            }
        });

    }

    shareProject(employee_id: any) {
        this.employeesService.ewo_EmployeeProjects_ActionEmployee(employee_id, Helper.ProjectID(), 'add',)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.NofiResult('Page Create User', 'Add project employee', 'Add project employee successful', 'success', 'Successful');
                }
            })
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

    // onUploadFile(event: any) {
    //     const file: File = event.files[0];
    //     const newFileName: string = EnumFolderFile.excel + '.xlsx';
    //     const renamedFile: File = new File([file], newFileName, {
    //         type: file.type,
    //     });
    //     this.taskService.UploadFile(renamedFile).subscribe((data) => {

    //     });
    // }

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

        this.messageService.add({
            severity: 'info',
            summary: 'File Uploaded',
            detail: '',
        });
    }
    parent_employee_type: string = '';
    selectEmployeeType(event: any) {
        console.log('selectEmployeeType : ', event)
        try {
            // this.employee_type_id = event.Id;
            this.employee_type_id = event != null ? event.Id : 0;
            // this.parent_employee_type = event.parent + '';
        } catch (error) { }
    }

    checkAccountTest() {
        this.checked == false ? (this.is_test = 0) : (this.is_test = 1);
    }

    NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
            life: 3000,
        });

        AppComponent.pushMsg(
            page,
            action,
            name,
            severity == 'success' ? EnumStatus.ok : EnumStatus.error,
            0
        );

    }

}
