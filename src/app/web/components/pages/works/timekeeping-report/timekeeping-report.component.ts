import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pf } from 'src/app/_helpers/pf';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { ExportService } from 'src/app/web/service/export.service';
import { ReportsService } from 'src/app/web/service/reports.service';
import { WorkingPlansService } from 'src/app/web/service/working-plans.service';
interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-timekeeping-report',
    templateUrl: './timekeeping-report.component.html',
    styleUrls: ['./timekeeping-report.component.scss'],
    providers: [ConfirmationService],
})
export class TimekeepingReportComponent {
    constructor(
        private _service: WorkingPlansService,
        private _serviceReport: ReportsService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private serviceExport: ExportService
    ) {}

    items_menu: any = [
        { label: ' REPORT' },
        {
            label: ' Báo cáo chấm công ',
            icon: 'pi pi-calendar-plus',
        },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
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

    checkUserCUS(): any {
        return this.userProfile.level == 'CUS' ? true : false;
    }

    selectedListRaw: any = null;
    listRawData: any[] = [];
    loadDataReportList() {}
    itemsData: any = [];
    GetPerDownloadExcel() {
        if (Helper.IsNull(this.listRawData) == true) {
            this._serviceReport
                .Report_list_GetList(Helper.ProjectID())
                .subscribe((res: any) => { 
                    if (res.result == EnumStatus.ok) {
                        if (res.data.length > 0) {
                            this.listRawData = res.data.filter(
                                (x: any) =>
                                    x.check == 1 &&
                                    (x.report_id == 3 || x.report_id == 15)
                            );
                        }
                        this.itemsData = [];
                        this.listRawData.forEach((element: any) => {
                            this.itemsData.push(
                                {
                                    label: element.report_name,
                                    icon: element.icon,
                                    command: () => {
                                        if (element.report_id == 3) {
                                            this.export_Attendance();
                                        } else if (element.report_id == 15) {
                                            this.ewo_ATD_results_PP();
                                        } else {
                                            return;
                                        }
                                    },
                                },
                                { separator: true }
                            );
                        });
                    } 
                });
        }
    }

    shop_name: any = '';
    export() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData(
            1000000,
            1,
            Helper.ProjectID(),
            this.item_SS,
            -1,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.shop_name,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    export_Attendance() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_Attendance(
            Helper.ProjectID(),
            intDateStart,
            intDateEnd
        );
    }

    ewo_ATD_results_PP() {
        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_ATD_results_PP(
            Helper.ProjectID(),
            intDateStart,
            intDateEnd,
            '',
            this.item_ASM == 0 ? '' : this.item_ASM + '',
            this.item_SS == 0 ? '' : this.item_SS + '',
            this.shop_code,
            this.item_Province == null || this.item_Province == undefined
                ? ''
                : this.item_Province.code + ''
        );
    }

    project_id: any = 0;
    PlanDate: any;
    ngOnInit() {
        this.SetOnitDate();
        this.loadUser();
        // this.check_permissions();
        this.project_id = Helper.ProjectID();
        //this.GetPerDownloadExcel();

        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
        this.project_id = Helper.ProjectID();

        this.filterTable(1);
    }

    dateStart: any | undefined;
    dateEnd: any | undefined;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    SetOnitDate() {
        try {
             
            let newDate = new Date();
            let new_date =newDate;
/*
            this.dateEnd = this.getFormatedDate(newDate, 'YYYY-MM-dd'); 
            var dateObj = new Date();
            var month = dateObj.getUTCMonth(); //months from 1-12
            var year = dateObj.getUTCFullYear();
            newDate = new Date(year, month, 1);
            this.dateStart = this.getFormatedDate(newDate, 'YYYY-MM-dd');
*/
            // const now = new Date('2024-08-20');
            const now = this.getFormatedDate(new_date, 'YYYY-MM-dd'); 
            const nowDate = new Date(now as any);
            const { fromDate, toDate } = Helper.getWeekRange(nowDate);
            this.dateStart = Helper.convertDateStr(fromDate);
            this.dateEnd = Helper.convertDateStr(toDate);   
            console.log(`From Date: ${fromDate}, To Date: ${toDate}`);

        } catch (error) {}
    }

    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }
    item_SS: number = 0;
    selectSS(event: any) {
        this.item_SS = event != null ? event.code : 0;
    }

