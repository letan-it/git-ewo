import { DatePipe } from '@angular/common';
import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { WorkingPlansService } from 'src/app/web/service/working-plans.service';
import { Helper } from 'src/app/Core/_helper';
import { from, retry } from 'rxjs';
import { ShopsService } from 'src/app/web/service/shops.service';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-plans',
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.scss'],
    providers: [DatePipe, ConfirmationService],
})
export class plansComponent {
    items_menu: any = [
        { label: ' SETTING KPI' },
        { label: ' Plans', icon: 'pi pi-calendar-plus' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 10;

    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }
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
        private _service: WorkingPlansService,
        private _serviceExport: ExportService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private shopService: ShopsService,
        private confirmationService: ConfirmationService
    ) {
        this.itemsAdd = [
            {
                label: 'Add All',
                icon: 'pi pi-plus',
                command: () => {
                    this.addPlanAll();
                },
            },
        ];
        this.itemsRemove = [
            {
                label: 'Remove All',
                icon: 'pi pi-angle-left',
                command: () => {
                    this.removePlanAll();
                },
            },
        ];
        // this.route.params.subscribe((params) => {
        //     console.log(params['login_name']); //log the value of id
        //     console.log(params['password']); //log the value of id
        // });
    }
    itemsAdd: any;
    itemsRemove: any;
    selectMonth: any;
    item_ShopType: number = 0;
    selectStatus: any;
    shop_code: string = '';
    customer_shop_code: string = '';
    project_shop_code: string = '';

    check_time: boolean = false;
    from_time: any;
    to_time: any;
    is_test: string[] = [];
    PlanDate: any;
    ListStatus: any = [
        { name: 'Active', code: '1' },
        { name: 'In-Active', code: '0' },
    ];
    project_id: any;

    currentUser: any;
    userProfile: any;
    template_plan: any = 'assets/template/template_plan_import.xlsx';
    template_planV2: any = 'assets/template/template_plan_importV2.xlsx';

    responsiveOptions: any[] | undefined;
    employee_type_id = '7';

