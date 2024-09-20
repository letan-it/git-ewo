import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, TreeNode } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { SurveyService } from 'src/app/web/service/survey.service';

@Component({
    selector: 'app-quick-test',
    templateUrl: './quick-test.component.html',
    styleUrls: ['./quick-test.component.scss'],
})
export class QuickTestComponent {

    items_menu: any = [
        { label: ' QUICK TEST' },
        { label: ' Result', icon: 'pi pi-check-square' },
    ];
    home: any = { icon: '', routerLink: '/quick-test' };
    constructor(
        private router: Router,

        private _serviceSurvey: SurveyService,

        private edService: EncryptDecryptService,
        private messageService: MessageService
    ) { }
    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }
    menu_id = 73;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '')?.filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }

    dateStart: any | undefined;
    dateEnd: any | undefined;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    user_profile: string = 'current';
    currentUser: any;
    userProfile: any;
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
    item_employee: number = 0;
    selectEmployee(event: any) {
        this.item_employee = event != null ? event.code : 0;
    }
    project_id: any = 0;
    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }
    ngOnInit() {
        this.loadUser();
        this.check_permissions();
        let newDate = new Date();
        this.project_id = Helper.ProjectID();
        this.dateEnd = this.getFormatedDate(newDate, 'YYYY-MM-dd');

        var dateObj = new Date();
        var month = dateObj.getUTCMonth(); //months from 1-12
        var year = dateObj.getUTCFullYear();
        newDate = new Date(year, month, 1);
        this.dateStart = this.getFormatedDate(newDate, 'YYYY-MM-dd');
    }
    isLoading_Filter: any = false;
    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
    }
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;
    ListReport: any = [];
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;

        this.filter(this._pageNumber);
    }
    visible: boolean = false;

    DetailItem: any;
    DetailItem_header: any;
    ShowDetail(item: any) {
        this.visible = true;
        this.DetailItem = item;
        this.DetailItem_header =
            'Kết quả ' + item.survey_name + ' nhân viên ' + item.employee_name;
        this._serviceSurvey
            .GET_DetailQuickTest(item.quick_result_id, item.survey_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.DetailItem.data = data.data.result
                }

            });
    }
    filter(pageNumber: number) {
        this.isLoading_Filter = true;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            // this.rows  = 20;
            this._pageNumber = 1;
        }

        if (Helper.IsNull(this.dateStart) == true) {
            this.NofiIsNull(this.dateStart, 'date start');
            return;
        }

        if (Helper.IsNull(this.dateEnd) == true) {
            this.NofiIsNull(this.dateEnd, 'date end');
            return;
        }
        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));
        this._serviceSurvey
            .GET_Quicktest(
                Helper.ProjectID(),
                intDateStart,
                intDateEnd,
                this.item_employee,
                this.rows,
                pageNumber
            )
            .subscribe((data: any) => {
                console.log(
                    '🚀 ~ QuickTestComponent ~ .subscribe ~ data:',
                    data
                );
                if (data.result == EnumStatus.ok) {
                    this.ListReport = [];
                    if (data.data.result.length > 0) {
                        this.ListReport = data.data.result;
                        this.totalRecords = this.ListReport[0].TotalRows;

                        this.isLoading_Filter = false;
                    } else {
                        this.isLoading_Filter = false;
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: 'No records',
                        });
                    }
                }
            });
    }
}
