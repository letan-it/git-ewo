import { DatePipe } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    Output,
    SimpleChanges,
    EventEmitter,
} from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Router } from '@angular/router';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { ReportsService } from 'src/app/web/service/reports.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
    providers: [ConfirmationService, DatePipe],
})
export class UserDetailComponent implements OnInit {
    constructor(
        private messageService: MessageService,
        private router: Router,
        private employeesService: EmployeesService,
        private datePipe: DatePipe,
        private _file: FileService,
        private taskService: TaskFileService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private reportsService: ReportsService
    ) {}

    @Input() inValue: any;
    @Input() action: any = 'view';
    @Output() newItemEvent = new EventEmitter<boolean>();
    @Output() newItemEventProject = new EventEmitter<boolean>();

    @Output() newItemParent = new EventEmitter<boolean>();
    currentUser: any;

    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];
    }
    displayProject: boolean = false;
    hideAddProject() {
        if (this.currentUser.employee_type_id == 1) {
            this.displayProject = true;
        } else {
            this.displayProject = false;
        }
    }
    project_id = Helper.ProjectID();
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
        this.projectName ();
        let newDate = new Date();
        this.date = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');

        this.loadUser();
        this.hideAddProject();

        try {
            this.inValue.device_info = JSON.parse(this.inValue.device_info);
        } catch (error) {}
        console.log(this.inValue);
    }
    is_test: string[] = [];
    checkIsTest: boolean = true;
    _verify: boolean = false;
    // project_list: any ;

    // project_list: any;
    selected_project: any;
    list_projectId: any;

    item_Project: any = 0;
    selectProject(event: any) {
        this.item_Project = event != null ? event : 0;
    }

    confirm(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employeesService
                    .ewo_menu_employee_Action(
                        this.inValue.employee_id,
                        Helper.ProjectID(),
                        2,
                        0,
                        0,
                        this.inValue.share_menu
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.inValue.share_menu = '';
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Confirmed',
                                detail: 'Success',
                            });
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }

    onRowEditInit(item: any) {}

    onRowEditSave(item: any) {
        item.check = item._check == true ? 1 : 0;
        this.employeesService
            .ewo_menu_employee_Action(
                this.inValue.employee_id,
                Helper.ProjectID(),
                1,
                item.menu_id,
                item.check,
                ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Confirmed',
                        detail: 'Success',
                    });
                }
            });
    }

    onRowEditCancel(product: any, index: number) {}
    menuRawData: any = [];
    loadMenuRawData(employee_id: number) {
        console.log('List Value ', this.inValue);
        this.reportsService
            .Report_permission_GetList(Helper.ProjectID(), employee_id)
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    if (res.data.length > 0) {
                        this.menuRawData = res.data.map((m: any) => ({
                            ...m,
                            _check: m.check == 1 ? true : false,
                        }));
                    }
                }
            });
    }
    onRowEditSaveRaw(item: any, employee_id: number) {
        this.reportsService
            .Report_permission_Action(
                Helper.ProjectID(),
                item.report_id,
                employee_id,
                item._check == true ? 1 : 0
            )
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    if (res.data == 1) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Confirmed',
                            detail: 'Success',
                        });
                    }
                }
            });
    }
    convertDateStr(item: any): any {
        return Helper.convertDateStr(item);
    }
    project_list: any = [];
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.

        this.itemEmployee =
            this.inValue != null ? this.inValue.employee_type_id : 0;

        if (changes['inValue'] || changes['action']) {
            try {
                if (Helper.IsNull(this.inValue.sex) != true) {
                    this.selectedGender = this.gerders.filter(
                        (x: any) => x.name == this.inValue.sex
                    )[0];
                }

                this._verify = this.inValue.verify == 1 ? true : false;
                // this.project_list = JSON.parse(this.inValue.project_list)
                this.inValue.project_list = JSON.parse(
                    this.inValue.project_list
                );
                this.project_list = this.inValue.project_list.filter(
                    (p: any) => p.project_id == Helper.ProjectID()
                )[0];

                console.log(
                    'inValue.project_list 001:',
                    this.inValue.project_list
                );
                console.log('project_list :', this.project_list);

                this.inValue.menu_list = JSON.parse(this.inValue.menu_list);
                for (let i = 0; i < this.inValue.menu_list.length; i++) {
                    const element = this.inValue.menu_list[i];
                    element._check = element.check == 1 ? true : false;
                    element.representative = {
                        name: `${element.orders_p}. ${element.label_parent}`,
                        order: element.orders_p,
                    };
                }

                this.itemPosition =
                    this.inValue.project_list != null
                        ? this.inValue.project_list.filter(
                              (data: any) =>
                                  data.project_id == Helper.ProjectID()
                          )[0].Position
                        : undefined;
                this.itemCategory =
                    this.inValue.project_list != null
                        ? this.inValue.project_list.filter(
                              (data: any) =>
                                  data.project_id == Helper.ProjectID()
                          )[0].Category
                        : undefined;

                this.parent_employee_type = this.inValue.employee_type_id + '';

                this.loadMenuRawData(this.inValue.employee_id);
                // this.inValue.birthday_date = Helper.formatDate(this.inValue.birthday_date)
            } catch (error) {}
        }
    }

    clickVerify() {
        this._verify == false ? true : false;
    }

    msgs: Message[] = [];
    // msgsInfo: Message[] = [];
    checked: boolean = false;
    // employee_type_id!: number;
    birthday!: number;

    image: string = '';

    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }

    updateOk: boolean = true;
    employeeCodeOne: number = 0;

    imageFile!: any;
    image_card_before_File!: any;
    image_card_after_File!: any;
    image_face_left_File!: any;
    image_face_right_File!: any;

    onImageErrorImageProfile(event: any, type: string) {
        if (type == 'image') {
            this.inValue.image = EnumSystem.imageError;
        }
        if (type == 'image_card_before') {
            this.inValue.image_card_before = EnumSystem.imageError;
        }
        if (type == 'image_card_after') {
            this.inValue.image_card_after = EnumSystem.imageError;
        }
        if (type == 'image_face_left') {
            this.inValue.image_face_left = EnumSystem.imageError;
        }
        if (type == 'image_face_right') {
            this.inValue.image_face_right = EnumSystem.imageError;
        } 
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
        const dataMonth = Helper.getMonth();
        this.ListMonth = dataMonth.ListMonth;
    }

    addProject() {
        // 'warn', summary: 'Waning'

        if (Helper.IsNull(this.item_Project) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter project',
            });
            return;
        }

        if (this.item_Project.length > 0) {
            let projectlistAdd = '';
            for (var i = 0; i < this.item_Project.length; i++) {
                projectlistAdd += this.item_Project[i].Id + ' ';
            }

            this.employeesService
                .ewo_EmployeeProjects_Action(
                    this.inValue.employee_id,
                    projectlistAdd,
                    'add'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        let listProject = '';
                        const result = data.data;

                        if (data.data.length > 0) {
                            if (
                                this.inValue.project_list.length !=
                                data.data.length
                            ) {
                                this.NofiResult(
                                    'Page User',
                                    'Add project employee',
                                    'Add project employee successful',
                                    'success',
                                    'Successfull'
                                );
                            } else {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Warning',
                                    detail: 'Project already exist',
                                });
                            }

                            this.inValue.project_list = data.data;
                            this.item_Project = undefined;

                            return;
                        }
                    }
                });
        }
    }
    resetDevice(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employeesService
                    .User_ResetDevice(
                        this.inValue.employee_id,
                        Helper.ProjectID()
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.inValue.device_info = {};
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }
    removeProject(event: Event) {
        if (this.inValue.project_list == null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please add project',
            });
            return;
        }
        const removeProject = this.inValue.project_list.filter(
            (item: any) => item.checked == true
        );

        if (removeProject.length > 0) {
            let projectlistAdd = '';
            for (var i = 0; i < removeProject.length; i++) {
                projectlistAdd += removeProject[i].project_id + ' ';
            }

            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Are you sure that you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.employeesService
                        .ewo_EmployeeProjects_Action(
                            this.inValue.employee_id,
                            projectlistAdd,
                            'remove'
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                if (data.data) {
                                    this.inValue.project_list = data.data;
                                    this.NofiResult(
                                        'Page User',
                                        'Remove project employee',
                                        'Remove project employee successful',
                                        'success',
                                        'Successfull'
                                    );
                                    return;
                                }
                            }
                        });
                },
                reject: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Rejected',
                        detail: 'You have rejected',
                    });
                },
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please choose a project',
            });

            return;
        }
    }

    onChangeImage(event: any) {
        this.imageFile = event.target.files[0];

        this.taskService
            .ImageRender(this.imageFile, this.imageFile.name)
            .then((file) => {
                this.imageFile = file;
            });

        if (this.imageFile == undefined) {
            this.inValue.image = EnumSystem.imageError;
        } else {
            const formUploadImage = new FormData();
            formUploadImage.append('files', this.imageFile);
            formUploadImage.append('ImageType', this.inValue.employee_code);
            formUploadImage.append('WriteLabel', this.inValue.employee_code);

            // this._file.UploadImage(formUploadImage).subscribe((data: any) => {
            //     if (data.result == EnumStatus.ok) {
            //         this.inValue.image = EnumSystem.fileLocal + data.data;
            //     }
            // });

            const fileName = AppComponent.generateGuid();
                const newFile = new File([this.imageFile], fileName+this.imageFile.name.substring(this.imageFile.name.lastIndexOf('.')),{type: this.imageFile.type});
                const modun = 'EMPLOYEE-PROFILE';
                const drawText = this.inValue.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.inValue.image = response.url;   
                    },
                    (error : any) => { 
                        this.inValue.image = EnumSystem.imageError;
                    }
                );
        }
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

        if (this.image_card_before_File == undefined) {
            this.inValue.image_card_before = EnumSystem.imageError;
        } else {
            const formUploadImageBefore = new FormData();
            formUploadImageBefore.append('files', this.image_card_before_File);
            formUploadImageBefore.append(
                'ImageType',
                this.inValue.employee_code
            );
            formUploadImageBefore.append(
                'WriteLabel',
                this.inValue.employee_code
            );

            // this._file
            //     .UploadImage(formUploadImageBefore)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.inValue.image_card_before =
            //                 EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.inValue.image_card_before = EnumSystem.imageError;
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_card_before_File], fileName+this.image_card_before_File.name.substring(this.image_card_before_File.name.lastIndexOf('.')),{type: this.image_card_before_File.type});
                const modun = 'EMPLOYEE-CARD-BEFORE';
                const drawText = this.inValue.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.inValue.image_card_before = response.url;   
                    },
                    (error : any) => { 
                        this.inValue.image_card_before = EnumSystem.imageError;
                    }
                );
        }
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

        if (this.image_card_after_File == undefined) {
            this.inValue.image_card_after = '';
        } else {
            const formUploadImageAfter = new FormData();
            formUploadImageAfter.append('files', this.image_card_after_File);
            formUploadImageAfter.append(
                'ImageType',
                this.inValue.employee_code
            );
            formUploadImageAfter.append(
                'WriteLabel',
                this.inValue.employee_code
            );

            // this._file
            //     .UploadImage(formUploadImageAfter)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.inValue.image_card_after =
            //                 EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.inValue.image_card_after = '';
            //         }
            //     });
                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_card_after_File], fileName+this.image_card_after_File.name.substring(this.image_card_after_File.name.lastIndexOf('.')),{type: this.image_card_after_File.type});
                const modun = 'EMPLOYEE-CARD-AFTER';
                const drawText = this.inValue.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.inValue.image_card_after = response.url;   
                    },
                    (error : any) => { 
                        this.inValue.image_card_after = EnumSystem.imageError;
                    }
                );

        
        }
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

        if (this.image_face_left_File == undefined) {
            this.inValue.image_face_left = '';
        } else {
            const formUploadImageFaceLeft = new FormData();
            formUploadImageFaceLeft.append('files', this.image_face_left_File);
            formUploadImageFaceLeft.append(
                'ImageType',
                this.inValue.employee_code
            );
            formUploadImageFaceLeft.append(
                'WriteLabel',
                this.inValue.employee_code
            );

            // this._file
            //     .UploadImage(formUploadImageFaceLeft)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.inValue.image_face_left =
            //                 EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.inValue.image_face_left = '';
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_face_left_File], fileName+this.image_face_left_File.name.substring(this.image_face_left_File.name.lastIndexOf('.')),{type: this.image_face_left_File.type});
                const modun = 'EMPLOYEE-FACE-LEFT';
                const drawText = this.inValue.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.inValue.image_face_left = response.url;   
                    },
                    (error : any) => { 
                        this.inValue.image_face_left = EnumSystem.imageError;
                    }
                );
        }
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

        if (this.image_face_right_File == undefined) {
            this.inValue.image_face_right = '';
        } else {
            const formUploadImageFaceRight = new FormData();
            formUploadImageFaceRight.append('files', this.image_face_right_File);
            formUploadImageFaceRight.append(
                'ImageType',
                this.inValue.employee_code
            );
            formUploadImageFaceRight.append(
                'WriteLabel',
                this.inValue.employee_code
            );

            // this._file
            //     .UploadImage(formUploadImageFaceRight)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.inValue.image_face_right =
            //                 EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.inValue.image_face_right = '';
            //         }
            //     });
                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_face_right_File], fileName+this.image_face_right_File.name.substring(this.image_face_right_File.name.lastIndexOf('.')),{type: this.image_face_right_File.type});
                const modun = 'EMPLOYEE-FACE-RIGHT';
                const drawText = this.inValue.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.inValue.image_face_right = response.url;   
                    },
                    (error : any) => { 
                        this.inValue.image_face_right = EnumSystem.imageError;
                    }
                );

        }
    }

    update_info() {
        if (Helper.IsNull(this.inValue.login_name) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a login name',
                life: 3000,
            });
            return;
        }

        if (Helper.IsNull(this.inValue.employee_code) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a employee code',
                life: 3000,
            });
            return;
        }
        if (Helper.IsNull(this.inValue.employee_name) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a employee name',
                life: 3000,
            });
            return;
        }
        if (Helper.IsNull(this.inValue.card_number) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter CCCD',
                life: 3000,
            });
            return;
        }

        if (Pf.cardNumber(this.inValue.card_number) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'CCCD must have 9 digits or 12 digits',
                life: 3000,
            });
            return;
        }

        if (Helper.IsNull(this.inValue.mobile) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a mobile',
                life: 3000,
            });
            return;
        }
        if (Pf.checkMobile(this.inValue.mobile) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Contact mobile is not valid',
                life: 3000,
            });
            return;
        }

        if (Helper.IsNull(this.inValue.birthday_date) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a birthday',
                life: 3000,
            });
            return;
        }

        const yearBirthday = parseInt(this.inValue.birthday_date.slice(0, 4));

        if (
            this.inValue.birthday_date.length > 10 ||
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

        if (Helper.IsNull(this.inValue.email) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a email',
                life: 3000,
            });
            return;
        }
        if (Helper.checkMail(this.inValue.email) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Incorrect email format',
                life: 3000,
            });
            return;
        }

        if (this.itemEmployee == 0) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a employee type',
                life: 3000,
            });
            return;
        }
        //   0 undefined
        // if (this.itemEmployee == 0) {
        //     this.itemEmployee = this.inValue.employee_type_id;
        // }
        if (
            this.itemEmployee == 7 ||
            (this.inValue.employee_type_id == 7 && this.itemEmployee == 0)
        ) {
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

        if (Helper.IsNull(this.inValue.image) == true) {
            this.inValue.image = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.inValue.image_card_before) == true) {
            this.inValue.image_card_before = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.inValue.image_card_after) == true) {
            this.inValue.image_card_after = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.inValue.image_face_left) == true) {
            this.inValue.image_face_left = EnumSystem.imageError;
        }
        if (Helper.IsNull(this.inValue.image_face_right) == true) {
            this.inValue.image_face_right = EnumSystem.imageError;
        }

        const converBirth = Helper.convertDateFormat(
            this.inValue.birthday_date
        );
        this.birthday = converBirth;

        const numberString = Helper.numberToString(this.inValue.card_number);

        this.employeesService
            .ewo_GetEmployeeList(
                10000,
                1,
                '',
                '',
                '',
                '',
                this.inValue.mobile,
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
                                this.inValue.employee_id)
                    ) {
                        this.messageService.add({
                            severity: EnumStatus.warning,
                            summary: EnumSystem.Notification,
                            detail: 'Mobile already exists',
                            life: 3000,
                        });
                        this.employeeCodeOne = data.data.length;

                        return;
                    } else {
                        this.employeesService
                            .ewo_GetEmployeeList(
                                10000,
                                1,
                                '',
                                '',
                                '',
                                '',
                                '',
                                this.inValue.email,
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
                                                this.inValue.employee_id)
                                    ) {
                                        this.messageService.add({
                                            severity: EnumStatus.warning,
                                            summary: EnumSystem.Notification,
                                            detail: 'Email already exists',
                                            life: 3000,
                                        });
                                        this.employeeCodeOne = data.data.length;

                                        return;
                                    } else {
                                        // 987654321
                                        // this.inValue.employee_code

                                        this.employeesService
                                            .ewo_GetEmployeeList(
                                                10000,
                                                1,
                                                '',
                                                '',
                                                '',
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
                                                                this.inValue
                                                                    .employee_id)
                                                    ) {
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
                                                        this.employeeCodeOne =
                                                            data.data.length;

                                                        return;
                                                    } else {
                                                        // {
                                                        //     "manager_id": 10012,
                                                        //     "card_number": "934532145",
                                                        //     "mobile": "0322222222",

                                                        this.employeesService
                                                            .ewo_Update(
                                                                this.inValue
                                                                    .login_name,
                                                                this.inValue
                                                                    .password,
                                                                this.inValue
                                                                    .employee_id,
                                                                this.item_ASM,
                                                                this.inValue
                                                                    .employee_code,
                                                                this.inValue
                                                                    .employee_name,
                                                                numberString,
                                                                this.inValue
                                                                    .mobile,
                                                                this.birthday,
                                                                Helper.IsNull(
                                                                    this
                                                                        .selectedGender
                                                                ) != true
                                                                    ? this
                                                                          .selectedGender
                                                                          .key
                                                                    : null,
                                                                this.inValue
                                                                    .email,
                                                                this
                                                                    .itemEmployee,
                                                                this.inValue
                                                                    .image,
                                                                this.inValue
                                                                    .image_card_before,
                                                                this.inValue
                                                                    .image_card_after,
                                                                this.inValue
                                                                    .image_face_left,
                                                                this.inValue
                                                                    .image_face_right,
                                                                this._verify ==
                                                                    true
                                                                    ? 1
                                                                    : 0,
                                                                this.inValue
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
                                                                            this.NofiResult(
                                                                                'Page User',
                                                                                'Update Account',
                                                                                'Success Update Account',
                                                                                'success',
                                                                                'Successful'
                                                                            );
                                                                            this.addNewItem();
                                                                        } else {
                                                                            this.NofiResult(
                                                                                'Page User',
                                                                                'Update Account',
                                                                                'Error Update Account',
                                                                                'error',
                                                                                'Error'
                                                                            );

                                                                            return;
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

    cancel() {
        // this.doSomethingOnClose() ;
    }

    parent_employee_type: string = '';
    itemEmployee: number = 0;
    selectEmployeeType(event: any) {
        try {
            this.itemEmployee = event != null ? event.Id : 0;
            this.parent_employee_type = event.parent + ''; // biến dư , check lại
            // this.inValue.manager_type_id = event.parent + '';
            this.inValue.manager_type_id = '';
        } catch (error) {
            this.inValue.manager_type_id = '';
        }
    }

    addItem(event: any) {
        this.parent_employee_type = event + '';
    }

    checkAccountTest() {
        this.checked == false
            ? (this.inValue.is_test = 0)
            : (this.inValue.is_test = 1);
    }

    addNewItem() {
        this.newItemEvent.emit(false);
    }

    addNewProject() {
        this.newItemEventProject.emit(true);
    }

    itemPosition: any = undefined;
    selectPosition(event: any) {
        this.itemPosition = event != null ? event.code : undefined;
    }
    updatePosition() {
        if (this.nofiIsNull(this.itemPosition, 'position') == 1) {
            return;
        } else {
            this.employeesService
                .ewo_EmployeePosition_Action(
                    Helper.ProjectID(),
                    this.inValue.employee_id,
                    this.itemPosition
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.NofiResult(
                                'Page User',
                                'Update position',
                                'Update Position Successfull',
                                'success',
                                'Successfull'
                            );
                            this.addNewItem();
                        }
                    }
                });
        }
    }
    itemCategory: any = undefined;
    selectCategory(event: any) {
        this.itemCategory = event != null ? event.code : undefined;
    }

    updateCategory() {
        if (this.nofiIsNull(this.itemCategory, 'category') == 1) {
            return;
        } else {
            this.employeesService
                .ewo_EmployeeCategory_Action(
                    Helper.ProjectID(),
                    this.inValue.employee_id,
                    this.itemCategory
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.NofiResult(
                                'Page User',
                                'Update category',
                                'Update Category Successfull',
                                'success',
                                'Successfull'
                            );

                            this.addNewItem();
                        }
                    }
                });
        }
    }

    checkAction(): any {
        const employee_type_id = this.currentUser.employee_type_id;
        return employee_type_id == 1 ||
            employee_type_id == 2 ||
            employee_type_id == 3
            ? true
            : false;
    }
    changePassword() {
        if (
            this.nofiIsNull(this.inValue.passEncrypt, 'password') == 1 ||
            this.nofiEquals(
                this.inValue.passEncrypt,
                this.inValue._passEncrypt,
                'The password is the same as the old password'
            ) == 1
        ) {
            return;
        } else {
            if (Pf.CheckPassword(this.inValue.passEncrypt) != true) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'The security of your password is poor',
                });
            }

            this.employeesService
                .ewo_ChangePassword_Audit(
                    this.inValue.employee_id,
                    this.inValue.passEncrypt
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.NofiResult(
                                `Page User`,
                                `Change the password`,
                                `Change the password ${this.inValue.passEncrypt} successfully for employees with code ${this.inValue.employee_code}`,
                                `success`,
                                `Successfull`
                            );
                            this.addNewItem();
                        }
                    } else {
                        this.NofiResult(
                            `Page User`,
                            `Change the password`,
                            `Change the password error`,
                            `error`,
                            `Error`
                        );

                        this.addNewItem();
                    }
                });
        }
    }
    nofiIsNull(value: any, name: any): any {
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }
    nofiEquals(value: any, value2: any, name: any): any {
        if (value == value2) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name,
            });
            return 1;
        }
        return 0;
    }

    CheckPassword(value: any, name: any): any {
        if (Pf.CheckPassword(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name,
            });
            return 1;
        }
        return 0;
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
