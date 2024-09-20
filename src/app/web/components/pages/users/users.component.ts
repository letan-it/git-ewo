import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { ExportService } from 'src/app/web/service/export.service';
import { MastersService } from 'src/app/web/service/masters.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [ConfirmationService],
})
export class UsersComponent implements OnInit {
    menu_id = 6;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    project_id: any = Helper.ProjectID();
    employee_code: string = '';
    employee_name: string = '';
    login_name: string = '';
    card_number: string = '';
    mobile: string = '';
    email: string = '';

    is_test: string[] = [];
    manager_id: number = 0;

    display: boolean = false;
    EmployeeEdit: boolean = false;
    EmployeeView: boolean = false;
    showResetPass: boolean = false;

    employeeDetail: any;
    message: string = '';

    employee_type_id!: number;

    isLoading_Filter: any = false;

    constructor(
        private router: Router,
        private _service: EmployeesService,
        private serviceExport: ExportService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private masterService: MastersService
    ) { }
    is_loadForm: number = 0;
    viewEmployee() {
        this.EmployeeView = true;
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.ListEmployee.filter((item: any) => item._test == false)
            ? (this.checkAllTest = 0)
            : (this.checkAllTest = 1);
        console.log('ngOnChanges : ', this.checkAllTest);
    }
    statuses: any;
    currentUser: any;
    userProfile: any;
    item_Project: any;
    template_position: any =
        'assets/template/template_employee_position_import.xlsx';
    template_category: any =
        'assets/template/template_employee_category_import.xlsx';

    items: any;
    project: any;
    listPosition: any = [];
    items_menu: any;
    home: any;

