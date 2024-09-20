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
    selector: 'app-list-leave.',
    templateUrl: './list-leave.component.html',
    styleUrls: ['./list-leave.component.scss'],
})
export class ListLeaveComponent {
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

    menu_id = 127;
    items_menu: any = [
        { label: 'PROCESS ' },
        { label: 'List leave', icon: 'pi pi-list' },
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
    leave_code: any;
    leave_name: any;

    openDialog = 0;
    ngOnInit() {
        this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
        this.project_id = Helper.ProjectID();

        this.loadData(1);
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
            .PrcGetListLeave(
                this.project_id,
                this.leave_code ? this.leave_code : '',
                this.leave_name ? this.leave_name : ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.data = data.data.list_leave;
                    this.data.forEach((e: any) => {
                        e.max_value =
                            e.max_value != null && e.max_value > 0
                                ? e.max_value
                                : '';
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
        leave_id: 0,
        leave_code: '',
        leave_name: '',
        configuration: '',
        is_leave: false,
        min_value: 0,
        max_value: 0,
    };

    openNew(type: string) {
        this.isEdit = false;
        this.openDialog = 1;
        this.type = type;
    }
    save(event: any) {
        if (
            this.checkValue(this.item.leave_code, 'Leave code') == 1 ||
            this.checkValue(this.item.leave_name, 'Leave name') == 1
        ) {
            return;
        }
        if (
            this.item.max_value > 0 &&
            this.item.min_value > this.item.max_value
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `The min value must be smaller than the max value`,
            });
            return;
        }
        if (this.item.min_value < 0.5) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `The min value must be lager than 0.5`,
            });
            return;
        }
        this._service
            .PrcListLeaveAction(
                this.item.leave_id,
                this.project_id,
                this.item.leave_code,
                this.item.leave_name,
                this.configuration && this.configuration.length > 0
                    ? this.configuration
                    : '',
                this.item.is_leave ? (this.item.is_leave == true ? 1 : 0) : 0,
                this.item.min_value ? this.item.min_value : 0,
                this.item.max_value ? this.item.max_value : 0,
                this.type
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.NofiResult(
                        'Page List Leave',
                        'Update List Leave',
                        'Update List Leave Successfull',
                        'success',
                        'SuccessFull'
                    );
                    this.loadData(1);
                    this.clearItem();
                    this.openDialog = 0;
                    this.openPrcsConfigDialog = false;
                } else {
                }
            });
    }

    clearItem() {
        this.item = {
            leave_id: 0,
            leave_code: '',
            leave_name: '',
            configuration: '',
            is_leave: false,
            min_value: 0,
            max_value: 0,
        };
    }
    openEdit(itemUpdate: any) {
        this.type = 'Update';
        this.openDialog = 1;
        this.isEdit = true;

        this.item.leave_id = itemUpdate.leave_id;
        this.item.leave_code = itemUpdate.leave_code;
        this.item.leave_name = itemUpdate.leave_name;
        this.item.configuration = itemUpdate.configuration;
        this.item.is_leave = itemUpdate.is_leave == 1 ? true : false;
        this.item.min_value = itemUpdate.min_value;
        this.item.max_value = itemUpdate.max_value;
    }

    openDelete(item: any, event: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .PrcListLeaveAction(
                        item.leave_id,
                        this.project_id,
                        item.leave_code,
                        item.leave_name,
                        item.configuration ? item.configuration : '',
                        item.is_leave ? (item.is_leave == true ? 1 : 0) : 0,
                        item.min_value ? item.min_value : 0,
                        item.max_value ? item.max_value : 0,
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

    configuration: any = [];
    openPrcsConfigDialog = false;
    openConfig(itemUpdate: any) {
        this.openPrcsConfigDialog = true;
        this.isEdit = true;
        this.type = 'Update';

        this.item.leave_id = itemUpdate.leave_id;
        this.item.leave_code = itemUpdate.leave_code;
        this.item.leave_name = itemUpdate.leave_name;
        this.item.configuration = itemUpdate.configuration;
        this.item.is_leave = itemUpdate.is_leave == 1 ? true : false;
        this.item.min_value = itemUpdate.min_value;
        this.item.max_value = itemUpdate.max_value;

        this.configuration = itemUpdate.configuration;
        if (this.configuration != null && this.configuration !== '') {
            const parsedObject = JSON.parse(this.configuration);
            const formattedJSON = JSON.stringify(parsedObject, null, 4);
            this.configuration = formattedJSON;
        }
    }
    someObject(item: any) {
        try {
            return JSON.parse(item);
        } catch (e) {
            return item;
        }
    }
    checkSomeObject(item: any) {
        try {
            let t = JSON.parse(item);
            return 0;
        } catch (e) {
            return 1;
        }
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
