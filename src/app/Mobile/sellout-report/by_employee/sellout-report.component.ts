import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { UserService } from 'src/app/web/service/user.service';

@Component({
    selector: 'app-sellout-report',
    templateUrl: './sellout-report.component.html',
    styleUrls: ['./sellout-report.component.scss'],
})
export class SelloutReportComponent {
    sidebarVisible: boolean = false;
    constructor(
        private activate: ActivatedRoute,
        private messageService: MessageService,
        private router: Router,
        private _edCrypt: EncryptDecryptService,
        private masterService: MastersService,
        private userService: UserService,
        public layoutService: LayoutService,
        public acti_service: ActivationService
    ) {}
    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }
    dateStart: any | undefined;
    dateEnd: any | undefined;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    getLanguage() {
        this.masterService
            .ewo_GetLanguage(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    localStorage.setItem('key_language', 'vn');
                    localStorage.setItem('language', JSON.stringify(data.data));
                }
            });
    }
    onSetDate() {
        let newDate = new Date();
        this.dateEnd = this.getFormatedDate(newDate, 'YYYY-MM-dd');

        var dateObj = new Date();
        var month = dateObj.getUTCMonth(); //months from 1-12
        var year = dateObj.getUTCFullYear();
        newDate = new Date(year, month, 1);
        this.dateStart = this.getFormatedDate(newDate, 'YYYY-MM-dd');
    }
    employee_id: any;
    userDecrypt: any;
    loginByToken(token: string) {
        localStorage.setItem(
            'theme-config',
            '{"config":{"ripple":false,"inputStyle":"outlined","menuMode":"overlay","colorScheme":"light","theme":"bootstrap4-light-blue","scale":9},"state":{"staticMenuDesktopInactive":false,"overlayMenuActive":false,"profileSidebarVisible":false,"configSidebarVisible":false,"staticMenuMobileActive":false,"menuHoverActive":false,"theme":false}}'
        );
        this.userService.loginByToken(token).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                let user_current = data.data;

                // console.log(this.user_current.token);
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
                    this.filter();
                } else {
                    alert('No project decentralization');
                }
            } else {
                alert('Wrong login information');
            }
        });
    }
    ListShop: any;
    selectShop: any;
    ListData!: any[];
    ngOnInit(): void {
        localStorage.removeItem('_u');
        localStorage.removeItem('user_profile');
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        if (Helper.getPrams('token', this.activate)) {
            this.loginByToken(Helper.getPrams('token', this.activate));
        }

        this.onSetDate();
    }
    openDetail(item: any) {
        if (item.detail == 0) {
            item.detail = 1;
            this.getDetail(item);
        } else {
            item.detail = 0;
        }
    }
    getDetail(item: any) {
        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));
        this.acti_service
            .MOBILE_web_GetSellOutReport(
                Helper.ProjectID(),
                intDateStart,
                intDateEnd,
                'detail',
                item.UUID
            )
            .subscribe((result: any) => {
                if (result.result == EnumStatus.ok) {
                    item.data_detail = result.data.data;
                }
            });
    }
    filter() {
        this.sidebarVisible = false;
        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.acti_service
            .MOBILE_web_GetSellOutReport(
                Helper.ProjectID(),
                intDateStart,
                intDateEnd,
                'result',
                null
            )
            .subscribe((result: any) => {
                if (result.result == EnumStatus.ok) {
                    this.ListData = [];
                    this.ListData = result.data.data;
                }
            });
    }
}