    itemPosition: any = '';
    selectPosition(event: any) { 
        if (Helper.IsNull(event) != true) {
            this.itemPosition = '';
            event.forEach((element: any) => {
                this.itemPosition += element.code + ' ';
            });
        } else {
            this.itemPosition = '';
        } 
    }
    clearSelectPosition(event: any) {
        this.itemPosition = event == true ? '' : this.itemPosition;
    }

    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }

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
            {
                field: 'position',
                header: 'Chức vụ',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
        ];
        this.listCalendar.forEach((element: any) => {
            this.cols.push({
                field: 'DateInt',
                // header:
                //     element.TheDayName +
                //     ', ' +
                //     element.TheDay +
                //     element.TheDaySuffix +
                //     "\n" + Helper.convertDateStr1(element.DateInt),
                header:
                    element.TheDayName +
                    ', ' +
                    Helper.convertDateStr1(element.DateInt),
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
            {
                field: 'position',
                header: 'Chức vụ',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
        ];
    }

    isLoading_Filter: any = false;

    ListMonth: any = [];
    selectMonth: any;
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

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    }
    listphoto: any;
    item_ShopType: number = 0;
    item_Province: any;
    item_District: any;
    item_Ward: any;
    item_channel: number = 0;
    item_ShopRouter: number = 0;
    selectStatus: any;
    shop_code: string = '';
    customer_shop_code: string = '';
    project_shop_code: string = '';
    filterTable(page: number) {
        this.GetPerDownloadExcel();

        this.listEmployee = undefined;
        this.listCalendar = undefined;
        this.listwp = undefined;
        this.listResult = [];
        if (
            this.NofiIsNull(this.dateStart, 'from date') == 1 ||
            this.NofiIsNull(this.dateEnd, 'to date') == 1
        ) {
            return;
        } else {
            const dateStartInt = Helper.transformDateInt(this.dateStart);
            const dateEndInt = Helper.transformDateInt(this.dateEnd);

            this._service
                .ewo_ATD_GetListShop_TimekeepingReport(
                    this.rows1,
                    page,
                    this.selectMonth.code,
                    dateStartInt,
                    dateEndInt,
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
                    Helper.IsNull(this.itemPosition) != true
                        ? this.itemPosition
                        : '',
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

    listdetailplan: any;
    planModal: boolean = false;
    plan: any = {
        employee_id: null,
        employee_code: null,
        employee_name: null,
        date: [],
        shops: null,
        shift: null,
        key: null,
    };

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
            // element.countRow =  element.result.length;
            element.result = element.result.map((x: any) => ({
                ...x,
                toolTip: `Report ID: ${x.report_id} \n UUID: ${x.UUID}`,
                countRow: element.result.length,
            }));
        }); 
    }
    addPlanModal: boolean = false;
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
    _true: any = true;
    colorButton: any = 'blue';
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
        let resultColor = result;
        if (res > 0) {
            //   let c = data.length - res;
            let c = data.length;
            result = `${c}/${res}`;
        }
        this.colorButton = this.getSeverityPlansResult(res, resultColor);
        return result;
    }

    getSeverityPlansResult(res: number, result: number): any {
        if (res == 0) {
            return 'p-ripple p-element p-button p-component p-button-warning p-button-raised p-button-text font-bold';
        } else if (res >= result) {
            return 'p-ripple p-element p-button p-component p-button-success p-button-raised p-button-text font-bold';
        } else {
            return 'p-ripple p-element p-button p-component p-button-info p-button-raised p-button-text font-bold';
        }
    }

    /*
    result >= plan màu xanh lá
    result 0 là cam
    result < plan xanh info
    */

    TotalRowNumber: number = 0;
    first1: number = 0;
    rows1: number = 10;
    _pageNumber1: number = 1;
    onPageChange1(event: PageEvent) {
        this.first1 = event.first;
        this.rows1 = event.rows;
        this._pageNumber1 = (this.first1 + this.rows1) / this.rows1;
        this.filterTable(this._pageNumber1);
    }

    selectAddShift(event: any) {
        this.plan.shift = Helper.IsNull(event) != true ? event.code : null;
    }

    from_time: any;
    to_time: any;

    showDetail(key: any) {
        this.plan.shift = null;
        this.plan.key = key;
        this.addPlanModal = true;
        this.getDate();
    }

    getSeverity(type: string): any {
        switch (type) {
            case 'CHECKIN':
                return 'danger';
            case 'OVERVIEW':
                return 'warning';
            case 'CHECKOUT':
                return 'success';
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
    message: string = '';
    display: boolean = false;
    OK() {
        this.display = false;
    }
    NofiIsNull(value: any, name: any): any {
        if (Helper.IsNull(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }
}
