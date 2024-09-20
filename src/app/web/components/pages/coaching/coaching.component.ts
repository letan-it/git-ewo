import { DatePipe } from '@angular/common';
import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { Helper } from 'src/app/Core/_helper';
import { from, retry } from 'rxjs';
import { ShopsService } from 'src/app/web/service/shops.service';
import { FieldCoachingService } from 'src/app/web/service/field-coaching.service';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-coaching',
    templateUrl: './coaching.component.html',
    styleUrls: ['./coaching.component.scss'],
    providers: [DatePipe, ConfirmationService],
})
export class FieldCoachingComponent {
    items_menu: any = [
        { label: ' SETTING KPI' },
        { label: ' Field-coaching', icon: 'pi pi-calendar-plus' },
    ];
    home: any = { icon: 'pi pi-verified', routerLink: '/field-coaching' };
    menu_id = 129;

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
        private _service: FieldCoachingService,
        private _serviceExport: ExportService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private shopService: ShopsService,
        private confirmationService: ConfirmationService
    ) {}
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

    employee_type_id = '7';

    userLogin: any = {};
    ngOnInit(): void {
        this.check_permissions();
        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));

        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];

        if (
            this.userProfile.employee_type_id == 1 ||
            this.userProfile.employee_type_id == 2 ||
            this.userProfile.employee_type_id == 3
        ) {
            this.employee_type_id = '7 8';
        } else if (this.userProfile.employee_type_id == 8) {
            this.userLogin.employee_code = this.userProfile.employee_code || '';
            this.userLogin.employee_id = this.userProfile.employee_id || 0;
            this.userLogin.employee_name = this.userProfile.employee_name || '';
        }
        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
        this.project_id = Helper.ProjectID();
        this.template_plan += '?v=' + newDate.toUTCString();
    }
    showTemplate: number = 0;
    ShowHideTemplate(num?: any) {
        if (this.showTemplate != 0) {
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
    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }
    item_SS: number = 0;
    selectEmployee(event: any) {
        this.item_SS = event != null ? event.code : 0;
    }
    survey_filter = 0;
    selectSurveyFilter(event: any) {
        this.survey_filter = event != null ? event.Id : 0;
    }

    selectAddEmployee(event: any) {
        this.coaching.employee_id =
            Helper.IsNull(event) != true ? event.code : null;
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
    selected_plan: any;
    totalRecords: number = 0;

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
                field: 'checker_code',
                header: 'Mã',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
            {
                field: 'checker_name',
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

    GetData(day: number, listdata: any) {
        var data = listdata.filter((item: any) => item.field_date == day);

        let result = data.length;

        return result;
    }

    listdetailplan: any;
    showdata(day: number, listdata: any) {
        const tmp = listdata.data;
        // set data add
        this.coaching.field_date = [];
        this.coaching.employee_checker_id = listdata.checker_id || 0;
        this.coaching.employee_checker_code = listdata.checker_code || '';
        this.coaching.employee_checker_name = listdata.checker_name || '';

        this.coaching.field_date[0] = new Date(Helper.convertDateStr(day));
        this.coaching.field_date[1] = new Date(Helper.convertDateStr(day));

        //
        this.listdetailplan = undefined;
        var data = tmp.filter((item: any) => item.field_date == day);
        this.listdetailplan = data;
        this.planModal = true;
    }
    TotalRowNumber: number = 0;
    filterTable(page: number) {
        this.listEmployee = undefined;
        this.listCalendar = undefined;
        this.listwp = undefined;
        this.listResult = [];

        this._service
            .GetFieldCoaching(
                this.selectMonth.code,
                Helper.ProjectID(),
                this.item_SS,
                this.item_ASM,
                this.survey_filter,
                this.rows1,
                page
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listCalendar = data.data.calander;
                    this.listwp = data.data.field_coaching;
                    this.listEmployee = data.data.employee_list;

                    this.setupTable();
                    this.listEmployee.forEach((emp: any) => {
                        emp.data = this.listwp.filter(
                            (p: any) => p.employee_checker_id == emp.checker_id
                        );
                    });

                    this.TotalRowNumber =
                        Helper.IsNull(this.listEmployee) != true
                            ? this.listEmployee[0].TotalRows
                            : 0;
                }
            });
    }

    coaching: any = {
        employee_checker_id: 0,
        employee_checker_name: '',
        employee_checker_code: '',
        employee_id: 0,
        field_date: [],
        survey_id: 0,
    };

    showAddPlan(data: any, col: any) {
        this.coaching.employee_checker_id = data.checker_id || 0;
        this.coaching.employee_checker_code = data.checker_code || '';
        this.coaching.employee_checker_name = data.checker_name || '';

        this.coaching.field_date = [];
        this.coaching.field_date[0] = new Date(Helper.convertDateStr(col.type));
        this.coaching.field_date[1] = new Date(Helper.convertDateStr(col.type));

        this.openModel();
    }
    check_add = true;
    openModel() {
        if (
            Helper.IsNull(this.coaching.employee_checker_id) ||
            this.coaching.employee_checker_id == 0
        ) {
            this.check_add = false;
        }
        this.addPlanModal = true;
        this.getDate();
    }
    saveCoaching(action: any) {
        if (
            this.NofiIsNull(
                this.coaching.employee_checker_id,
                'người kiểm tra'
            ) == 1 ||
            this.NofiIsNull(this.coaching.field_date, 'ngày') == 1 ||
            this.NofiIsNull(this.coaching.field_date[0], 'ngày bắt đầu') == 1 ||
            this.NofiIsNull(this.coaching.field_date[1], 'ngày kết thúc') ==
                1 ||
            this.NofiIsNull(this.coaching.employee_id, 'nhân viên') == 1 ||
            this.NofiIsNull(this.coaching.survey_id, 'bài khảo sát') == 1
        ) {
            return;
        } else {
            this.coaching.field_date[0] = Helper.transformDateInt(
                new Date(this.coaching.field_date[0])
            );
            this.coaching.field_date[1] = Helper.transformDateInt(
                new Date(this.coaching.field_date[1])
            );

            this._service
                .FieldCoaching_Action(
                    Helper.ProjectID(),
                    0,
                    this.coaching.employee_checker_id,
                    this.coaching.employee_id,
                    this.coaching.field_date[0],
                    this.coaching.field_date[1],
                    this.coaching.survey_id,
                    'create'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Field Coaching',
                            `${action == 'create' ? 'Add' : 'Remove'} calendar`,
                            `${
                                action == 'create' ? 'Add' : 'Remove'
                            } successful calendar`,
                            'success',
                            'Successfull'
                        );
                    } else {
                        this.NofiResult(
                            'Page Field Coaching',
                            `${action == 'create' ? 'Add' : 'Remove'} calendar`,
                            `${data.message} `,
                            'warn',
                            'Warn'
                        );
                    }
                    this.hideDialog();
                    this.filterTable(this._pageNumber1);
                });
        }
    }

    selectEmployeeAction(event: any) {
        this.coaching.employee_id = event != null ? event.code : 0;
    }
    selectEmployeeFCAction(event: any) {
        this.coaching.employee_checker_id = event != null ? event.code : 0;
    }

    selectSurveyAction(event: any) {
        this.coaching.survey_id = event != null ? event.Id : 0;
    }
    hideDialog() {
        this.addPlanModal = false;
        this.planModal = false;
        this.coaching = {
            employee_checker_id: 0,
            employee_checker_name: '',
            employee_checker_code: '',
            employee_id: 0,
            // field_date: [],
            survey_id: 0,
        };
    }
    resetInput() {
        this.coaching = {
            // employee_checker_id: 0,
            // employee_checker_name: '',
            // employee_checker_code: '',
            employee_id: 0,
            // field_date: [],
            survey_id: 0,
        };
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
        this.maxDate = new Date();
        this.maxDate.setDate(31);
        this.maxDate.setMonth(nextMonth);

        this.startDate = new Date();
        this.endDate = new Date();
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
        this._service.FieldCoaching_RawData(
            this.selectMonth.code,
            Helper.ProjectID(),
            this.item_SS,
            this.item_ASM,
            this.rows1,
            -1
        );
    }
    getTemplate() {
        this._service.FieldCoaching_GetTemplate(Helper.ProjectID());
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
                .FieldCoaching_ImportData(formDataUpload, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page field coaching',
                            'Add field coaching',
                            'Add successful field coaching',
                            'success',
                            'Successfull'
                        );
                        this.filterTable(1);
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
                detail: `Chưa chọn ${name}`,
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

    cloneItem: { [key: number]: any } = {};
    onRowEditInit(item: any) {
        this.cloneItem[item.id] = { ...item };
    }
    onRowEditCancel(item: any, index: number) {
        this.listdetailplan[index] = this.cloneItem[item.id];
        delete this.cloneItem[item.id];
    }
    onRowEditSave(item: any, index: number) {
        this._service
            .FieldCoaching_Action(
                Helper.ProjectID(),
                item.id,
                item.employee_checker_id,
                item.employee_id,
                item.field_date,
                0,
                this.item_Survey.Id,
                'update'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.NofiResult(
                        'Page field coaching',
                        'Update field coaching',
                        'Update field coaching Successfull',
                        'success',
                        'SuccessFull'
                    );
                } else {
                    this.NofiResult(
                        'Page field coaching',
                        'Update field coaching',
                        data.message,
                        'error',
                        'error'
                    );
                }
            });
        this.cloneItem[item.id].survey_name =
            this.item_Survey.Name.split(' - ')[1].trim() || '';
        this.listdetailplan[index] = this.cloneItem[item.id];

        delete this.cloneItem[item.id];
    }

    item_Survey: any;
    selectSurvey(event: any) {
        this.item_Survey = event != null ? event : 0;
    }

    delete(event: Event, item: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn có chắc chắn muốn xóa?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            accept: () => {
                this._service
                    .FieldCoaching_Action(
                        Helper.ProjectID(),
                        item.id,
                        item.employee_checker_id,
                        item.employee_id,
                        item.field_date,
                        0,
                        0,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Thành công',
                                detail: 'Xóa thành công!',
                                life: 3000,
                            });
                            this.hideDialog();
                            this.filterTable(this._pageNumber1);
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Từ chối',
                    detail: 'Bạn đã từ chối',
                    life: 3000,
                });
            },
        });
    }
}
