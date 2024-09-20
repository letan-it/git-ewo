import { Component } from '@angular/core';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { UserService } from 'src/app/web/service/user.service';
import { SupervisionService } from '../service/supervision.service';
import { ActivatedRoute } from '@angular/router';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Pf } from 'src/app/_helpers/pf';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-monthly-timesheet',
    templateUrl: './monthly-timesheet.component.html',
    styleUrls: ['./monthly-timesheet.component.scss'],
})
export class MonthlyTimesheetComponent {
    constructor(
        private activate: ActivatedRoute,
        private userService: UserService,
        private _edCrypt: EncryptDecryptService,
        private masterService: MastersService,
        public acti_service: ActivationService,
        private _service: SupervisionService
    ) {}

    expandedRows = {};

    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }
    getLanguage() {
        this.masterService
            .ewo_GetLanguage(this.project_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    localStorage.setItem('key_language', 'vn');
                    localStorage.setItem('language', JSON.stringify(data.data));
                }
            });
    }

    firstDateOfMonth: any;
    lastDayMonth: any;
    lastDateOfMonth: any;
    monthYear: any;
    month: any;
    getDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        // this.currDate = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day}`;
        this.firstDateOfMonth = `${year}${month > 9 ? month : '0' + month}01`;
        this.lastDayMonth = Pf.lastDayCurrMonth('');
        this.lastDateOfMonth = `${year}${month > 9 ? month : '0' + month}${
            this.lastDayMonth
        }`;
        this.monthYear = `${month > 9 ? month : '0' + month}/${year}`;
        this.month = `${month}`;
        // this.currentDate = Helper.convertDateStr1(this.currDate);
    }

    employee_id: any;
    employee_id_route: any;
    shop_id: any;
    date: any;
    userDecrypt: any;
    loginByToken(token: string) {
        localStorage.setItem(
            'theme-config',
            '{"config":{"ripple":false,"inputStyle":"outlined","menuMode":"overlay","colorScheme":"light","theme":"bootstrap4-light-blue","scale":9},"state":{"staticMenuDesktopInactive":false,"overlayMenuActive":false,"profileSidebarVisible":false,"configSidebarVisible":false,"staticMenuMobileActive":false,"menuHoverActive":false,"theme":false}}'
        );
        this.userService.loginByToken(token).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                let user_current = data.data;
                const project = user_current.projects.filter(
                    (p: any) => p.project_id == Helper.ProjectID()
                );

                if (project.length > 0) {
                    const userEncrypt = this._edCrypt.encryptUsingAES256(
                        JSON.stringify(user_current.employee[0])
                    );
                    this.employee_id = user_current.employee[0].employee_id;
                    localStorage.setItem(
                        EnumLocalStorage.user_profile,
                        userEncrypt
                    );
                    this.userDecrypt = user_current.employee[0];

                    const dataEncrypt = this._edCrypt.encryptUsingAES256(
                        JSON.stringify(user_current)
                    );

                    localStorage.setItem(EnumLocalStorage.user, dataEncrypt);
                    this.getLanguage();
                    this.loadData();
                } else {
                    alert('No project decentralization');
                }
            } else {
                alert('Wrong login information');
            }
        });
    }

    timeSheetCalendar: any;
    timeSheetDetail: any;
    countWorkDay: any = 0;
    totalHourTime: any;
    loadData() {
        this._service
            .Mobile_Timekeeping_TimesheetDetails(
                this.project_id,
                this.employee_id_route,
                // 19508,
                this.firstDateOfMonth,
                this.lastDateOfMonth
                // 20240701,
                // 20240731
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.timeSheetCalendar = data.data.data_date;
                    let x: any[] = [];
                    data.data.data_time.forEach((item: any) => {
                        x.push({
                            ...item,
                            hourTotal:
                                +(item.total_time.split(':')[0] * 60) +
                                +(item.total_time.split(':')[1] * 60) +
                                +item.total_time.split(':')[2],
                            representative: {
                                date: item.atd_time_ci.slice(0, 10),
                                dateInt: Helper.transformDateInt(
                                    item.atd_time_ci.slice(0, 10)
                                ),
                                dayMonthYear: Helper.transformDayMonthYear(
                                    item.atd_time_ci.slice(0, 10)
                                ),
                            },
                        });
                    });

                    this.timeSheetDetail = x.sort(
                        Helper.compareValuesArrObjAsc('dateInt')
                    );

                    let totalTime = 0;
                    this.timeSheetDetail.map((item: any) => {
                        totalTime = totalTime + item.hourTotal;
                    });
                    this.totalHourTime = (totalTime / 3600).toFixed(2);

                    let newArr: any[] = [];
                    let onlyDateIntTimeSheetDetail: any[] = [];
                    this.timeSheetDetail.map((item: any) => {
                        newArr.push(item.representative.dateInt);
                    });
                    for (var i = 0; i < newArr.length; i++) {
                        if (
                            onlyDateIntTimeSheetDetail.indexOf(newArr[i]) === -1
                        ) {
                            onlyDateIntTimeSheetDetail.push(newArr[i]);
                        }
                    }
                    this.countWorkDay = onlyDateIntTimeSheetDetail.sort();
                }
            });
    }

    project_id: number = 0;
    token: any;
    link: any;
    ngOnInit(): void {
        this.project_id = Helper.ProjectID();
        this.getDate();
        localStorage.removeItem('_u');
        localStorage.removeItem('user_profile');

        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        if (Helper.getPrams('token', this.activate)) {
            this.token = this.activate.snapshot.queryParamMap.get('token');
            this.loginByToken(Helper.getPrams('token', this.activate));
            this.employee_id_route =
                this.activate.snapshot.queryParamMap.get('employee_id');
        }
    }

    openDetailInfoShop: boolean = false;
    dataDetailShop: any;
    detailInfoShop(data: any) {
        this.openDetailInfoShop = true;
        this.dataDetailShop = data;
    }

    turnBack(event: any) {
        // `${window.location.origin}/${window.location.pathname}/subordinate-list?month=${this.month}&token=${this.token}`,
        this.link = `${Helper.getRouterDomain()}/supervision/subordinate-list?month=${
            this.month
        }&token=${this.token}`;
        // window.history.back();
    }
}