    itemsAction: any;
    itemsRawData: any;
    ngOnInit() {
        this.loadUser();

        this.items_menu = [
            { label: ' PROJECT' },
            { label: ' User', icon: 'pi pi-user' },
        ];
        this.home = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
        this.masterService
            .ewo_GetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                this.listPosition = [];
                data.data.forEach((element: any) => {
                    if (
                        element.project_id == Helper.ProjectID() &&
                        element.ListCode == 'Employee.Position' &&
                        element.Status == 1
                    ) {
                        this.listPosition.push({
                            code: element.Code,
                            name: element.Code,
                        });
                    }
                });
            });

        this.check_permissions();
        this.project = Helper.ProjectID();
        // this.showFiter = 0;
        // (p: any) => p.project_id == Helper.ProjectID()

        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];

        this.statuses = [
            { label: 'Active', value: 1 },
            { label: 'In Active', value: 0 },
        ];
        this.item_Project = Helper.ProjectID();
        let newDate = new Date();
        this.template_position += '?v=' + newDate.toUTCString();
        this.template_category += '?v=' + newDate.toUTCString();
 

            this.items = [
                {
                    label: 'Import User',
                    icon: 'pi pi-upload',
                    command: () => {
                        this.ShowHideTemplate(0);
                    },
                },
                { separator: true },
                {
                    label: 'Import Position',
                    icon: 'pi pi-upload',
                    command: () => {
                        this.ShowHideTemplate(1);
                    },
                },
                { separator: true },
                {
                    label: 'Import Category',
                    icon: 'pi pi-upload',
                    command: () => {
                        this.ShowHideTemplate(2);
                    },
                },
                { separator: true },
                {
                    label: 'Import Working Date',
                    icon: 'pi pi-upload',
                    command: () => {
                        this.ShowHideTemplate(3);
                    },
                }, { separator: true },
                {
                    label: 'Close',
                    icon: 'pi pi-times',
                    command: () => {
                        this.close();
                    },
                },
            ];
        

        this.itemsAction = [
            {
                label: 'Reset Pass',
                icon: 'pi pi-refresh',
                command: () => {
                    this.resetPass();
                },
            },
            // { separator: true },
            // {
            //     label: 'Project',
            //     icon: 'pi pi-file-edit',
            //     command: () => {
            //         this.viewAddRemoveProject();
            //     },
            // },
            { separator: true },
            {
                label: 'Create Employee',
                icon: 'pi pi-plus',
                command: () => {
                    this.addUser();
                },
            }
        ];

        this.itemsRawData = [
            {
                label: 'Employee List',
                icon: 'pi pi-file-export',
                command: () => {
                    this.export(1);
                },
            },
            { separator: true },
            {
                label: 'Employee Position',
                icon: 'pi pi-file-export',
                command: () => {
                    this.export(2);
                },
            },
            { separator: true },
            {
                label: 'Employee Category',
                icon: 'pi pi-file-export',
                command: () => {
                    this.export(3);
                },
            }
        ];

        this.itemsDataProject = [
            {
                label: 'Add item',
                icon: 'pi pi-plus',
                command: () => {
                    this.addProject();
                },
            },
            { separator: true },
            {
                label: 'Add All (' + this.totalRecords + ' item)',
                icon: 'pi pi-plus',
                command: () => {
                    this.addAllProject();
                },
            },
        ];
    }

    itemStatus: any = -1;
    selectStatus(event: any) {
        event.value != null
            ? (this.itemStatus = event.value)
            : (this.itemStatus = -1);
    }
    @ViewChild('myInputFile') myInputFile: any;
    clearFileInput() {
        this.myInputFile.nativeElement.value = null;
        this.file = undefined;
    }

    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }

    item_EmployeeType: number = 0;
    parent_employee_type: string = '';
    selectEmployeeType(event: any) {
        try {
            this.employee_type_id = event != null ? event.Id : 0;

            this.parent_employee_type = event.parent + '';
        } catch (error) { }
    }

    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }

    typeImport: number = 0;
    showTemplate: number = 0;
    ShowHideTemplate(value: any) {
        this.showTemplate = 1;
        this.typeImport = value;
        this.clearDataImport();
    }
    close() {
        this.showTemplate = 0;
    }

    showTemplatePosition: number = 0;
    ShowHideTemplatePosition() {
        if (this.showTemplatePosition == 1) {
            this.showTemplatePosition = 0;
        } else {
            this.showTemplatePosition = 1;
        }
    }

    clearDataImport() {
        this.dataError = undefined;
        this.dataMessError = undefined;
        this.dataErrorPosition = undefined;
        this.dataErrorCategory = undefined;
        this.dataErrorDate = undefined;
    }

    file!: any;
    // On file Select
    onChange(event: any) {
        this.clearDataImport();
        this.file = event.target.files[0];
    }

    exportTemplate() {
        // this._service.ewo_Employee_GetTemplate();
        this._service.ewo_Employee_GetTemplate_Audit();
    }

    getTemplateEmpDate() {
        this._service.ewo_EmployeeProjects_GetTemplate(Helper.ProjectID());
    }
    dataError: any;
    dataMessError: any;
    dataErrorPosition: any;
    dataErrorCategory: any;
    dataErrorDate: any;

    importTemplate() {
        if (Helper.IsNull(this.file) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter file',
            });
            return;
        } else {
            this.clearDataImport();

            const formDataUpload = new FormData();

            formDataUpload.append('files', this.file);

            this.returnImportData(this.typeImport, formDataUpload);
        }
    }

    importEmployee(formDataUpload: any) {
        this._service
            .ewo_Employee_ImportData_Audit(formDataUpload, Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Success Create Employee',
                    });
                } else {
                    if (data.data == null) {
                        this.dataMessError = data.message;

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: this.dataMessError,
                        });
                    } else {
                        this.dataError = data.data;
                    }
                }
                this.clearFileInput();
            });
    }

    importEmployeePosition(formDataUpload: any) {
        this._service
            .ewo_EmployeePositionCategory_ImportData(
                formDataUpload,
                Helper.ProjectID(),
                'ewo_EmployeePosition_ImportData'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.NofiResult('Page User', 'Add position employee', 'Add position employee successful', 'success', 'Successful');

                } else {
                    if (data.data == null) {
                        this.dataMessError = data.message;

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: 'Please select the correct file to import template file',
                        });
                    } else {
                        this.dataErrorPosition = data.data;
                    }
                }

                this.clearFileInput();
            });
    }

    importEmployeeCategory(formDataUpload: any) {
        this._service
            .ewo_EmployeePositionCategory_ImportData(
                formDataUpload,
                Helper.ProjectID(),
                'ewo_EmployeeCategory_ImportData'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {

                    this.NofiResult('Page User', 'Add category employee', 'Add category employee successful', 'success', 'Successfull');
                } else {
                    if (data.data == null) {
                        this.dataMessError = data.message;

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: 'Please select the correct file to import template file',
                        });
                    } else {
                        this.dataErrorCategory = data.data;
                    }
                }

                this.clearFileInput();
            });
    }

    importEmployeeDate(formDataUpload: any) {
        this._service
            .ewo_EmployeeProjects_ImportData(
                formDataUpload,
                Helper.ProjectID()
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {

                    this.NofiResult('Page User', 'Add join date', 'Add join date employee successful', 'success', 'Successfull');
                } else {
                    if (data.data == null) {
                        this.dataMessError = data.message;

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: 'Please select the correct file to import template file',
                        });
                    } else {
                        this.dataErrorDate = data.data;
                    }
                }

                this.clearFileInput();
            });
    }

    returnImportData(typeNumber: any, formDataUpload: any) {
        switch (typeNumber) {
            case 0:
                return this.importEmployee(formDataUpload);
            case 1:
                return this.importEmployeePosition(formDataUpload);
            case 2:
                return this.importEmployeeCategory(formDataUpload);
            case 3:
                return this.importEmployeeDate(formDataUpload);
            default:
                throw new Error(`Non-existent size in switch: ${typeNumber}`);
        }
    }
    returnLabel(typeNumber: any) {
        switch (typeNumber) {
            case 0:
                return 'Upload File User';
            case 1:
                return 'Upload File Position';
            case 2:
                return 'Upload File Category';
            case 3:
                return 'Upload File Date';
            default:
                throw new Error(`Non-existent size in switch: ${typeNumber}`);
        }
    }
    update(item: any) {
        item._passEncrypt = item.passEncrypt
        this.employeeDetail = item;
        this.EmployeeEdit = true;
    }

    OK() {
        this.EmployeeEdit = false;
        this.display = false;
    }
    export(value: any) {
        if (value == 1) {
            let is_test = 0;
            this.serviceExport.ewo_ExportEmployeeList(
                this.totalRecords,
                1,
                0,
                this.employee_code,
                this.employee_name,
                this.login_name,
                this.card_number,
                this.mobile,
                this.email,
                this.employee_type_id,
                this.item_ASM,
                Helper.ProjectID()
            );
        } else if (value == 2) {
            this.serviceExport.ewo_Employee_Export(Helper.ProjectID(), 'ewo_EmployeePosition_Export')
        } else {
            this.serviceExport.ewo_Employee_Export(Helper.ProjectID(), 'ewo_EmployeeCategory_Export')
        }

    }

    ListEmployee: any = [];
    filter(pageNumber: number) {
        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            // this.rows = this.rows;
            this._pageNumber = 1;
        }

        if (this.employee_type_id == undefined) {
            this.employee_type_id = 0;
        }

        this.isLoading_Filter = true;

        this._service
            .ewo_GetEmployeeList(
                this.rows,
                pageNumber,
                this.employee_code,
                this.employee_name,
                this.login_name,
                this.card_number,
                this.mobile,
                this.email,
                this.employee_type_id,
                this.item_ASM,
                Helper.ProjectID(),
                this.itemStatus,
                this.itemPosition,
                this.itemCategory
            )

            .subscribe((data: any) => {
                this.is_loadForm = 0;
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListEmployee = [];
                        this.ListEmployee = data.data;
                        this.ListEmployee = this.ListEmployee.map(
                            (item: any) => ({
                                ...item,
                                _test: item.is_test == 1 ? true : false,
                                _status: item.status == 1 ? true : false,
                            })
                        );

                        this.totalRecords = this.ListEmployee[0].TotalRows;
                        this.itemsDataProject = [
                            {
                                label: 'Add item',
                                icon: 'pi pi-plus',
                                command: () => {
                                    this.addProject();
                                },
                            },
                            { separator: true },
                            {
                                label: 'Add All (' + this.totalRecords + ' item)',
                                icon: 'pi pi-plus',
                                command: () => {
                                    this.addAllProject();
                                },
                            },
                        ];

                        this.isLoading_Filter = false;
                    } else {
                        this.isLoading_Filter = false;
                        this.message = 'No data';
                        this.display = true;
                        this.ListEmployee = [];
                    }
                }
            });
    }

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;

        this._pageNumber = (this.first + this.rows) / this.rows;

        this.filter(this._pageNumber);
    }

    addItem(newItem: boolean) {
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Success Update Account'});
        this.filter(1);
        this.EmployeeEdit = newItem;
    }

    itemProject(newItem: boolean) {
        if (newItem == true) {
            this.filter(this._pageNumber);
            this.EmployeeView = true;
        }
    }

    addUser() {
        this.router.navigate(['/add-user']);
    }
    checkAllTest: number = 0;

    chooseAll() {
        this.checkAllTest == 0
            ? (this.checkAllTest = 1)
            : (this.checkAllTest = 0);

        this.checkAllTest == 1
            ? (this.ListEmployee = this.ListEmployee.map((item: any) => ({
                ...item,
                _test: item.role > 0 ? true : false,
            })))
            : (this.ListEmployee = this.ListEmployee.map((item: any) => ({
                ...item,
                _test: false,
            })));

        // this.ListEmployee.filter((item : any ) => item._test == false) ? this.checkAllTest = 0 : this.checkAllTest = 1
    }

    // "employee_id": "10013 10014",
    // "project_id": 1,
    // "action": "remove"

    showAddRemoveProject: number = 0;
    viewAddRemoveProject() {
        this.showAddRemoveProject == 0
            ? (this.showAddRemoveProject = 1)
            : (this.showAddRemoveProject = 0);
    }

    _itemProject: any = 0;
    selectProject(event: any) {
        this._itemProject = event != null ? event.Id : 0;
    }

    selectedEmployee: any = [];
    selectedFilterEmployee(e: any) {
        console.log(e);
        this.selectedEmployee = e.value === null ? 0 : e.value.Id;
    }
    itemsDataProject: any;

    onChoose() {

        this.itemsDataProject = [
            {
                label: 'Add (' + this.selectedEmployee.length + ') item',
                icon: 'pi pi-plus',
                command: () => {
                    this.addProject();
                },
            },
            { separator: true },
            {
                label: 'Add All (' + this.totalRecords + ') item)',
                icon: 'pi pi-plus',
                command: () => {
                    this.addAllProject();
                },
            },
        ];

    }

    addProject() {
        // warn', summary: 'Waning
        if (this._itemProject == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter project',
            });
            return;
        }

        this.selectedEmployee = this.selectedEmployee.filter(
            (data: any) => data.role > 0
        );

        if (this.selectedEmployee.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter employee',
            });
            return;
        } else {
            let employeeListAdd = '';
            for (var i = 0; i < this.selectedEmployee.length; i++) {
                employeeListAdd += this.selectedEmployee[i].employee_id + ' ';
            }

            this._service
                .ewo_EmployeeProjects_ActionEmployee(
                    employeeListAdd,
                    this._itemProject,
                    'add'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {

                        this.NofiResult('Page User', 'Add project employee', 'Add project employee successful', 'success', 'Successful');
                        this._itemProject = 0;
                        this.selectedEmployee = [];
                        this.filter(1);
                        return;
                    }
                });
        }
    }
    AllEmployee: any;

    addAllProject() {
        if (this._itemProject == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter project',
            });
            return;
        }
        if (this.ListEmployee.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please press the filter button',
            });
            return;
        } else {

            this._service.ewo_GetEmployeeList(this.totalRecords, 1, this.employee_code,
                this.employee_name,
                this.login_name, this.card_number, this.mobile, this.email,
                this.employee_type_id, this.item_ASM, Helper.ProjectID(),
                this.itemStatus, this.itemPosition, this.itemCategory)

                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data.length > 0) {

                            this.AllEmployee = data.data.filter((item: any) => item.role > 0);

                            let employeeListAdd = '';
                            for (var i = 0; i < this.AllEmployee.length; i++) {
                                employeeListAdd += this.AllEmployee[i].employee_id + ' ';
                            }

                            this._service
                                .ewo_EmployeeProjects_ActionEmployee(
                                    employeeListAdd,
                                    this._itemProject,
                                    'add'
                                )
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {

                                        this.NofiResult('Page User', 'Add project employee', 'Add project employee successful', 'success', 'Successful');
                                        this._itemProject = 0;
                                        this.selectedEmployee = [];
                                        this.filter(1);
                                        return;
                                    }
                                });

                        }
                    }
                })
        }
    }

    removeProject(event: Event) {
        if (this._itemProject == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter project',
            });
            return;
        }

        this.selectedEmployee = this.selectedEmployee.filter(
            (data: any) => data.role > 0
        );

        if (this.selectedEmployee.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter employee',
            });
            return;
        } else {
            let employeeListAdd = '';
            for (var i = 0; i < this.selectedEmployee.length; i++) {
                employeeListAdd += this.selectedEmployee[i].employee_id + ' ';
            }

            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Are you sure that you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._service
                        .ewo_EmployeeProjects_ActionEmployee(
                            employeeListAdd,
                            this._itemProject,
                            'remove'
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {

                                this.NofiResult('Page User', 'Remove project employee', 'Remove project employee successful', 'success', 'Successfull');
                                this._itemProject = 0;
                                this.selectedEmployee = [];
                                this.filter(1);
                                return;
                            }
                        });
                },
                reject: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Rejected',
                        detail: 'You have rejected',
                    });
                    this._itemProject = 0;
                    this.selectedEmployee = [];
                    this.filter(1);
                    return;
                },
            });
        }
    }

    itemPosition: any = '';
    selectPosition(event: any) {
        this.itemPosition = event != null ? event.code : '';
    }

    itemCategory: any = '';
    selectCategory(event: any) {
        this.itemCategory = event != null ? event.code : '';
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

    user_profile: string = 'current';

    loadUser() {
        if (this.user_profile == EnumSystem.current) {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.currentUser.employee[0]._status =
                this.currentUser.employee[0].status == 1 ? true : false;
            this.userProfile = this.currentUser.employee[0];

        }
    }


    userCode: any;
    passwordCode: any;
    resetPass() {
        if (this.selectedEmployee.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please select Employees you want to reset password!',
                detail: '',
            })
        } else {    
            this.showResetPass = true;
            console.log(this.selectedEmployee.map((item: any) => item.passEncrypt));
        }
    }
    confirmResetPass() {
        this._service.ChangePassWordS(
            this.selectedEmployee.map((item: any) => item.employee_code).join(" "),
            this.passwordCode
        ).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                
                this.showResetPass = false;
                this.filter(1);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Reset Password successfully',
                    detail: '',
                })

                this.selectedEmployee = []
            } else {
                this.showResetPass = false;
                this.messageService.add({
                    severity: 'danger',
                    summary: 'Error',
                    detail: '',
                });
            }
        })
    }
}
