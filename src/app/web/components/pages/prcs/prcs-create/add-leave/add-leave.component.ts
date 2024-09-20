import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrcsService } from '../../service/prcs.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { AppComponent } from 'src/app/app.component';
import { Helper } from 'src/app/Core/_helper';

@Component({
    selector: 'app-add-leave',
    templateUrl: './add-leave.component.html',
    styleUrls: ['./add-leave.component.scss'],
    providers: [MessageService],
})
export class AddLeaveComponent {
    project_id: number = 0;

    menu_id = 108; // FOCUS TABLE MENU IN DATABASE
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

    items_menu: any = [
        { label: 'REQUEST ' },
        { label: ' Add leave', icon: 'pi pi-sign-out' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    constructor(
        private router: Router,
        private _service: PrcsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService
    ) {}

    currentUser: any;
    minDate: Date | any;
    transaction_uuid = '';
    ngOnInit(): void {
        this.transaction_uuid = AppComponent.generateGuid();
        this.project_id = Helper.ProjectID();
        //this.check_permissions();
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];
        // console.log(this.currentUser);

        let today = new Date();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        let prevMonth = month === 0 ? 11 : month - 1;
        let prevYear = prevMonth === 11 ? year - 1 : year;
        let nextMonth = month === 11 ? 0 : month + 1;
        let nextYear = nextMonth === 0 ? year + 1 : year;
        this.minDate = new Date();
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        //---- load configuration
        this.GetProcess();
        //
        this.GetEmployeeList();
    }

    form_add_plan = 0;
    selectDate() {
        if (this.date_plan_day == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a plan day',
            });
            return;
        }
        if (this.select_employee == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a employee',
            });
            return;
        }
        this.GetStore(this.select_employee.employee_id);
    }
    convertDate(dateString: string): string {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return `${year}${month}${day}`;
    }
    date_plan_day: Date[] | undefined;

    Config: any = {
        process: [],
        employee_list: [],
        shift_list: [],
        store_list: [],
        data_request: [],
    };

    // PrcGetprocess
    select_shop: any;
    selectedShop(event: any) {
        if (this.form_add_plan === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: 'Vui lòng chọn ngày tháng',
            });
        }
    }
    select_shift: any;
    from_time: any;
    to_time: any;
    GetProcess() {
        this._service.PrcGetprocess(this.project_id).subscribe((r: any) => {
            if (r.result == EnumStatus.ok) {
                this.Config.process = r.data.process_list.filter(
                    (i: any) => i.process_id == 4
                );
                this.Config.process.forEach((element: any) => {
                    try {
                        element.config = JSON.parse(element.config);
                    } catch (error) {}
                });
                this.Config.shift_list = r.data.shift_list;
                this.Config.process.forEach((element: any) => {
                    element.step = r.data.prc_process_by_step.filter(
                        (i: any) => i.Prc_id == element.Prc_id
                    );
                });
            }
        });
    }

    // PrcGetStorePermission
    GetStore(employee_id: number) {
        this._service
            .PrcGetStorePermission(this.project_id, employee_id)
            .subscribe((r: any) => {
                if (r.result == EnumStatus.ok) {
                    this.form_add_plan = 1;
                    this.Config.store_list = r.data.store_list;
                }
            });
    }

    // PrcGetEmployeeList
    select_employee: any;
    GetEmployeeList() {
        this._service
            .PrcGetEmployeeList(this.project_id)
            .subscribe((r: any) => {
                if (r.result == EnumStatus.ok) {
                    this.Config.employee_list = r.data.employee_list;
                    if (this.Config.employee_list.length == 1) {
                        this.select_employee = this.Config.employee_list[0];
                    }
                }
            });
    }

    clearSelect() {
        this.select_shop = null;
        this.select_shift = null;
        this.from_time = '';
        this.to_time = '';
    }
    data_request_table: any = [];
    index_edit: number = -1;
    btnAdd = 'Thêm vào request';
    addRequest() {
        let fromTime: any;
        let toTime: any;
        let emp_id: any;
        let shop_id: any;
        let shift_id: any;
        let planDate = Helper.transformDateInt(this.date_plan_day) || 0;
        let check = false;

        if (!this.select_employee) {
            this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: 'Chưa chọn nhân viên',
            });
            check = true;
        } else {
            emp_id = this.select_employee.employee_id || 0;
        }
        if (!this.select_shop) {
            this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: 'Chưa chọn cửa hàng',
            });
            check = true;
        } else {
            shop_id = this.select_shop.shop_id || 0;
        }
        if (!this.select_shift) {
            this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: 'Chưa chọn ca',
            });
            check = true;
        } else {
            shift_id = this.select_shift.shift_id || 0;
        }
        if (this.from_time) {
            fromTime = new Date(this.from_time).toISOString();
        }
        if (this.to_time) {
            toTime = new Date(this.to_time).toISOString();
        }

        if (check == true) {
            return;
        } else {
            if (
                this.Config.data_request.find(
                    (e: any) =>
                        e.employee_id == emp_id &&
                        e.shop_id == shop_id &&
                        e.shift_id == shift_id &&
                        e.plan_date == planDate
                ) &&
                this.index_edit == -1
            ) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'error',
                    detail: 'Trùng nhân viên, shop và ca',
                });
                return;
            } else {
                let tmp = {
                    transaction_uuid: this.transaction_uuid || '',
                    employee_id: emp_id,
                    shop_id: shop_id,
                    plan_date: planDate,
                    shift_id: shift_id,
                    from_time: fromTime || null,
                    to_time: toTime || null,
                };
                let FH = new Date(this.from_time) || null;
                let TH = new Date(this.to_time) || null;
                let H = '';
                if (
                    !Number.isNaN(FH.getHours()) &&
                    !Number.isNaN(TH.getHours())
                ) {
                    H =
                        ' (' +
                        FH.getHours() +
                        ':' +
                        FH.getMinutes() +
                        '-' +
                        TH.getHours() +
                        ':' +
                        TH.getMinutes() +
                        ')';
                }
                let tmp2 = {
                    emp: this.select_employee.employee_name,
                    shop: this.select_shop.shop_name,
                    shift: this.select_shift.shift_code,
                    time: Helper.convertDateStr1(planDate) + H || '',
                };
                if (this.index_edit > -1) {
                    this.Config.data_request[this.index_edit] = tmp;
                    this.data_request_table[this.index_edit] = tmp2;
                    this.index_edit = -1;
                    this.btnAdd = 'Thêm vào request';
                } else {
                    this.Config.data_request.push(tmp);
                    this.data_request_table.push(tmp2);
                }
                this.clearSelect();
            }
        }
    }
    delete(index: number) {
        if (index >= 0 && index < this.Config.data_request.length) {
            this.Config.data_request.splice(index, 1);
            this.data_request_table.splice(index, 1);
        }
    }
    edit(index: number) {
        if (index >= 0 && index < this.Config.data_request.length) {
            let tmp = this.Config.data_request[index] || null;
            if (tmp) {
                this.select_shop = this.Config.store_list.find(
                    (e: any) => e.shop_id == tmp.shop_id
                );
                this.select_shift = this.Config.shift_list.find(
                    (e: any) => e.shift_id == tmp.shift_id
                );
                if (this.Config.employee_list.length == 1) {
                    this.select_employee = this.Config.employee_list[0];
                } else {
                    this.select_employee = this.Config.employee_list.find(
                        (e: any) => e.employee_id == tmp.employee_id
                    );
                }
                if (tmp.from_time) {
                    this.from_time = new Date(tmp.from_time);
                }
                if (tmp.to_time) {
                    this.to_time = new Date(tmp.to_time);
                }
                this.index_edit = index;
                this.btnAdd = 'Chỉnh sửa dòng ' + (this.index_edit + 1);
            }
        }
    }
    cancelEdit() {
        this.index_edit = -1;
        this.btnAdd = 'Thêm vào request';
        this.clearSelect();
    }
    save(prc_id: number, step: any) {
        console.log(
            'save',
            prc_id,
            step.find((e: any) => e.action_id == 1)
        );
        const step_id = step.find((e: any) => e.action_id == 1).step_id;
        this._service
            .PrcRegisterWorkingplan(
                Helper.ProjectID(),
                this.transaction_uuid,
                prc_id,
                step_id,
                1,
                '',
                this.Config.data_request
            )
            .subscribe((res: any) => {
                if (res.result === EnumStatus.ok) {
                    this.NofiResult(
                        'Page request plan',
                        'Request Promotion',
                        `Success request plan`,
                        'success',
                        'Successful'
                    );
                    this.Config.data_request = [];
                    this.data_request_table = [];
                }
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
