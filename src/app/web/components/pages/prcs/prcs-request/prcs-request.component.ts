import { Component, OnInit } from '@angular/core';
import { PrcsService } from '../service/prcs.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
    selector: 'app-prcs-request',
    templateUrl: './prcs-request.component.html',
    styleUrls: ['./prcs-request.component.scss'],
})
export class PrcsRequestComponent implements OnInit {
    constructor(
        private router: Router,
        private _service: PrcsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService
    ) {}

    menu_id = 102;
    items_menu: any = [
        { label: 'PROCESS ' },
        { label: ' Request', icon: 'pi pi-send' },
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

    currentUser: any;
    userProfile: any;

    employee_type_id = '7';
    project_id: number = 0;
    ngOnInit(): void {
        this.check_permissions();
        this.loadSelect();
        this.loadData(1);
        this.project_id = Helper.ProjectID();
        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));

        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];
        if (this.userProfile.employee_type_id == 1) {
            this.employee_type_id = '7 8';
        }
    }
    loadSelect() {
        this.GetPrc();
        this.GetStatus();
    }

    // Year month
    limitedFromDate: any | undefined;
    limitedToDate: any | undefined;
    limitedMaxDate: any = null;
    currentDate: any = null;
    listMonth: any = null;
    listMonths: any = [];
    year_month: any = null;
    date: any = null;
    created_date_int: any = null;
    orders: any = null;
    getDate() {
        let today = new Date();
        this.date = new Date(today);
        this.setDate(this.date);
    }
    setDate(date: any) {
        if (Helper.IsNull(date) != true) {
            this.created_date_int = Helper.convertDate(new Date(date));
            this.created_date_int = Helper.transformDateInt(
                new Date(this.created_date_int)
            );
        } else {
            this.created_date_int = null;
        }
    }
    // Year Month To
    listMonthTo: any = null;
    listMonthsTo: any = [];

    isLoading_Filter: any = false;

    projectList: any;

    fromDate: any | undefined;
    toDate: any | undefined;
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

    is_loadForm: number = 0;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    emp_id: number = 0;
    selectEmployee(event: any) {
        this.emp_id = event != null ? event.code : 0;
    }
    manager_id: number = 0;
    selectASM(event: any) {
        this.manager_id = event != null ? event.code : 0;
    }
    uuid: any = null;
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }
    listRequest: any = [];
    loadData(pageNumber?: number) {
        this.is_loadForm = 1;
        this.first = 0;
        this.totalRecords = 0;
        this.isLoading_Filter = true;

        let intDateStart = 0;
        let intDateEnd = 0;

        this.limitedFromDate == undefined || this.limitedFromDate == ''
            ? (intDateStart = 0)
            : (intDateStart = parseInt(
                  Pf.StringDateToInt(this.limitedFromDate)
              ));
        this.toDate == undefined || this.toDate == ''
            ? (intDateEnd = 0)
            : (intDateEnd = parseInt(Pf.StringDateToInt(this.toDate)));

        if (intDateEnd < intDateStart && intDateEnd !== 0) {
            this.limitedFromDate = '';
            this.toDate = '';
            this.messageService.add({
                severity: 'warn',
                summary: 'The end date must be greater than the starting date!',
                detail: '',
            });
            return;
        }

        let prc: any = 0;
        let status: any = '';
        if (!Helper.IsNull(this.action_status)) {
            status = this.action_status.code || '';
        }
        if (!Helper.IsNull(this.prc_id)) {
            prc = this.prc_id.Prc_id || 0;
        }

        this._service
            .Prc_ProjectGetRequest(
                Helper.ProjectID(),
                prc,
                intDateStart,
                intDateEnd,
                status,
                this.uuid,
                this.emp_id,
                this.manager_id
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listRequest = data.data.request_list;
                    this.totalRecords = this.listRequest.length || 0;

                    this.isLoading_Filter = false;
                    console.log(this.listRequest.length > 0);
                } else {
                    this.listRequest = [];
                    this.isLoading_Filter = false;
                }
            });
    }
    //#region get process
    prc_id: any = 0;
    prc_data: any = [];
    GetPrc() {
        this._service
            .PrcGetprocesbyProjects(Helper.ProjectID(), 0, -1)
            .subscribe((r: any) => {
                if (r.result == EnumStatus.ok) {
                    this.prc_data = r.data.process_list || [];
                }
            });
    }

    //#endregion

    //#region  get status
    action_status: any = '';
    status_data: any = [];
    GetStatus() {
        this._service
            .PrcActionStatus(Helper.ProjectID())
            .subscribe((r: any) => {
                if (r.result == EnumStatus.ok) {
                    this.status_data = r.data.action_status || [];
                }
            });
    }
    //#endregion
}
