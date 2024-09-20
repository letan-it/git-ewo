import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    ConfirmationService,
    MenuItem,
    Message,
    MessageService,
} from 'primeng/api';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { environment } from 'src/environments/environment';
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
import { DatePipe } from '@angular/common';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { log } from 'console';

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
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    providers: [ConfirmationService, DatePipe],
})
export class UserProfileComponent {
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
        private _service: EmployeesService,
        private _file: FileService
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
    // msgs: Message[] = [];
    // msgsAccount: Message[] = [];
    // msgsInfo: Message[] = [];
    msgsStore: Message[] = [];
    currentUser: any;
    userProfile: any;

    stateDeviceOptions: any[] = [
        { label: 'IOS', value: 'ios' },
        { label: 'Android', value: 'android' },
    ];
    value_device: string = 'android';

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

    checked: boolean = true;

    // uploadedFiles
    uploadedFiles: any[] = [];
    maxFileSize: number = 1000000;
    convertBirthday!: number;

    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }
    employee_type_id: number = 0;
    selectEmployeeType(event: any) {
        this.employee_type_id = event != null ? event.Id : 0;
    }
    _verify: boolean = false;

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

    ngOnInit(): void {
        this. projectName ();
        if (this.user_profile == EnumSystem.current) {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.currentUser.employee[0]._status =
                this.currentUser.employee[0].status == 1 ? true : false;
            this.userProfile = this.currentUser.employee[0];

            this._verify = this.userProfile.verify == 1 ? true : false;

            this.image = this.userProfile.image;
            this.image_card_before = this.userProfile.image_card_before;
            this.image_card_after = this.userProfile.image_card_after;

            this.image_face_left = this.userProfile.image_face_left;
            this.image_face_right = this.userProfile.image_face_right;
        }

        this.userProfile = this.currentUser.employee[0];
        this.password_old = this.userProfile.passEncrypt;
        this.value_device = this.userProfile.device;
        this.project_list = this.currentUser.projects;

        console.log('this.userProfile : ', this.userProfile)
        console.log('this.gerders.filter((x: any) => x.key == this.userProfile.sex :', this.gerders.filter((x: any) => x.key == this.userProfile.sex));
        if (Helper.IsNull(this.userProfile.sex) != true || this.userProfile.sex == 0) {
            this.selectedGender = this.gerders.filter((x: any) => x.key == this.userProfile.sex)[0];
        }
        console.log('this.selectedGender:', this.selectedGender)
        let newDate = new Date();
        this.date = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
    }

    date: any;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    selectMonth: any;
    ListMonth: any = [];
    year: any;
    getMonth(date: Date, format: string) {
        let today = new Date();
        this.year = today.getFullYear();
        const monthToday = today.getMonth() + 1;
        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }

        const dataMonth = Helper.getMonth()
        this.ListMonth = dataMonth.ListMonth

        const monthString = monthToday.toString().padStart(2, '0')
        const currentDate = parseInt(this.year + monthString)
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find((i: any) => (i?.code == currentDate))
        }

    }

    clickVerify() {
        this._verify == false ? true : false;
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

    Change_Password() {
        // this.disabledPassword = false ;

        if (Helper.IsNull(this.userProfile.passEncrypt) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a new password',
            });

            return;
        }

        if (this.userProfile.passEncrypt == this.password_old) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'New password medium with the original password',
            });
            return;
        }

        if (Helper.IsNull(this.confirmPassword) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please confirm password',
            });
            return;
        }

        if (this.userProfile.passEncrypt != this.confirmPassword) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Password and confirm password do not match',
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

                    this.NofiResult('Page User Profile', 'Change Password', 'Change Password Successfull ' + this.userProfile.passEncrypt, 'success', 'Successfull');

                    this.confirmPassword = '';
                }
            });
    }

    imageFile!: any;
    image_card_before_File!: any;
    image_card_after_File!: any;
    image_face_left_File!: any;
    image_face_right_File!: any;

    image!: string;
    image_card_before!: string;
    image_card_after!: string;
    image_face_left!: string;
    image_face_right!: string;
    onChangeImage(event: any) {
        this.imageFile = event.target.files[0];

        if (this.imageFile != undefined) {
            this.taskService
                .ImageRender(this.imageFile, this.imageFile.name)
                .then((file) => {
                    this.imageFile = file;
                });
            this.loadImage();
        } else {
            this.image = this.userProfile.image;
        }
    }

    onChangeImageBefore(event: any) {
        this.image_card_before_File = event.target.files[0];

        if (this.image_card_before_File != undefined) {
            this.taskService
                .ImageRender(
                    this.image_card_before_File,
                    this.image_card_before_File.name
                )
                .then((file) => {
                    this.image_card_before_File = file;
                });
            this.loadImageBefore();
        }
    }

    onChangeImageAfter(event: any) {
        this.image_card_after_File = event.target.files[0];

        if (this.image_card_after_File != undefined) {
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
    }
    onChangeImageFaceLeft(event: any) {
        this.image_face_left_File = event.target.files[0];

        if (this.image_face_left_File != undefined) {
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
    }

    onChangeImageFaceRight(event: any) {
        this.image_face_right_File = event.target.files[0];

        if (this.image_face_right_File != undefined) {
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
    }

    loadImage() {
        const formUploadImage = new FormData();
        formUploadImage.append('files', this.imageFile);
        formUploadImage.append('ImageType', this.userProfile.employee_code);
        formUploadImage.append('WriteLabel', this.userProfile.employee_code);

        // this._file.UploadImage(formUploadImage).subscribe((data: any) => {
        //     if (data.result == EnumStatus.ok) {
        //         // this.userProfile.image = EnumSystem.fileLocal + data.data;
        //         this.image = EnumSystem.fileLocal + data.data;
        //     }
        // });

            const fileName = AppComponent.generateGuid();
            const newFile = new File([this.imageFile], fileName+this.imageFile.name.substring(this.imageFile.name.lastIndexOf('.')),{type: this.imageFile.type});
            const modun = 'EMPLOYEE-PROFILE';
            const drawText = this.userProfile.employee_code;
            this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                (response : any) => {   
                    this.image = response.url;   
                },
                (error : any) => { 
                    this.image = '';
                }
            );
    }

    loadImageBefore() {
        if (this.image_card_before_File == undefined) {
            this.image_card_before = this.userProfile.image_card_before;
        } else {
            const formUploadImageBefore = new FormData();
            formUploadImageBefore.append('files', this.image_card_before_File);
            formUploadImageBefore.append(
                'ImageType',
                this.userProfile.employee_code
            );
            formUploadImageBefore.append(
                'WriteLabel',
                this.userProfile.employee_code
            );

            // this._file
            //     .UploadImage(formUploadImageBefore)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_card_before =
            //                 EnumSystem.fileLocal + data.data;
            //         }
            //     });
            const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_card_before_File], fileName+this.image_card_before_File.name.substring(this.image_card_before_File.name.lastIndexOf('.')),{type: this.image_card_before_File.type});
                const modun = 'EMPLOYEE-CARD-BEFORE';
                const drawText = this.userProfile.employee_code;
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
            this.image_card_after = this.userProfile.image_card_after;
        } else {
            const formUploadImageAfter = new FormData();
            formUploadImageAfter.append('files', this.image_card_after_File);
            formUploadImageAfter.append(
                'ImageType',
                this.userProfile.employee_code
            );
            formUploadImageAfter.append(
                'WriteLabel',
                this.userProfile.employee_code
            );

            // this._file
            //     .UploadImage(formUploadImageAfter)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_card_after =
            //                 EnumSystem.fileLocal + data.data;
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_card_after_File], fileName+this.image_card_after_File.name.substring(this.image_card_after_File.name.lastIndexOf('.')),{type: this.image_card_after_File.type});
                const modun = 'EMPLOYEE-CARD-AFTER';
                const drawText = this.userProfile.employee_code;
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
            this.image_face_left = this.userProfile.image_face_left;
        } else {
            const formUploadImageFaceLeft = new FormData();
            formUploadImageFaceLeft.append('files', this.image_face_left_File);
            formUploadImageFaceLeft.append(
                'ImageType',
                this.userProfile.employee_code
            );
            formUploadImageFaceLeft.append(
                'WriteLabel',
                this.userProfile.employee_code
            );

            // this._file
            //     .UploadImage(formUploadImageFaceLeft)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_face_left =
            //                 EnumSystem.fileLocal + data.data;
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_face_left_File], fileName+this.image_face_left_File.name.substring(this.image_face_left_File.name.lastIndexOf('.')),{type: this.image_face_left_File.type});
                const modun = 'EMPLOYEE-FACE-LEFT';
                const drawText = this.userProfile.employee_code;
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
            this.image_face_right = this.userProfile.image_face_right;
        } else {
            const formUploadImageFaceRight = new FormData();
            formUploadImageFaceRight.append('files', this.image_face_right_File);
            formUploadImageFaceRight.append(
                'ImageType',
                this.userProfile.employee_code
            );
            formUploadImageFaceRight.append(
                'WriteLabel',
                this.userProfile.employee_code
            );

            // this._file
            //     .UploadImage(formUploadImageFaceRight)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_face_right =
            //                 EnumSystem.fileLocal + data.data;
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_face_right_File], fileName+this.image_face_right_File.name.substring(this.image_face_right_File.name.lastIndexOf('.')),{type: this.image_face_right_File.type});
                const modun = 'EMPLOYEE-FACE-RIGHT';
                const drawText = this.userProfile.employee_code;
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
        if (Helper.IsNull(this.userProfile.image) == true) {
            this.userProfile.image = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.userProfile.image_card_before) == true) {
            this.userProfile.image_card_before = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.userProfile.image_card_after) == true) {
            this.userProfile.image_card_after = EnumSystem.imageError;
        }
        
        if (Helper.IsNull(this.userProfile.image_face_left) == true) {
            this.userProfile.image_face_left = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.userProfile.image_face_right) == true) {
            this.userProfile.image_face_right = EnumSystem.imageError;
        }

        if (Helper.IsNull(this.userProfile.employee_name) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a employee name',
            });

            return;
        }

        if (Helper.IsNull(this.userProfile.card_number) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a CCCD',
            });

            return;
        }

        if (Pf.cardNumber(this.userProfile.card_number) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'CCCD must have 9 digits or 12 digits',
            });

            return;
        }

        if (Helper.IsNull(this.userProfile.mobile) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a phone number',
            });

            return;
        }

        if (Helper.IsNull(this.userProfile.birthday_date) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a birthday',
            });

            return;
        }
        const yearBirthday = parseInt(
            this.userProfile.birthday_date.slice(0, 4)
        );

        if (
            this.userProfile.birthday_date.length > 10 ||
            yearBirthday > this.year ||
            this.year - yearBirthday < 16
        ) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Birthday date is not valid',
                life: 3000,
            });
            return;
        }

        if (Helper.IsNull(this.userProfile.email) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a email',
            });

            return;
        }

        if (Helper.checkMail(this.userProfile.email) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Email address is not valid',
            });

            return;
        }

        if (this.employee_type_id == 0) {
            this.employee_type_id = this.userProfile.employee_type_id;
        }

        const conver = Helper.convertDateFormat(this.userProfile.birthday_date);
        this.convertBirthday = conver;

        const numberString = Helper.numberToString(
            this.userProfile.card_number
        );

        // this.loadImage()
        // this.loadImageBefore()

        this.employeesService
            .ewo_GetEmployeeList(
                10000,
                1,
                '',
                '', '',
                '',
                this.userProfile.mobile,
                '',
                0,
                0,
                Helper.ProjectID(),
                -1,
                '',
                ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (
                        data.data.length > 1 ||
                        (data.data.length == 1 &&
                            data.data[0].employee_id !=
                            this.userProfile.employee_id)
                    ) {
                        this.messageService.add({
                            severity: EnumStatus.warning,
                            summary: EnumSystem.Notification,
                            detail: 'Mobile already exists',
                        });

                        return;
                    } else {
                        this.employeesService
                            .ewo_GetEmployeeList(
                                10000,
                                1,
                                '',
                                '',
                                '', '',
                                '',
                                this.userProfile.email,
                                0,
                                0,
                                Helper.ProjectID(),
                                -1,
                                '',
                                ''
                            )
                            .subscribe((data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    if (
                                        data.data.length > 1 ||
                                        (data.data.length == 1 &&
                                            data.data[0].employee_id !=
                                            this.userProfile.employee_id)
                                    ) {
                                        this.messageService.add({
                                            severity: EnumStatus.warning,
                                            summary: EnumSystem.Notification,
                                            detail: 'Email already exists',
                                        });

                                        return;
                                    } else {
                                        this.employeesService
                                            .ewo_GetEmployeeList(
                                                10000,
                                                1,
                                                '',
                                                '', '',
                                                numberString,
                                                '',
                                                '',
                                                0,
                                                0,
                                                Helper.ProjectID(),
                                                -1,
                                                '',
                                                ''
                                            )
                                            .subscribe((data: any) => {
                                                if (
                                                    data.result == EnumStatus.ok
                                                ) {
                                                    if (
                                                        data.data.length > 1 ||
                                                        (data.data.length ==
                                                            1 &&
                                                            data.data[0]
                                                                .employee_id !=
                                                            this.userProfile
                                                                .employee_id)
                                                    ) {
                                                        this.messageService.add(
                                                            {
                                                                severity:
                                                                    EnumStatus.warning,
                                                                summary:
                                                                    EnumSystem.Notification,
                                                                detail: 'CCCD already exists',
                                                            }
                                                        );

                                                        return;
                                                    } else {
                                                        // this.userProfile.verify

                                                        this.employeesService
                                                            .ewo_Update(
                                                                this.userProfile
                                                                    .login_name,
                                                                this.userProfile
                                                                    .password,
                                                                this.userProfile
                                                                    .employee_id,
                                                                this.userProfile
                                                                    .manager_id,
                                                                this.userProfile
                                                                    .employee_code,
                                                                this.userProfile
                                                                    .employee_name,
                                                                numberString,
                                                                this.userProfile
                                                                    .mobile,
                                                                this
                                                                    .convertBirthday,
                                                                (Helper.IsNull(this.selectedGender) != true) ? this.selectedGender.key : null,
                                                                this.userProfile
                                                                    .email,
                                                                this
                                                                    .employee_type_id,
                                                                this.image + '',
                                                                this
                                                                    .image_card_before +
                                                                '',
                                                                this
                                                                    .image_card_after +
                                                                '', this
                                                                .image_face_left +
                                                            '',
                                                            this
                                                            .image_face_right +
                                                        '',
                                                                this._verify ==
                                                                    true
                                                                    ? 1
                                                                    : 0,
                                                                this.userProfile
                                                                    ._status ==
                                                                    true
                                                                    ? 1
                                                                    : 0
                                                            )

                                                            .subscribe(
                                                                (data: any) => {
                                                                    if (
                                                                        data.result ==
                                                                        EnumStatus.ok
                                                                    ) {
                                                                        if (
                                                                            data.data
                                                                        ) {
                                                                            this.userProfile.image =
                                                                                this.image;
                                                                            this.userProfile.image_card_before =
                                                                                this.image_card_before;
                                                                            this.userProfile.image_card_after =
                                                                                this.image_card_after;
                                                                                this.userProfile.image_face_left =
                                                                                this.image_face_left;
                                                                                this.userProfile.image_face_right =
                                                                                this.image_face_right;
                                                                            this.userProfile.verify =
                                                                                data.data.verify;
                                                                            this.userProfile.status =
                                                                                data.data.status;

                                                                            this.currentUser.employee[0] =
                                                                                this.userProfile;

                                                                            localStorage.setItem(
                                                                                EnumLocalStorage.user,
                                                                                this.edService.encryptUsingAES256(
                                                                                    JSON.stringify(
                                                                                        this
                                                                                            .currentUser
                                                                                    )
                                                                                )
                                                                            );

                                                                            this.NofiResult('Page User Profile', 'Update Account', 'Update Account Successfull', 'success', 'Successfull');
                                                                        }
                                                                    } else {

                                                                        this.NofiResult('Page User Profile', 'Update Account', 'Update Account Error', 'error', 'Error');
                                                                        return;
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
