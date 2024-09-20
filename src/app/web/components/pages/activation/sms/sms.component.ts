import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivationService } from 'src/app/web/service/activation.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html',
    styleUrls: ['./sms.component.scss'],
})
export class SmsComponent {
    messages: Message[] | undefined;

    constructor(
        private router: Router,
        private _service: ActivationService,
        private messageService: MessageService,
        private edService: EncryptDecryptService,
        private confirmationService: ConfirmationService
    ) {}

    menu_id = 120;
    items_menu: any = [
        { label: 'ACTIVATION ' },
        { label: ' SMS', icon: 'pi pi-inbox' },
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
    mobile: string = '';
    brandname: string = '';
    content_SMS: string = '';
    content_type: string = '';
    contentType: any;
    contentTypes: any = [{ name: 'SendOTP' }, { name: 'SendVoucherGOTIT' }];
    editContentTypes: any;
    selectedContentType(e: any) {
        this.contentType = e.value === null ? 0 : e.value.name;
    }
    onClearContentType() {
        this.contentType = '';
    }

    send_time: number = 0;
    firstDayInMonth: any;
    lastDayInMonth: any;
    send_time_int_from: any | undefined;
    send_time_int_to: any | undefined;

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
    listSMS: any = [];
    loadData(pageNumber: number) {
        this.is_loadForm = 1;
        this.first = 0;
        this.totalRecords = 0;

        this.isLoading_Filter = true;

        let intDateStart = 0;
        let intDateEnd = 0;

        this.send_time_int_from == undefined || this.send_time_int_from == ''
            ? (intDateStart = 0)
            : (intDateStart = parseInt(
                  Pf.StringDateToInt(this.send_time_int_from)
              ));
        this.send_time_int_to == undefined || this.send_time_int_to == ''
            ? (intDateEnd = 0)
            : (intDateEnd = parseInt(
                  Pf.StringDateToInt(this.send_time_int_to)
              ));

        if (intDateEnd < intDateStart && intDateEnd !== 0) {
            this.send_time_int_from = '';
            this.send_time_int_to = '';
            this.messageService.add({
                severity: 'warn',
                summary: 'The To Time must be greater than the From Time!',
                detail: '',
            });
            return;
        }

        this._service
            .SMS_Content_GetList(
                Helper.ProjectID(),
                this.mobile,
                this.brandname,
                this.content_SMS,
                intDateStart,
                intDateEnd,
                (this.content_type = this.contentType),
                this.rows,
                pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listSMS = data.data;
                    this.totalRecords =
                        Helper.IsNull(this.listSMS) !== true
                            ? this.listSMS[0].TotalRows
                            : 0;
                    this.isLoading_Filter = false;
                } else {
                    this.listSMS = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    ngOnInit() {
        // Pf.firstDayInMonth(this.firstDayInMonth);
        // this.send_time_int_from = Pf.firstDayInMonth(this.firstDayInMonth);
        // console.log(this.send_time_int_from);
        // Pf.lastDayInMonth(this.lastDayInMonth);
        // this.send_time_int_to = Pf.lastDayInMonth(this.lastDayInMonth);
        // console.log(this.send_time_int_to);
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
}
