import { Component } from '@angular/core';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { UserService } from 'src/app/web/service/user.service';
import { SupervisionService } from '../service/supervision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-employee-sellout-list',
    templateUrl: './employee-sellout-list.component.html',
    styleUrls: ['./employee-sellout-list.component.scss'],
})
export class EmployeeSelloutListComponent {
    constructor(
        private router: Router,
        private activate: ActivatedRoute,
        private userService: UserService,
        private _edCrypt: EncryptDecryptService,
        private masterService: MastersService,
        public acti_service: ActivationService,
        private _service: SupervisionService
    ) {}

    inputStyle: any = { minWidth: '100%', maxWidth: '100%' };
    selectShop: any;
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

    listDataEmployee: any = []; // danh sách nhân viên đã chấm công
    listSellOutEmployee: any = []; // danh sách nhân viên trong doanh số bán hàng
    detailSellOutEmployee: any = []; // chi tiết doanh số từng nhân viên

    employee_id: any;
    employee_type: any;
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
                    this.employee_type =
                        user_current.employee[0].employee_type_id;

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

    month: any;
    start_time: any = null;
    currDate?: any;
    firstDateOfMonth: any;
    currentDate: any;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    getDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        this.currDate = `${year}${month > 9 ? month : '0' + month}${
            day > 9 ? day : '0' + day
        }`;
        this.firstDateOfMonth = `${year}${month > 9 ? month : '0' + month}01`;
        this.currentDate = Helper.convertDateStr1(this.currDate);

        // this.month = `${year}${month > 9 ? month : "0" + month}`
    }

    listShop: any;
    listShops: any = [];
    selectedListShop(e: any) {
        this.listShop = e.value === null ? 0 : e.value.shop_id;
    }

    CheckImage(image: any) {
        if (image == '' || image == null || image == undefined)
            return 'https://icons.iconarchive.com/icons/hopstarter/soft-scraps/128/User-Coat-Green-icon.png';
        else return image;
    }

    isLoading_Filter: any = false;
    loadData() {
        this.isLoading_Filter = true;

        this._service
            .MOBILE_web_Timekeeping_ListEmployee_JSE(
                this.project_id,
                Helper.transformDateInt(this.start_time) === 19700101
                    ? this.firstDateOfMonth
                    : Helper.transformDateInt(this.start_time),
                Helper.transformDateInt(this.start_time) === 19700101
                    ? this.currDate
                    : Helper.transformDateInt(this.start_time)
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    let mainData = data.data.data_result;

                    let employeeMap = new Map();
                    mainData.forEach((item: any) => {
                        if (!employeeMap.has(item.employee_id)) {
                            employeeMap.set(item.employee_id, {
                                employee_id: item.employee_id,
                                employee_name: item.employee_name,
                                email: item.email,
                                image: item.image,
                                mobile: item.mobile,
                                atd_date: item.atd_date,
                                tasks: [],
                            });
                        }

                        let employee = employeeMap.get(item.employee_id);
                        employee.tasks.push({
                            employee_id: item.employee_id,
                            areas: item.areas,
                            atd_date: item.atd_date,
                            atd_photo_ci: item.atd_photo_ci,
                            atd_photo_co: item.atd_photo_co,
                            atd_time_ci: item?.atd_time_ci,
                            atd_time_co: item.atd_time_co,
                            note: item.note,
                            second_time: item.second_time,
                            shift_code: item.shift_code,
                            shift_id: item.shift_id,
                            shop_code: item.shop_code,
                            shop_id: item.shop_id,
                            shop_name: item.shop_name,
                        });
                    });

                    this.listDataEmployee = Array.from(employeeMap.values());

                    let listShop: {
                        shop_id: any;
                        shop_name: any;
                        shop_code: any;
                    }[] = [];
                    mainData.forEach((item: any) => {
                        listShop.push({
                            shop_id: item.shop_id,
                            shop_name: item.shop_name,
                            shop_code: item.shop_code,
                        });
                    });

                    this.listShops = listShop;
                    this.isLoading_Filter = false;
                }
            });

        this._service
            .Mobile_SummarySellOut(this.project_id, this.month)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    for (let i = 0; i < data.data.employee_list.length; i++) {
                        let temp = data.data.employee_list[i].employee_id;
                        let emp = [];
                        for (
                            let j = 0;
                            j < data.data.sellout_bydate.length;
                            j++
                        ) {
                            if (
                                data.data.sellout_bydate[j].employee_id === temp
                            ) {
                                data.data.sellout_bydate[j].amount =
                                    Helper.formatCurrencyUnit(
                                        data.data.sellout_bydate[j].amount
                                    );
                                emp.push(data.data.sellout_bydate[j]);
                            }
                        }
                        data.data.employee_list[i].emp = emp;
                        data.data.employee_list[i].money =
                            Helper.formatCurrencyUnit(
                                data.data.employee_list[i].amount
                            );
                    }

                    this.listSellOutEmployee = data.data.employee_list;
                }
            });
    }

    project_id: number = 0;
    token: any;
    link: any;
    employee_id_route: any;
    ngOnInit(): void {
        this.getDate();
        this.project_id = Helper.ProjectID();
        localStorage.removeItem('_u');
        localStorage.removeItem('user_profile');

        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        if (Helper.getPrams('token', this.activate)) {
            this.token = this.activate.snapshot.queryParamMap.get('token');
            this.loginByToken(Helper.getPrams('token', this.activate));

            this.month = this.activate.snapshot.queryParamMap.get('month');
        }
    }

    empValue: any;
    openDetail(event: any, rawData: any) {
        this.empValue = rawData;
        // console.log(this.empValue);
    }

    turnBack(event: any) {
        this.link = `${Helper.getRouterDomain()}/supervision?token=${
            this.token
        }`;
        // window.history.back();
    }
}
