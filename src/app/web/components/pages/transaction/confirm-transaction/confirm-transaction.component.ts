import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { FileService } from 'src/app/web/service/file.service';
import { TransactionsService } from 'src/app/web/service/transactions.service';
import { EmployeesService } from '../../work-follow/service/employees.service';
import { DatePipe } from '@angular/common';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Pf } from 'src/app/_helpers/pf';

@Component({
    selector: 'app-confirm-transaction',
    templateUrl: './confirm-transaction.component.html',
    styleUrls: ['./confirm-transaction.component.scss'],
})
export class ConfirmTransactionComponent {
    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }
    constructor(
        private router: Router,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private fileService: FileService,
        private _service: TransactionsService,
        private _serviceEmp: EmployeesService
    ) {}
    dateStart: any | undefined;
    dateEnd: any | undefined;
    transaction_id: any;

    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    getSeverityStatus(value: any): any {
        switch (value) {
            case 'close':
                return 'warning';
            case 'draft':
                return 'help';
            case 'Done':
                return 'primary';
            case 'OK':
                return 'success';
            default:
                return 'danger';
        }
    }
    copyText(val: string) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    project_id: any;
    user_profile: string = 'current';
    currentUser: any;
    userProfile: any;
    UUID: any;

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
    list_nhan: any;
    div_transaction: any = 1;
    backTransaction() {
        this.div_transaction = 1;
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // let newDate = new Date();
        // this.dateEnd = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        // var dateObj = new Date();
        // var month = dateObj.getUTCMonth(); //months from 1-12
        // var year = dateObj.getUTCFullYear();
        // newDate = new Date(year, month, 1);
        // this.dateStart = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.project_id = Helper.ProjectID();
        this.loadUser();
        this.filterTransaction();
    }
    temp_rowData: any;
    ViewDetailTransaction(row: any, type: string) {
        this.note_confirm = '';
        this.temp_rowData = row;
        this.temp_rowData.type = type;
        this.div_transaction = 2;
        console.log(row);
        this._service
            .GET_Tractionsaction_detail(this.project_id, row.transaction_id)
            .subscribe((data: any) => {
                console.log(data);
                if (data.result == EnumStatus.ok) {
                    this.temp_rowData.file = data.data.transaction_file;
                    this.temp_rowData.history = data.data.transaction_history;
                    this.temp_rowData.product =
                        data.data.transaction_detail.filter(
                            (p: any) => p.item_type == 'PRODUCT'
                        );
                    this.temp_rowData.gift =
                        data.data.transaction_detail.filter(
                            (p: any) => p.item_type == 'GIFT'
                        );
                }
            });
    }
    note_confirm: any;
    confirm_OK() {
    this._service
    .transactions_Action(
        this.temp_rowData.transaction_id,
        0,
        0,
        '',
        3,
        this.note_confirm,
        this.project_id,
        '',
        'ok'
    )
    .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
            this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: 'Thành công',
            });
          this.filterTransaction();
        }
    });
    }
    confirm_Reject() {
        if (this.note_confirm == undefined || this.note_confirm == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter note confirm',
            });
            return;
        }
        this._service
            .transactions_Action(
                this.temp_rowData.transaction_id,
                0,
                0,
                '',
                4,
                this.note_confirm,
                this.project_id,
                '',
                'reject'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'success',
                        detail: 'Thành công',
                    });
                  this.filterTransaction();
                }
            });
    }
    filterTransaction() {
        var intDateStart = 0;
        try {
            intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        } catch (error) {}
        var intDateEnd = 0;
        try {
            intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));
        } catch (error) {}
        if (isNaN(intDateStart)) {
            intDateStart = 0;
        }
        if (isNaN(intDateEnd)) {
            intDateEnd = 0;
        }
        this.backTransaction();
        this._service
            .GET_transactions(
                this.transaction_id ?? 0,
                this.UUID,
                0,
                this.userProfile.employee_id,
                'EMPLOYEE',
                0,
                intDateStart,
                intDateEnd,
                -1,
                this.project_id,
                ''
            )
            .subscribe((nhan: any) => {
                if (nhan.result == EnumStatus.ok) {
                    this.list_nhan = undefined;
                    this.list_nhan = nhan.data.transaction.filter(
                        (i: any) => i.transaction_status > 1
                    );
                }
            });
    }
}
