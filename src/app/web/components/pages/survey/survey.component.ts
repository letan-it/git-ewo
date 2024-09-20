import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { SurveyService } from 'src/app/web/service/survey.service';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent {
    items_menu: any = [
        { label: ' SETTING KPI' },
        { label: ' Survey', icon: 'pi pi-table' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 11;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    constructor(
        private router: Router,
        private surveyService: SurveyService,
        private serviceExport: ExportService,
        private edService: EncryptDecryptService,
        private messageService: MessageService
    ) {
        this.itemsAdd = [
            {
                label: 'Add All',
                icon: 'pi pi-plus',
                command: () => {
                    this.addSurveyAll();
                },
            },
        ];

        this.itemsRemove = [
            {
                label: 'Remove All',
                icon: 'pi pi-times',
                command: () => {
                    this.removeSurveyAll();
                },
            },
        ];
    }
    currentUser: any;
    permission_full = 0;
    project_id: any;

    itemsImport: any;
    template_survey_shop: any =
        'assets/template/template_survey_shop_import.xlsx';
    ngOnInit(): void {
        this.check_permissions();
        this.project_id = Helper.ProjectID();
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];

        if (
            this.currentUser.employee_type_id == 1 ||
            this.currentUser.employee_type_id == 2 ||
            this.currentUser.employee_type_id == 3
        ) {
            this.permission_full = 1;
        } else {
            this.permission_full = 0;
        }
        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');

        this.itemsImport = [
            {
                label: 'Survey Shop',
                icon: 'pi pi-file-upload',
                command: () => {
                    this.ShowHideTemplate(1);
                },
            },
            { separator: true },
            {
                label: 'Close',
                icon: 'pi pi-times',
                command: () => {
                    this.close();
                },
            },
        ];

        this.template_survey_shop += '?v=' + newDate.toUTCString();
    }

    SurveyCreate: boolean = false;

    itemsAdd!: MenuItem[];
    itemsRemove!: MenuItem[];

    selectMonth: any;
    item_ShopType: number = 0;
    selectStatus: any;
    shop_code: string = '';
    customer_shop_code: string = '';
    project_shop_code: string = '';

    PlanDate: any;
    ListStatus: any = [
        { name: 'Active', code: '1' },
        { name: 'In-Active', code: '0' },
    ];
    is_loadForm: number = 0;
    create() {
        this.SurveyCreate = true;
        this.router.navigate(['/survey/details']);
    }

    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }

    ListMonth: any = [];
    getMonth(date: Date, format: string) {
        const today = new Date();
        const year = today.getFullYear();
        const monthToday = today.getMonth() + 1;
        const datePipe = new DatePipe('en-US');

        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        const dataMonth = Helper.getMonth();
        this.ListMonth = dataMonth.ListMonth;

        const monthString = monthToday.toString().padStart(2, '0');
        const currentDate = parseInt(year + monthString);
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find(
                (i: any) => i?.code == currentDate
            );
        }
        console.log('month', this.ListMonth);
    }
    selectShopType(event: any) {
        this.item_ShopType = event != null ? event.code : 0;
    }
    item_Survey: number = 0;
    selectSurvey(event: any) {
        this.item_Survey = event != null ? event.Id : 0;
    }

    item_ShopRouter: number = 0;
    selectShopRouter(event: any) {
        this.item_ShopRouter = event != null ? event.code : 0;
    }
    item_channel: number = 0;
    selectedChannel(event: any) {
        this.item_channel = event != null ? event.code : 0;
    }
    item_Province: any;
    selectProvince(event: any) {
        this.item_Province = event != null ? event : 0;
    }
    item_District: any;
    selectDistrict(event: any) {
        this.item_District = event != null ? event : 0;
    }
    item_Ward: any = 0;
    selectWard(event: any) {
        this.item_Ward = event != null ? event : 0;
    }
    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }
    item_SS: number = 0;
    selectEmployee(event: any) {
        this.item_SS = event != null ? event.code : 0;
    }
    item_shift: number = 0;
    selectShift(event: any) {
        this.item_shift = event != null ? event.code : 0;
    }

    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }
    store_list: any = [];
    selected_store: any;
    selected_survey: any;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 50;
    _pageNumber: number = 1;
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;

        // this.recordlistPage = this.ListShop.slice(
        //     this.first,
        //     this.first + this.rows
        // );

        this.filter(this._pageNumber);
    }
    totalRecordsSurvey: number = 0;

    ListShop: any;
    Survey: any;
    ATD: any;
    message: string = '';

    display: boolean = false;
    OK() {
        this.display = false;
    }

    isLoading_Filter: any = false;
    recordlistPage: any = [];

    filter(page: number) {
        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose month',
            });

            return;
        }

        if (Helper.IsNull(this.item_Survey) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose survey',
            });
            return;
        }

        this.ListShop = [];
        this.Survey = [];

        //   return;
        this.isLoading_Filter = true;
        this.is_loadForm = 1;
        this.surveyService
            .ewo_GetShopList(
                this.selectMonth.code,
                this.item_Survey,
                Helper.ProjectID(),
                this.shop_code,
                this.customer_shop_code,
                this.project_shop_code,
                this.item_ShopType,
                this.item_Province == null ? 0 : this.item_Province.code,
                this.item_District == null ? 0 : this.item_District.code,
                this.item_Ward == null ? 0 : this.item_Ward.code,
                this.item_channel,
                this.item_ShopRouter,
                this.selectStatus == null ? -1 : this.selectStatus.code,
                -1,
                this.item_ASM,
                this.rows,
                page
            )
            .subscribe((data: any) => {
                this.is_loadForm = 0;
                if (data.result == EnumStatus.ok) {
                    if (
                        data.data.listshops.length > 0 ||
                        data.data.surveyShops.length > 0
                    ) {
                        this.ListShop = data.data.listshops;
                        this.Survey = data.data.surveyShops;
                        if (this.ListShop.length > 0) {
                            this.totalRecords = this.ListShop[0].TotalRows;
                        }
                        if (this.Survey.length > 0) {
                            this.totalRecordsSurvey = this.Survey[0].TotalRows;
                        }
                        // this.recordlistPage = this.ListShop.slice(0, this.rows);

                        this.isLoading_Filter = false;
                    } else {
                        this.isLoading_Filter = false;

                        this.message = 'No data';
                        this.display = true;
                    }
                }
            });
    }

    removeSurvey() {
        if (this.item_Survey == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose a survey',
            });
            return;
        }

        if (this.Survey == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please press the filter button',
            });
            return;
        }

        const removeSurvey = this.Survey.filter(
            (item: any) => item.checked == true
        );
        if (removeSurvey.length > 0) {
            let shoplistAdd = '';
            for (var i = 0; i < removeSurvey.length; i++) {
                shoplistAdd += removeSurvey[i].shop_id + ' ';
            }

            this.surveyService
                .ewo_SurveyShopsAction(
                    'remove',
                    Helper.ProjectID(),
                    removeSurvey[0].survey_id,
                    shoplistAdd,
                    removeSurvey[0].year_month
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.filter(1);
                        this.NofiResult(
                            'Page Survey',
                            'Remove survey',
                            'Remove survey successfull',
                            'success',
                            'Successfull'
                        );

                        return;
                    }
                });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose a item',
            });
            return;
        }
    }

    addSurvey() {
        if (this.item_Survey == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose a survey',
            });
            return;
        }
        if (this.ListShop == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please press the filter button',
            });
            return;
        }

        const newSurvey = this.ListShop.filter(
            (item: any) => item.checked == true
        );

        if (newSurvey.length > 0) {
            let shoplistAdd = '';
            for (var i = 0; i < newSurvey.length; i++) {
                shoplistAdd += newSurvey[i].shop_id + ' ';
            }

            this.Survey = [];
            this.surveyService
                .ewo_SurveyShopsAction(
                    'create',
                    Helper.ProjectID(),
                    newSurvey[0].survey_id,
                    shoplistAdd,
                    newSurvey[0].year_month
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.filter(1);
                        this.NofiResult(
                            'Page Survey',
                            'Add store survey',
                            'Add store survey successfull',
                            'success',
                            'Successfull'
                        );

                        return;
                    } else {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warn Message',
                            detail: 'Please choose a item',
                        });

                        return;
                    }
                });
        }
        // else {
        //     this.msgs = [];
        //     this.msgs.push({
        //         severity: 'warn',
        //         summary: 'Warn Message',
        //         detail: 'Please choose a item',
        //     });
        //     return;
        // }
    }

    addSurveyAll() {
        this.surveyService
            .ewo_GetShopList(
                this.selectMonth.code,
                this.item_Survey,
                Helper.ProjectID(),
                this.shop_code,
                this.customer_shop_code,
                this.project_shop_code,
                this.item_ShopType,
                this.item_Province == null ? 0 : this.item_Province.code,
                this.item_District == null ? 0 : this.item_District.code,
                this.item_Ward == null ? 0 : this.item_Ward.code,
                this.item_channel,
                this.item_ShopRouter,
                this.selectStatus == null ? -1 : this.selectStatus.code,
                -1,
                this.item_ASM,
                this.totalRecords,
                this._pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.listshops.length > 0) {
                        const shoptemp = data.data.listshops;

                        let shoplistAdd = '';
                        for (var i = 0; i < shoptemp.length; i++) {
                            shoplistAdd += shoptemp[i].shop_id + ' ';
                        }

                        this.Survey = [];
                        this.surveyService
                            .ewo_SurveyShopsAction(
                                'create',
                                Helper.ProjectID(),
                                shoptemp[0].survey_id,
                                shoplistAdd,
                                shoptemp[0].year_month
                            )
                            .subscribe((data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    this.filter(1);
                                    this.NofiResult(
                                        'Page Survey',
                                        'Add store survey',
                                        'Add store survey successfull',
                                        'success',
                                        'Successfull'
                                    );

                                    return;
                                } else {
                                    this.messageService.add({
                                        severity: 'warn',
                                        summary: 'Warn Message',
                                        detail: 'Please error a item',
                                    });
                                    return;
                                }
                            });
                    } else {
                        this.message = 'No data';
                        this.display = true;
                    }
                }
            });
    }

    removeSurveyAll() {
        this.surveyService
            .ewo_GetShopList(
                this.selectMonth.code,
                this.item_Survey,
                Helper.ProjectID(),
                this.shop_code,
                this.customer_shop_code,
                this.project_shop_code,
                this.item_ShopType,
                this.item_Province == null ? 0 : this.item_Province.code,
                this.item_District == null ? 0 : this.item_District.code,
                this.item_Ward == null ? 0 : this.item_Ward.code,
                this.item_channel,
                this.item_ShopRouter,
                this.selectStatus == null ? -1 : this.selectStatus.code,
                -1,
                this.item_ASM,
                this.totalRecords,
                this._pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.surveyShops.length > 0) {
                        const shoptemp = data.data.surveyShops;

                        let shoplistRemove = '';
                        for (var i = 0; i < shoptemp.length; i++) {
                            shoplistRemove += shoptemp[i].shop_id + ' ';
                        }

                        this.Survey = [];
                        this.surveyService
                            .ewo_SurveyShopsAction(
                                'remove',
                                Helper.ProjectID(),
                                shoptemp[0].survey_id,
                                shoplistRemove,
                                shoptemp[0].year_month
                            )
                            .subscribe((data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    this.filter(1);
                                    this.NofiResult(
                                        'Page Survey',
                                        'Remove store survey',
                                        'Remove store survey successfull',
                                        'success',
                                        'Successfull'
                                    );
                                    return;
                                } else {
                                    this.messageService.add({
                                        severity: 'warn',
                                        summary: 'Warn Message',
                                        detail: 'Remove error',
                                    });
                                    return;
                                }
                            });
                    } else {
                        this.message = 'No data';
                        this.display = true;
                    }
                }
            });
    }

    export() {
        let is_test = 0;

        this.serviceExport.ewo_SurveyShop_Export(
            this.selectMonth.code,
            this.item_Survey,
            Helper.ProjectID(),
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            this.selectStatus == null ? -1 : this.selectStatus.code,
            -1,
            this.item_ASM
        );
    }

    dataError: any;
    dataMessError: any;
    clearDataImport() {
        this.dataError = undefined;
        this.dataMessError = undefined;
    }

    typeImport: number = 0;
    showTemplate: number = 0;
    ShowHideTemplate(value: any) {
        this.showTemplate = 1;
        this.typeImport = value;
        this.clearDataImport();
    }
    close() {
        this.showTemplate = 0;
    }

    file!: any;
    // On file Select
    onChange(event: any) {
        this.clearDataImport();
        this.file = event.target.files[0];
    }

    @ViewChild('myInputFile') myInputFile: any;
    clearFileInput() {
        this.myInputFile.nativeElement.value = null;
        this.file = undefined;
    }

    importTemplate() {
        if (Helper.IsNull(this.file) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter file',
            });
            return;
        } else {
            this.clearDataImport();
            const formDataUpload = new FormData();

            formDataUpload.append('files', this.file);
            this.surveyService
                .ewo_Survey_Shops_ImportData(formDataUpload, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Survey',
                            'Add store survey',
                            'Add store survey successfull',
                            'success',
                            'Successfull'
                        );
                    } else {
                        if (data.data == null) {
                            this.dataMessError = data.message;

                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Warning',
                                detail: this.dataMessError,
                            });
                        } else {
                            this.dataError = data.data;
                        }
                    }

                    this.clearFileInput();
                });
        }
    }

    NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
            life: 3000,
        });

        AppComponent.pushMsg(
            page,
            action,
            name,
            severity == 'success' ? EnumStatus.ok : EnumStatus.error,
            0
        );
    }
}
