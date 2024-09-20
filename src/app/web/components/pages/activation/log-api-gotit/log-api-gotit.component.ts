import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivationService } from 'src/app/web/service/activation.service';
import { Message, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
    selector: 'app-log-api-gotit',
    templateUrl: './log-api-gotit.component.html',
    styleUrls: ['./log-api-gotit.component.scss'],
})
export class LogApiGotitComponent {
    messages: Message[] | undefined;

    constructor(
        private router: Router,
        private _service: ActivationService,
        private messageService: MessageService
    ) {}

    menu_id = 121;
    items_menu: any = [
        { label: 'ACTIVATION ' },
        { label: ' Log API GOTIT', icon: 'pi pi-file' },
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

    //
    uuid: string = '';
    guid: string = '';
    url: string = '';
    currDate?: any;
    currentDate: any;
    start_time: any = null;
    end_time: any;
    employee_code: string = '';
    getDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        this.currDate = `${year}${month > 9 ? month : '0' + month}${
            day > 9 ? day : '0' + day
        }`;
        this.currentDate = Helper.convertDateStr1(this.currDate);
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
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }
    listLogApiGotit: any = [];
    loadData(pageNumber: number) {
        this.is_loadForm = 1;
        this.first = 0;
        this.totalRecords = 0;
        this.isLoading_Filter = true;

        if (Helper.transformDateInt(this.start_time) > +this.currDate) {
            this.isLoading_Filter = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày hiện tại!',
                detail: '',
            });
            return;
        } else if (
            Helper.transformDateInt(this.start_time) >
            Helper.transformDateInt(this.end_time)
        ) {
            this.isLoading_Filter = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc!',
                detail: '',
            });
            return;
        } else {
            this._service
                .GotIT_CallAPI_GetList(
                    Helper.ProjectID(),
                    this.uuid,
                    this.guid,
                    this.url,
                    this.employee_code,
                    this.start_time === undefined
                        ? this.currDate
                        : Helper.transformDateInt(this.start_time),
                    this.end_time === undefined
                        ? this.currDate
                        : Helper.transformDateInt(this.end_time),
                    this.rows,
                    pageNumber
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.listLogApiGotit = data.data;
                        this.totalRecords =
                            Helper.IsNull(this.listLogApiGotit) !== true
                                ? this.listLogApiGotit[0].TotalRows
                                : 0;
                        this.isLoading_Filter = false;
                    } else {
                        this.listLogApiGotit = [];
                        this.isLoading_Filter = false;
                    }
                });
        }
    }

    ngOnInit() {
        this.getDate();
        this.loadData(1);
        this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
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
}
