import { Component } from '@angular/core';
import { ActivationService } from 'src/app/web/service/activation.service';
import { SummaryWorkshiftService } from '../service/summary-workshift.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { UserService } from 'src/app/web/service/user.service';
import { ActivatedRoute } from '@angular/router';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-report-summary-by-date',
    templateUrl: './report-summary-by-date.component.html',
    styleUrls: ['./report-summary-by-date.component.scss'],
})
export class ReportSummaryByDateComponent {
    constructor(
        private activate: ActivatedRoute,
        private userService: UserService,
        private _edCrypt: EncryptDecryptService,
        private masterService: MastersService,
        public acti_service: ActivationService,
        private summaryWorkshift: SummaryWorkshiftService
    ) {}

    screenWidth = window.innerWidth;
    filterStatus: boolean = false;
    dateStart?: any | undefined;
    dateEnd?: any | undefined;
    w = window.innerWidth;
    h = window.innerHeight;

    value = [
        {
            label: 'Apps',
            color1: '#34d399',
            color2: '#fbbf24',
            value: 25,
            icon: 'pi pi-table',
        },
        {
            label: 'Messages',
            color1: '#fbbf24',
            color2: '#60a5fa',
            value: 15,
            icon: 'pi pi-inbox',
        },
        {
            label: 'Media',
            color1: '#60a5fa',
            color2: '#c084fc',
            value: 20,
            icon: 'pi pi-image',
        },
        {
            label: 'System',
            color1: '#c084fc',
            color2: '#c084fc',
            value: 10,
            icon: 'pi pi-cog',
        },
    ];

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
                // console.log(project);

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
                    this.getDate();
                } else {
                    alert('No project decentralization');
                }
            } else {
                alert('Wrong login information');
            }
        });
    }

    project_id: number = 0;
    ngOnInit(): void {
        this.project_id = Helper.ProjectID();
        localStorage.removeItem('_u');
        localStorage.removeItem('user_profile');

        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        if (Helper.getPrams('token', this.activate)) {
            this.date = this.activate.snapshot.queryParamMap.get('date');

            this.loginByToken(Helper.getPrams('token', this.activate));
        }
    }

    formatAmount(amount: number): string {
        if (amount >= 1000000000) {
            return (amount / 1000000000).toFixed(2).replace('.', ',') + 'B';
        } else if (amount >= 1000000) {
            return (amount / 1000000).toFixed(2).replace('.', ',') + 'M';
        } else {
            return amount?.toString();
        }
    }

    currDate?: string;
    calendarVal: any = null;
    calendarValue: any = null;
    created_date_int: any = null;
    getDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        this.currDate = `${day > 9 ? day : '0' + day}/${
            month > 9 ? month : '0' + month
        }/${year}`;

        if (this.employee_type === 8) {
            this.employee_id = 0;
        } else if (this.employee_type === 7) {
            this.loadData();
        }
    }
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
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

    listProduct: any;
    listSmoker: any;
    listSummary: any;
    listGift: any;
    select: any;
    ListData!: any[];
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

    clearSelectEmployee(event: any) {
        this.employee_id = 0;
    }
    selectEmployee(event: any) {
        this.employee_id = event.code || 0;
        this.loadData();
    }

    listRawData: any = [];
    summaryGift: any = [];
    listDetailGift: any = [];
    popupDetailGift: boolean = false;
    summaryProduct: any = [];
    listDetailProduct: any = [];
    popupDetailProduct: boolean = false;
    listDetailSurvey: any = [];
    popupDetailSurvey: boolean = false;
    loadData() {
        this.summaryWorkshift
            .MOBILE_web_SummarySellOutByDate_JSE(
                this.project_id,
                this.employee_id,
                parseInt(this.date),
                parseInt(this.date)
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listRawData = data.data.data;
                    // Gift
                    let shopMapGift = new Map();
                    data.data.detail_gift.forEach((item: any) => {
                        if (!shopMapGift.has(item.shop_id)) {
                            shopMapGift.set(item.shop_id, {
                                shop_id: item.shop_id,
                                shop_code: item.shop_code,
                                shop_name: item.shop_name,
                                gifts: [],
                            });
                        }
                        let shopGift = shopMapGift.get(item.shop_id);
                        shopGift.gifts.push({
                            shop_id: item.shop_id,
                            work_date: item.work_date,
                            gift_id: item.gift_id,
                            gift_code: item.gift_code,
                            gift_name: item.gift_name,
                            gift_image: item.gift_image,
                        });
                    });
                    this.listDetailGift = Array.from(shopMapGift.values());

                    let detailGiftMap = new Map();
                    this.listDetailGift.forEach((item: any) => {
                        item.gifts.forEach((element: any) => {
                            if (!detailGiftMap.has(element.gift_id)) {
                                detailGiftMap.set(element.gift_id, {
                                    gift_id: element.gift_id,
                                    gift_code: element.gift_code,
                                    gift_name: element.gift_name,
                                    gift_image: element.gift_image,
                                    detailGift: [],
                                });
                            }
                            let shopDetailGift = detailGiftMap.get(
                                element.gift_id
                            );
                            shopDetailGift.detailGift.push({
                                gift_id: element.gift_id,
                                gift_code: element.gift_code,
                                gift_name: element.gift_name,
                                gift_image: element.gift_image,
                            });
                        });
                    });
                    this.summaryGift = Array.from(detailGiftMap.values());

                    // Product
                    let shopMapProduct = new Map();
                    data.data.detail_product.forEach((item: any) => {
                        if (!shopMapProduct.has(item.shop_id)) {
                            shopMapProduct.set(item.shop_id, {
                                shop_id: item.shop_id,
                                shop_code: item.shop_code,
                                shop_name: item.shop_name,
                                products: [],
                            });
                        }
                        let shopProduct = shopMapProduct.get(item.shop_id);
                        shopProduct.products.push({
                            shop_id: item.shop_id,
                            work_date: item.work_date,
                            product_id: item.product_id,
                            product_code: item.product_code,
                            product_name: item.product_name,
                            image: item.image,
                            type_product: item.type_product,
                            price_store: Helper.formatCurrencyUnit(
                                item.price_store
                            ),
                            price_system: Helper.formatCurrencyUnit(
                                item.price_system
                            ),
                        });
                    });
                    this.listDetailProduct = Array.from(
                        shopMapProduct.values()
                    );

                    let detailProductMap = new Map();
                    this.listDetailProduct.forEach((item: any) => {
                        item.products.forEach((element: any) => {
                            if (!detailProductMap.has(element.product_id)) {
                                detailProductMap.set(element.product_id, {
                                    product_id: element.product_id,
                                    product_code: element.product_code,
                                    product_name: element.product_name,
                                    image: element.image,
                                    type_product: element.type_product,
                                    price_store: Helper.formatCurrencyUnit(
                                        element.price_store
                                    ),
                                    price_system: Helper.formatCurrencyUnit(
                                        element.price_system
                                    ),
                                    detailProduct: [],
                                });
                            }
                            let shopDetailProduct = detailProductMap.get(
                                element.product_id
                            );
                            shopDetailProduct.detailProduct.push({
                                product_id: element.product_id,
                                product_code: element.product_code,
                                product_name: element.product_name,
                                image: element.image,
                                type_product: element.type_product,
                            });
                        });
                    });
                    this.summaryProduct = Array.from(detailProductMap.values());

                    // Survey
                    let shopMapSurvey = new Map();
                    data.data.detail_survey.forEach((item: any) => {
                        if (!shopMapSurvey.has(item.shop_id)) {
                            shopMapSurvey.set(item.shop_id, {
                                shop_id: item.shop_id,
                                shop_code: item.shop_code,
                                shop_name: item.shop_name,
                                surveys: [],
                            });
                        }
                        let shopSurvey = shopMapSurvey.get(item.shop_id);
                        shopSurvey.surveys.push({
                            shop_id: item.shop_id,
                            work_id: item.work_id,
                            report_id: item.report_id,
                            work_date: item.work_date,
                            name_customer: item.name_customer,
                            age: item.age,
                            type: item.type,
                            group: item.group,
                            phone: item.phone,
                        });
                    });
                    this.listDetailSurvey = Array.from(shopMapSurvey.values());
                }
            });
    }

    popupDetail(rawData: any) {
        if (rawData._key === 'qty' && rawData.Values !== '0') {
            this.popupDetailProduct = true;
        } else if (rawData._key === 'sum_customer' && rawData.Values !== '0') {
            this.popupDetailSurvey = true;
        } else if (rawData._key === 'quantity_gift' && rawData.Values !== '0') {
            this.popupDetailGift = true;
        }
    }
}
