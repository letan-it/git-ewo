import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Helper } from 'src/app/Core/_helper';
import { PrcsService } from '../../service/prcs.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-add-plan',
    templateUrl: './add-plan.component.html',
    styleUrls: ['./add-plan.component.scss'],
    providers: [MessageService],
})
export class AddPlanComponent {
    project_id: number = 0;

    menu_id = 106; // FOCUS TABLE MENU IN DATABASE
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
        { label: ' Add plan', icon: 'pi pi-plus' },
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
        this.Config.user = this.currentUser || [];
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
        this.GetProcessByUser();
        //
        // this.GetEmployeeList();
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

    Config: any = {
        process: [],
        employee_list: [],
        shift_list: [],
        store_list: [],
        data_request: [],
        user: [],
    };
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
    select_employee: any;
    // GetEmployeeList() {
    //     this._service
    //         .PrcGetEmployeeList(this.project_id)
    //         .subscribe((r: any) => {
    //             if (r.result == EnumStatus.ok) {
    //                 this.Config.employee_list = r.data.employee_list;
    //                 if (this.Config.employee_list.length >= 1) {
    //                     this.select_employee = this.Config.employee_list[0];
    //                 }
    //             }
    //         });
    // }
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
    GetProcessByUser() {
        this._service.PrcGetprocess(this.project_id).subscribe((r: any) => {
            if (r.result == EnumStatus.ok) {
                this.Config.process = r.data.process_list.filter(
                    (i: any) => i.process_id == 1
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

    date_plan_day: Date[] | undefined;
    rangeDates: Date[] | any;

    openAccordion(event: any) {}
}