    ngOnInit(): void {
        this.check_permissions();
        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));

        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];
        if (this.userProfile.employee_type_id == 1) {
            this.employee_type_id = '7 8';
        }
        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
        this.project_id = Helper.ProjectID();
        this.template_plan += '?v=' + newDate.toUTCString();

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1,
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1,
            },
        ];
    }
    showTemplate: number = 0;
    ShowHideTemplate(num?: any) {
        if (num == 2 && this.showTemplate != 2) {
            this.showTemplate = 2;
        } else if (this.showTemplate != 0) {
            this.showTemplate = 0;
        } else {
            this.showTemplate = 1;
        }
    }

    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    ListMonth: any = [];
    getMonth(date: Date, format: string) {
        const today = new Date();
        const monthToday = today.getMonth() + 1;
        const year = today.getFullYear();

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
    }
    selectShopType(event: any) {
        this.item_ShopType = event != null ? event.code : 0;
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

    selectAddEmployee(event: any) {
        this.plan.employee_id =
            Helper.IsNull(event) != true ? event.code : null;
    }
    selectAddShift(event: any) {
        this.plan.shift = Helper.IsNull(event) != true ? event.code : null;
    }

    showFiter: number = 1;
    showTable: number = 0;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }
    ShowHideTable() {
        if (this.showTable == 1) {
            this.showTable = 0;
        } else {
            this.showTable = 1;
        }
    }
    store_list: any = [];
    selected_store: any;
    selected_plan: any;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 50;
    _pageNumber: number = 1;
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.filter(this._pageNumber);
    }

    first1: number = 0;
    rows1: number = 10;
    _pageNumber1: number = 1;
    onPageChange1(event: PageEvent) {
        this.first1 = event.first;
        this.rows1 = event.rows;
        this._pageNumber1 = (this.first1 + this.rows1) / this.rows1;
        this.filterTable(this._pageNumber1);
    }

    ListShop: any;
    Plan: any;
    ATD: any;
    message: string = '';
    display: boolean = false;
    planModal: boolean = false;
    addPlanModal: boolean = false;
    OK() {
        this.display = false;
    }
    is_loadForm: number = 0;
    // msgs: Message[] = [];
    isLoading_Filter: any = false;

    listEmployee: any;
    listCalendar: any;
    listwp: any;
    listResult: any = [];
    cols!: any[];
    colsEmployee!: any[];
    setupTable() {
        this.cols = [
            {
                field: 'employee_code',
                header: 'Mã',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
            {
                field: 'employee_name',
                header: 'Nhân viên',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
        ];
        this.listCalendar.forEach((element: any) => {
            this.cols.push({
                field: 'DateInt',
                header:
                    element.TheDayName +
                    ', ' +
                    element.TheDay +
                    element.TheDaySuffix,
                color: element.color,
                backgroup_color: element.backgroup_color,
                type: element.DateInt,
            });
        });

        this.colsEmployee = [
            {
                field: 'employee_code',
                header: 'Mã',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
            {
                field: 'employee_name',
                header: 'Nhân viên',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
        ];
    }

    GetData(day: number, listdata: any, listResult: any) {
        var data = listdata.filter((item: any) => item.plan_date == day);

        let res = 0;
        data.forEach((element: any) => {
            const test = listResult.filter(
                (p: any) =>
                    p.employee_id == element.employee_id &&
                    p.shop_id == element.shop_id &&
                    p.atd_date == element.plan_date &&
                    p.shift_id == element.shift_id
            );
            if (Helper.IsNull(test) != true && test.length > 0) {
                res += 1;
            }
        });

        let result = data.length;
        if (res > 0) {
            let c = data.length - res;
            result = `${c}/${res}`;
        }
        return result;
    }

    listdetailplan: any;
    showdata(day: number, listdata: any) {
        this.listdetailplan = undefined;
        var data = listdata.filter((item: any) => item.plan_date == day);
        this.listdetailplan = data;
        this.planModal = true;

        if (Helper.IsNull(this.listdetailplan) != true) {
            this.plan.employee_id = this.listdetailplan[0].employee_id;
            this.plan.employee_code = this.listdetailplan[0].employee_code;
            this.plan.employee_name = this.listdetailplan[0].employee_name;
            this.plan.date[0] = new Date(this.listdetailplan[0]._plan_date);
            this.plan.date[1] = new Date(this.listdetailplan[0]._plan_date);
        }

        this.listdetailplan.forEach((element: any) => {
            element.result = this.listResult.filter(
                (r: any) =>
                    r.employee_id == element.employee_id &&
                    r.shop_id == element.shop_id &&
                    r.atd_date == element.plan_date &&
                    r.shift_id == element.shift_id
            );
            element.result = element.result.map((x: any) => ({
                ...x,
                toolTip: `Report ID: ${x.report_id} \n UUID: ${x.UUID}`,
            }));
        });
        // this.listResult
    }
    TotalRowNumber: number = 0;
    filterTable(page: number) {
        this.listEmployee = undefined;
        this.listCalendar = undefined;
        this.listwp = undefined;
        this.listResult = [];
        this._service
            .ewo_GetPlanSetup_Table(
                this.rows1,
                page,
                this.selectMonth.code,
                this.item_SS,
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
                this.selectStatus == null ? 1 : this.selectStatus.code,
                -1,
                this.item_ASM
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listCalendar = data.data.calendar;
                    this.listwp = data.data.plan;
                    this.listEmployee = data.data.employee;
                    this.listResult = data.data.result;
                    this.listResult = this.listResult.map(
                        (lr: any, i: any) => ({
                            ...lr,
                            index: i + 1,
                        })
                    );

                    this.listphoto = [];
                    if (Helper.IsNull(this.listResult) != true) {
                        for (var i = 0; i < this.listResult.length; i++) {
                            this.listphoto.push({
                                id: i + 1,
                                src: this.listResult[i].atd_photo,
                                title:
                                    this.listResult[i].atd_type +
                                    ': ' +
                                    this.listResult[i].atd_time,
                                image_time: this.listResult[i].atd_time,
                                _index: i + 1,
                            });
                        }
                    }

                    this.setupTable();
                    this.listEmployee.forEach((emp: any) => {
                        emp.data = this.listwp.filter(
                            (p: any) => p.employee_id == emp.employee_id
                        );
                        emp.result = this.listResult.filter(
                            (p: any) => p.employee_id == emp.employee_id
                        );
                    });

                    this.TotalRowNumber =
                        Helper.IsNull(this.listEmployee) != true
                            ? this.listEmployee[0].TotalRows
                            : 0;
                }
            });
    }

    urlgallery: any;
    mapPopup(lat: any, long: any) {
        this.urlgallery =
            'https://www.google.com/maps/search/' + lat + '+' + long;
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    getSeverity(type: string): any {
        switch (type) {
            case 'CHECKIN':
                return 'success';
            case 'OVERVIEW':
                return 'warning';
            case 'CHECKOUT':
                return 'danger';
        }
    }

    getColor(type: string): any {
        switch (type) {
            case 'OVERVIEW':
                return 'orange';
            case 'CHECKIN':
                return 'green';
            case 'CHECKOUT':
                return 'red';
        }
    }

    getKey(type: string): any {
        switch (type) {
            case 'OVERVIEW':
                return 3;
            case 'CHECKIN':
                return 1;
            case 'CHECKOUT':
                return 2;
        }
    }

    listphoto: any;
    openImage(index: any) {
        const changeindex = index;
        localStorage.setItem('listphoto', JSON.stringify(this.listphoto));
        localStorage.setItem('changeindex', JSON.stringify(changeindex));

        this.urlgallery = 'assets/ZoomImage/tool.html';
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    plan: any = {
        employee_id: null,
        employee_code: null,
        employee_name: null,
        date: [],
        shops: null,
        shift: null,
        key: null,
    };

    showDetail(key: any) {
        this.plan.shift = null;
        this.plan.key = key;
        this.addPlanModal = true;
        this.getDate();
    }

    showAddPlan(
        employee_id: any,
        employee_code: any,
        employee_name: any,
        date: any,
        key: any
    ) {
        this.plan.employee_id = employee_id;
        this.plan.employee_code = employee_code;
        this.plan.employee_name = employee_name;

        this.plan.date[0] = new Date(Helper.convertDateStr(date));
        this.plan.date[1] = new Date(Helper.convertDateStr(date));

        this.plan.shift = null;
        this.plan.key = key;
        this.addPlanModal = true;
        this.getDate();
    }

    hideDialog() {
        this.addPlanModal = false;
    }
    setCheckTime() {
        if (this.check_time == false) {
            this.check_time = true;
        } else {
            this.check_time = false;
        }
    }

    minDate: any = null;
    maxDate: any = null;
    startDate: any = null;
    endDate: any = null;
    rangeDates: any = [];

    getDate() {
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = month === 0 ? 11 : month - 1;
        let prevYear = prevMonth === 11 ? year - 1 : year;
        let nextMonth = month === 11 ? 0 : month + 1;
        let nextYear = nextMonth === 0 ? year + 1 : year;
        this.minDate = new Date();
        this.minDate.setDate(1);
        // this.minDate.setMonth(prevMonth);
        // this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setDate(31);
        this.maxDate.setMonth(nextMonth);
        // this.maxDate.setMonth(nextMonth);
        // this.maxDate.setFullYear(nextYear);

        this.startDate = new Date();
        this.endDate = new Date();
        // this.plan.date[0] = new Date(this.startDate)
        // this.plan.date[1] = new Date(this.endDate)
    }

    saveAddPlan(action: any) {
        let fromTime = new Date();
        let toTime = new Date();
        if (
            this.NofiIsNull(this.plan.employee_id, 'employee') == 1 ||
            this.NofiIsNull(this.plan.date, 'date') == 1 ||
            this.NofiIsNull(this.plan.date[0], 'start date') == 1 ||
            this.NofiIsNull(this.plan.date[1], 'end date') == 1 ||
            this.NofiIsNull(this.plan.shops, 'shop') == 1 ||
            this.checkDuplicates(
                this.plan.shops.split(' ').filter((e: any) => e != ''),
                'Duplicate shop code '
            ) == 1 ||
            this.NofiIsNull(this.plan.shift, 'shift') == 1
        ) {
            return;
        } else {
            if (this.from_time && !this.to_time) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warn Message',
                    detail: 'Please select to time',
                });
                return;
            } else {
                fromTime = new Date(this.from_time);
                toTime = new Date(this.to_time);
            }
            // if (this.check_time == true && fromTime > toTime) {
            //     this.messageService.add({
            //         severity: 'warn',
            //         summary: 'Warn Message',
            //         detail: 'To time must be greater than from time',
            //     });
            //     return;
            // }
            this.plan.date[0] = Helper.transformDateInt(
                new Date(this.plan.date[0])
            );
            this.plan.date[1] = Helper.transformDateInt(
                new Date(this.plan.date[1])
            );

            // console.log('saveAddPlan : ', this.plan);

            this._service
                .ewo_ATD_working_plan_ActionPlan(
                    action,
                    Helper.ProjectID(),
                    this.plan.employee_id,
                    this.plan.shops,
                    this.plan.date[0],
                    this.plan.date[1],
                    this.plan.shift,
                    this.from_time != '' ? this.from_time : '',
                    this.to_time != '' ? this.to_time : ''
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Plans',
                            `${action == 'create' ? 'Add' : 'Remove'} calendar`,
                            `${
                                action == 'create' ? 'Add' : 'Remove'
                            } successful calendar`,
                            'success',
                            'Successfull'
                        );
                    }
                    this.clearAddPlan();
                });
        }
    }

    clearAddPlan() {
        this.addPlanModal = false;
        this.planModal = false;
        this.plan = {
            employee_id: null,
            employee_code: null,
            employee_name: null,
            date: [],
            shops: null,
            shift: null,
            key: null,
        };
        this.from_time = '';
        this.to_time = '';
        this.filterTable(this._pageNumber1);
    }
    getTemplate() {
        this._service.ewo_atd_working_plan_template_from_to_time(
            Helper.ProjectID()
        );
    }
    filter(page: number) {
        if (this.showTable == 1) {
            this.filterTable(1);
        } else {
            if (this.item_SS == 0) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warn Message',
                    detail: 'Please choose Employee',
                });
                return;
            }

            this.ListShop = [];
            this.Plan = [];
            this.ATD = [];
            this.isLoading_Filter = true;
            this.is_loadForm = 1;
            this._service
                .ewo_GetPlanSetup(
                    this.rows,
                    page,
                    Pf.StringDateToInt(this.PlanDate),
                    this.item_SS,
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
                    this.selectStatus == null ? 1 : this.selectStatus.code,
                    -1,
                    this.item_ASM
                )
                .subscribe((data: any) => {
                    this.is_loadForm = 0;
                    if (data.result == EnumStatus.ok) {
                        if (
                            data.data.listshops.length > 0 ||
                            data.data.plan.length > 0 ||
                            data.data.attendance.length > 0
                        ) {
                            this.ListShop = data.data.listshops;
                            this.Plan = data.data.plan;

                            this.ATD = data.data.attendance;

                            this.totalRecords =
                                this.ListShop.length > 0
                                    ? this.ListShop[0].TotalRows
                                    : 0;

                            this.isLoading_Filter = false;
                        } else {
                            this.isLoading_Filter = false;
                            this.message = 'No data';
                            this.display = true;
                        }
                    }
                });
        }
    }
    export() {
        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose a Month',
            });
            return;
        }
        this._serviceExport.ewo_ATD_ExportPlan(
            this.item_SS,
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
            this.selectStatus == null ? 1 : this.selectStatus.code,
            -1,
            this.item_ASM,
            this.selectMonth.code
        );
    }
    removePlan() {
        let fromTime = new Date();
        let toTime = new Date();
        if (this.item_shift == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose a Shift',
            });
            return;
        }
        if (this.Plan == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please press the filter button',
            });
            return;
        }
        if (this.from_time && !this.to_time) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please select to time',
            });
            return;
        } else {
            fromTime = new Date(this.from_time);
            toTime = new Date(this.to_time);
        }

        // if (this.check_time == true && fromTime > toTime) {
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Warn Message',
        //         detail: 'To time must be greater than from time',
        //     });
        //     return;
        // }

        const removePlan = this.Plan.filter(
            (item: any) => item.checked == true
        );
        if (removePlan.length > 0) {
            let shoplistAdd = '';
            for (var i = 0; i < removePlan.length; i++) {
                shoplistAdd += removePlan[i].shop_id + ' ';
            }
            this._service
                .ewo_ATD_working_plan_Action(
                    'remove',
                    Helper.ProjectID(),
                    removePlan[0].employee_id,
                    shoplistAdd,
                    removePlan[0].plan_date,
                    this.item_shift,
                    this.from_time != '' ? this.from_time : '',
                    this.to_time != '' ? this.to_time : ''
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.filter(1);
                        this.NofiResult(
                            'Page Plans',
                            'Remove calendar',
                            'Remove successful calendar',
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

    addPlanAll() {
        let fromTime = new Date();
        let toTime = new Date();
        if (this.item_SS == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose Employee',
            });
            return;
        }

        if (this.item_shift == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose a Shift',
            });
            return;
        }
        if (this.from_time && !this.to_time) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please select to time',
            });
            return;
        } else {
            fromTime = new Date(this.from_time);
            toTime = new Date(this.to_time);
        }
        // if (this.check_time == true && fromTime > toTime) {
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Warn Message',
        //         detail: 'To time must be greater than from time',
        //     });
        //     return;
        // }

        this._service
            .ewo_GetPlanSetup(
                this.totalRecords,
                this._pageNumber,
                Pf.StringDateToInt(this.PlanDate),
                this.item_SS,
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
                this.selectStatus == null ? 1 : this.selectStatus.code,
                -1,
                this.item_ASM
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.listshops.length > 0) {
                        const listshops = data.data.listshops;

                        const newPlan = listshops.filter(
                            (item: any) => item.is_action == 1
                        );

                        if (newPlan.length > 0) {
                            let shoplistAdd = '';
                            for (var i = 0; i < newPlan.length; i++) {
                                shoplistAdd += newPlan[i].shop_id + ' ';
                            }

                            this._service
                                .ewo_ATD_working_plan_Action(
                                    'create',
                                    Helper.ProjectID(),
                                    newPlan[0].employee_id,
                                    shoplistAdd,
                                    newPlan[0].plan_date,
                                    this.item_shift,
                                    this.from_time != '' ? this.from_time : '',
                                    this.to_time != '' ? this.to_time : ''
                                )
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        this.filter(1);
                                        this.NofiResult(
                                            'Page Plans',
                                            'Add calendar',
                                            'Add successful calendar',
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
                }
            });
    }
    removePlanAll() {
        if (this.item_SS == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose Employee',
            });
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to remove all plan ?',
            header: 'Remove all plan',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',
            accept: () => {
                let fromTime = new Date();
                let toTime = new Date();
                if (this.item_SS == 0) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warn Message',
                        detail: 'Please choose Employee',
                    });
                    return;
                }

                this._service
                    .ewo_GetPlanSetup(
                        this.totalRecords,
                        this._pageNumber,
                        Pf.StringDateToInt(this.PlanDate),
                        this.item_SS,
                        Helper.ProjectID(),
                        this.shop_code,
                        this.customer_shop_code,
                        this.project_shop_code,

                        this.item_ShopType,
                        this.item_Province == null
                            ? 0
                            : this.item_Province.code,
                        this.item_District == null
                            ? 0
                            : this.item_District.code,
                        this.item_Ward == null ? 0 : this.item_Ward.code,
                        this.item_channel,
                        this.item_ShopRouter,
                        this.selectStatus == null ? 1 : this.selectStatus.code,
                        -1,
                        this.item_ASM
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            if (data.data.plan.length > 0) {
                                const plan = data.data.plan;

                                const newPlan = plan.filter(
                                    (item: any) => item.is_action == 1
                                );

                                if (newPlan.length > 0) {
                                    let shoplistAdd = '';
                                    for (var i = 0; i < newPlan.length; i++) {
                                        shoplistAdd += newPlan[i].shop_id + ' ';
                                    }

                                    this._service
                                        .ewo_ATD_working_plan_Action(
                                            'remove_all',
                                            Helper.ProjectID(),
                                            newPlan[0].employee_id,
                                            shoplistAdd,
                                            newPlan[0].plan_date,
                                            this.item_shift,
                                            this.from_time != ''
                                                ? this.from_time
                                                : '',
                                            this.to_time != ''
                                                ? this.to_time
                                                : ''
                                        )
                                        .subscribe((data: any) => {
                                            if (data.result == EnumStatus.ok) {
                                                this.filter(1);
                                                this.NofiResult(
                                                    'Page Plans',
                                                    'Remove calendar',
                                                    'Remove successful calendar',
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
                            } else {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Warn Message',
                                    detail: 'No data',
                                });
                                return;
                            }
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }
    addPlan() {
        let fromTime = new Date();
        let toTime = new Date();
        if (this.item_shift == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please choose a Shift',
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
        if (
            // this.check_time == true &&
            this.from_time &&
            !this.to_time
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: 'Please select to time',
            });
            return;
        } else {
            fromTime = new Date(this.from_time);
            toTime = new Date(this.to_time);
        }
        // if (fromTime > toTime) {
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Warn Message',
        //         detail: 'To time must be greater than from time',
        //     });
        //     return;
        // }
        const newPlan = this.ListShop.filter(
            (item: any) => item.checked == true
        );
        if (newPlan.length > 0) {
            let shoplistAdd = '';
            for (var i = 0; i < newPlan.length; i++) {
                shoplistAdd += newPlan[i].shop_id + ' ';
            }

            this._service
                .ewo_ATD_working_plan_Action(
                    'create',
                    Helper.ProjectID(),
                    newPlan[0].employee_id,
                    shoplistAdd,
                    newPlan[0].plan_date,
                    this.item_shift,
                    this.from_time ? this.from_time : '',
                    this.to_time ? this.to_time : ''
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.filter(1);
                        this.NofiResult(
                            'Page Plans',
                            'Add calendar',
                            'Add successful calendar',
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

    fileTemplete!: File;
    onChangeFile(event: any) {
        this.dataError = undefined;
        this.dataMessError = undefined;
        this.fileTemplete = event.target.files[0];
    }

    @ViewChild('myInputFile') myInputFile: any;
    clearFileInput() {
        this.myInputFile.nativeElement.value = null;
    }

    dataError: any;
    dataMessError: any;

    importTemplate() {
        if (this.fileTemplete == undefined) {
            this.dataError;
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter file import',
            });
            return;
        } else {
            const formDataUpload = new FormData();

            formDataUpload.append('files', this.fileTemplete);
            this._service
                .ewo_atd_working_plan_importdata(
                    formDataUpload,
                    Helper.ProjectID()
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Plans',
                            'Add calendar',
                            'Add successful calendar',
                            'success',
                            'Successfull'
                        );
                        this.filter(1);
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

    importTemplateV2() {
        if (this.fileTemplete == undefined) {
            this.dataError;
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter file import',
            });
            return;
        } else {
            const formDataUpload = new FormData();

            formDataUpload.append('files', this.fileTemplete);
            this._service
                .ewo_atd_working_plan_importdata_from_to_time(
                    formDataUpload,
                    Helper.ProjectID()
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Plans',
                            'Add calendar',
                            'Add successful calendar',
                            'success',
                            'Successfull'
                        );
                        this.filter(1);
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
    checkAction(): any {
        const employee_type_id = this.userProfile.employee_type_id;
        return employee_type_id == 1 ||
            employee_type_id == 2 ||
            employee_type_id == 3
            ? true
            : false;
    }

    viewShift() {
        this.router.navigate(['/plans/shift']);
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

    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: `Please choose a ${name}`,
            });
            check = 1;
        }
        return check;
    }

    checkDuplicates(value: any, name: any): any {
        let check = 0;
        if (Helper.checkDuplicates(value) != null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `${name} : ${Helper.checkDuplicates(value)}`,
            });
            check = 1;
        } else {
            check = 0;
        }
        return check;
    }
}
