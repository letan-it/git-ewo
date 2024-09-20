import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PrcsService } from '../../service/prcs.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';
import { AppComponent } from 'src/app/app.component';
import { Pf } from 'src/app/_helpers/pf';
import { EmployeesService } from 'src/app/web/service/employees.service';

@Component({
    selector: 'app-employee-leave.',
    templateUrl: './employee-leave.component.html',
    styleUrls: ['./employee-leave.component.scss'],
})
export class EmpployeeLeaveComponent {
    messages: Message[] | undefined;

    openNewTakeNote: boolean = false;
    openEditTakeNote: boolean = false;

    constructor(
        private router: Router,
        private _service: PrcsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _serviceEmp: EmployeesService
    ) {}

    currentDate: any;

    menu_id = 126;
    items_menu: any = [
        { label: 'PROCESS ' },
        { label: 'Empoyee leave', icon: 'pi pi-sign-out' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    check_permissions() {
        if (JSON.parse(localStorage.getItem('menu') + '') != null) {
            const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
                (item: any) => item.menu_id == this.menu_id && item.check == 1
            );
            if (menu.length > 0) {
            } else {
                this.router.navigate(['/empty']);
            }
        }
    }

    project_id: any;
    employee_id: any;
    openDialog = 0;
    ngOnInit() {
        this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
        this.project_id = Helper.ProjectID();
        this.loadEmployees();
        this.loadData(1);
    }
    employee_list: any = [];
    select_employee: any;
    clearSelectEmployee(event: any) {
        this.employee_id = 0;
    }
    selectEmployee(event: any) {
        this.employee_id = event.code || 0;
    }

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }

    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }

    isLoading_Filter: any = false;
    is_loadForm: number = 0;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

    data: any = [];
    loadData(pageNumber: number) {
        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.isLoading_Filter = true;
        this._service
            .PrcGetEmployeeLeave(
                this.project_id,
                this.employee_id ? this.employee_id : 0
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.data = data.data.employee_leave;
                    let historyList = data.data.list_history;
                    this.data.forEach((e: any) => {
                        let str = e.update_time ? e.update_time.split('T') : '';
                        e.update_time = e.update_time
                            ? str[0] + ' ' + str[1].substr(0, 8)
                            : '';
                        e.his = historyList.filter((h: any) => {
                            return h.id == e.id;
                        });
                    });

                    this.isLoading_Filter = false;
                    this.totalRecords =
                        this.data.length > 0 ? this.data.length : 0;
                } else {
                    this.data = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    //#region action
    type = '';
    isEdit = false;

    item = {
        id: 0,
        emp_id: 0,
        emp_name: '',
        leave_year: 0,
    };
    year: any;

    openNew(type: string) {
        this.isEdit = false;
        this.openDialog = 1;
        this.type = type;
    }
    save(event: any) {
        const y = new Date(this.year).getFullYear();
        if (
            this.checkValue(this.item.emp_id, 'employee id') == 1 ||
            this.checkValue(y, 'year') == 1 ||
            this.checkValue(this.item.leave_year, 'leave year') == 1
        ) {
            return;
        }

        this._service
            .PrcEmployeeLeaveAction(
                this.item.id,
                this.project_id,
                y,
                this.item.emp_id,
                this.item.leave_year,
                0,
                this.type
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.NofiResult(
                        'Page Employee Leave',
                        'Update Employee Leave',
                        'Update Employee Leave Successfull',
                        'success',
                        'SuccessFull'
                    );
                    this.loadData(1);
                    this.clearItem();
                    this.openDialog = 0;
                } else {
                }
            });
    }
    listEmp: any;
    listEmps: any = [];
    empId = '';

    selectedEmp: any;
    selectedListEmp(e: any) {
        this.item.emp_id = e.value === null ? 0 : e.value.code;
    }

    loadEmployees() {
        this._serviceEmp
            .ewo_GetEmployeeList(
                1000000,
                1,
                '',
                '',
                '',
                '',
                '',
                '',
                7,
                0,
                Helper.ProjectID(),
                -1,
                '',
                ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listEmp = [];
                    data.data.forEach((element: any) => {
                        this.listEmp.push({
                            name: `${element.employee_code} - ${element.employee_name}`,
                            code: element.employee_id,
                        });
                    });
                }
            });
    }

    clearItem() {
        this.item = {
            id: 0,
            emp_id: 0,
            emp_name: '',
            leave_year: 0,
        };
        this.year = null;
        this.selectedEmp = null;
    }

    openEdit(itemUpdate: any) {
        this.type = 'Update';
        this.openDialog = 1;
        this.isEdit = true;

        this.item.id = itemUpdate.id;
        this.item.emp_id = itemUpdate.employee_id;
        this.item.emp_name = itemUpdate.employee_name;
        this.item.leave_year = itemUpdate.leave_year;
        this.year = itemUpdate.year;
    }

    openDelete(item: any, event: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .PrcEmployeeLeaveAction(
                        item.id,
                        this.project_id,
                        item.year,
                        item.emp_id,
                        item.leave_year,
                        item.days_off_used,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.loadData(1);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Delete item successfully',
                                detail: '',
                            });
                        } else {
                            this.messageService.add({
                                severity: 'danger',
                                summary: 'Error',
                                detail: '',
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
    //#endregion

    // notification
    checkValue(value: any, name: any): any {
        let check = 0;
        if (
            value == 0 ||
            value < 0 ||
            (value != 0 && Helper.IsNull(value) == true)
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `Please enter ${name}`,
            });
            check = 1;
        }
        return check;
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
