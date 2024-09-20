import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { EmpShopService } from './empShop.service';
import { EnumStatus } from 'src/app/Core/_enum';
import { EmployeesService } from 'src/app/web/service/employees.service';
import * as FileSaver from 'file-saver';
import { AppComponent } from 'src/app/app.component';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-empShop',
    templateUrl: './empShop.component.html',
    styleUrls: ['./empShop.component.scss'],
    providers: [DatePipe],
})
export class empShopComponent {
    messages: Message[] | undefined;
    constructor(
        private router: Router,
        private datePipe: DatePipe,
        private messageService: MessageService,
        private _service: EmpShopService,
        private confirmationService: ConfirmationService,
        private _serviceEmp: EmployeesService
    ) {}

    items_menu: any = [
        { label: ' EMPLOYEE SHOPS' },
        { label: ' Emp Shop', icon: 'fa fa-user' },
    ];
    ListStatus: any = [
        { name: 'Active', code: 1 },
        { name: 'In-Active', code: 0 },
    ];
    selectStatus: any = null;
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 99;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;
    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }

    isLoading_Filter: any = false;
    is_LoadForm: number = 0;

    empShopsLists: any;

    projectList: any;

    fromDate: any | undefined;
    toDate: any | undefined;
    activeDatesInt: any = [];
    activeDateInt: any | undefined;
    editActiveDate: any | undefined;
    selectedActiveDate(e: any) {
        this.activeDateInt = e.value;
    }
    clearActiveDate() {
        this.activeDateInt = '';
    }
    //filter
    emShops_id: any = null;
    emp_code: any = null;
    shop_code: any = null;
    emp_id: any = null;
    from_date: any = null;
    to_date: any = null;
    is_active: any = null;

    // Year month
    limitedFromDate: any | undefined;
    limitedToDate: any | undefined;
    limitedMaxDate: any = null;
    currentDate: any = null;
    listMonth: any = null;
    listMonths: any = [];
    year_month: any = null;
    date: any = null;
    created_date_int: any = null;
    orders: any = null;
    selectedListMonths(e: any) {
        let currYear = e.value?.code.toString().substring(0, 4);
        let currMonth = e.value.month;
        let maxDayInMonth = e.value.totalDays;
        this.limitedFromDate = currYear + '-' + currMonth + '-' + '01';
        this.limitedToDate = currYear + '-' + currMonth;
        this.limitedMaxDate = currYear + '-' + currMonth + '-' + maxDayInMonth;
        this.listMonths.splice(0, +this.listMonth.month);
        this.listMonthsTo = this.listMonths;
        this.loadData(1);
    }
    getDate() {
        let today = new Date();
        this.date = new Date(today);
        this.setDate(this.date);
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

    // Year Month To
    listMonthTo: any = null;
    listMonthsTo: any = [];

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

    cols!: Column[];
    exportColumns!: ExportColumn[];
    ngOnInit() {
        this.check_permissions();
        this.loadData(1);
        this.loadEmployees();
        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'emp_id', header: 'Employee ID' },
            { field: 'shop_id', header: 'Shop ID' },
            { field: 'from_date', header: 'From Date' },
            { field: 'to_date', header: 'To Date' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));
    }
    loadData(pageNumber: number) {
        this.item_Project = Helper.ProjectID();

        this.is_LoadForm = 1;
        this.first = 0;
        this.totalRecords = 0;
        this.isLoading_Filter = true;

        let intDateStart = 0;
        let intDateEnd = 0;

        this.limitedFromDate == undefined || this.limitedFromDate == ''
            ? (intDateStart = 0)
            : (intDateStart = parseInt(
                  Pf.StringDateToInt(this.limitedFromDate)
              ));
        this.limitedMaxDate == undefined || this.limitedMaxDate == ''
            ? (intDateEnd = 0)
            : (intDateEnd = parseInt(Pf.StringDateToInt(this.limitedMaxDate)));

        if (intDateEnd < intDateStart && intDateEnd !== 0) {
            this.limitedFromDate = '';
            this.limitedMaxDate = '';
            this.messageService.add({
                severity: 'warn',
                summary: 'The end date must be greater than the starting date!',
                detail: '',
            });
            return;
        }

        const date = new Date();
        const year = date.getFullYear();
        const monthToday = date.getMonth() + 1;
        const monthString = monthToday.toString().padStart(2, '0');
        this.currentDate = parseInt(year + monthString);
        for (let i = 1; i <= 12; i++) {
            const dataMonth = Helper.getMonth();
            this.listMonths = dataMonth.ListMonth;
        }
        this._service
            .getList(
                Helper.ProjectID(),
                this.emp_code,
                this.employee_type_id,
                this.shop_code,
                this.listMonth === null ? 0 : this.listMonth.code,
                intDateStart,
                intDateEnd,
                this.rows,
                pageNumber,
                1
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.empShopsLists = data.data;
                    this.empShopsLists.forEach((e: any) => {
                        e.ToDate = e.ToDate == null ? 0 : e.ToDate;
                    });
                    this.totalRecords =
                        Helper.IsNull(this.empShopsLists) != true
                            ? this.empShopsLists[0].TotalRows
                            : 0;
                    this.isLoading_Filter = false;
                } else {
                    this.empShopsLists = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    loadShop() {}

    handleCopy(text: string) {
        let input = document.createElement('input');
        document.body.appendChild(input);
        input.value = text;
        input.select();
        document.execCommand('copy');
        input.remove();

        this.messageService.add({
            severity: 'success',
            summary: 'Copy success',
        });
    }
    FormatFromToDate(value: any): any {
        return Pf.convertToISODate(value);
    }
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }

    //#region emp type
    employee_type_id!: number;
    item_EmployeeType: number = 0;
    parent_employee_type: string = '';
    selectEmployeeType(event: any) {
        try {
            this.employee_type_id = event != null ? event.Id : 0;

            this.parent_employee_type = event.parent + '';
        } catch (error) {}
    }
    //#endregion
    //#region emp list
    item_Project: any;

    @Input() itemEmp!: number;

    listEmp: any;
    listEmps: any = [];
    empId = '';

    selectedEmp: any;
    selectedListEmp(e: any) {
        this.emp_code = e.value === null ? 0 : e.value.code;
    }

    loadEmployees() {
        this._serviceEmp
            .ewo_GetEmployeeList(
                1000000,
                1,
                '',
                '',
                '',
                '',
                '',
                '',
                0,
                0,
                Helper.ProjectID(),
                -1,
                '',
                ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listEmp = [];
                    data.data.forEach((element: any) => {
                        this.listEmp.push({
                            name: `${element.employee_code} - ${element.employee_name}`,
                            code: element.employee_code,
                        });
                    });
                }
            });
    }
    //#endregion
    //#region shop list
    selectShop(event: any) {
        this.shop_code = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.shop_code += element != null ? element.id + ' ' : '';
            });
        } else {
            this.shop_code = '';
        }
    }
    //#endregion
    //#region action
    id = 0;
    newListEmpShopsDialog: boolean = false;
    isSave = 0;
    titleDialog = '';
    editMode = false;
    openAddForm() {
        this.newListEmpShopsDialog = true;
        this.isSave = 0;
        this.titleDialog = 'Create new';
        this.editMode = false;
    }
    resetnewListEmpShopsDialog() {
        this.resetAllInput();
    }
    resetAllInput() {
        this.emp_code = null;
        this.shop_code = null;
        (this.employee_type_id = 0), this.selectStatus == null;
        this.limitedFromDate = 0;
        this.limitedMaxDate = 0;
        this.selectedEmp = null;
    }
    Save(event: Event) {
        let check = true;
        let intDateStart = 0;
        let intDateEnd = 0;

        this.limitedFromDate == undefined || this.limitedFromDate == ''
            ? (intDateStart = 0)
            : (intDateStart = parseInt(
                  Pf.StringDateToInt(this.limitedFromDate)
              ));
        this.limitedMaxDate == undefined || this.limitedMaxDate == ''
            ? (intDateEnd = 0)
            : (intDateEnd = parseInt(Pf.StringDateToInt(this.limitedMaxDate)));

        if (intDateEnd < intDateStart && intDateEnd !== 0) {
            this.limitedFromDate = '';
            this.toDate = '';
            this.messageService.add({
                severity: 'warn',
                summary: 'The end date must be greater than the starting date!',
                detail: '',
            });
            return;
        }
        if (Helper.IsNull(this.emp_code) || this.emp_code == '') {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please choose emp!',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    close();
                },
                reject: () => {
                    close();
                },
            });
            check = false;
        }
        if (Helper.IsNull(this.shop_code) || this.shop_code == '') {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please enter shop code!',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    close();
                },
                reject: () => {
                    close();
                },
            });
            check = false;
        }
        if (intDateStart == 0) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please select from date!',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    close();
                },
                reject: () => {
                    close();
                },
            });
            check = false;
        }
        if (
            Helper.transformDateInt(this.limitedMaxDate) > 20230101 &&
            Helper.transformDateInt(this.limitedFromDate) > 0 &&
            Helper.transformDateInt(this.limitedMaxDate) <
                Helper.transformDateInt(this.limitedFromDate)
        ) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'The end date cannot be less than the start date!',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    close();
                },
                reject: () => {
                    close();
                },
            });
            check = false;
        }
        if (check == true) {
            let action = '';
            if (this.isSave == 0) {
                action = 'create';
                this.id = 0;
            } else if (this.isSave == 1) {
                action = 'update';
            }
            this._service
                .action(
                    (this.id = this.isSave === 0 ? this.id : this.emShops_id),
                    Helper.ProjectID(),
                    this.emp_code,
                    this.shop_code,
                    (intDateStart =
                        this.isSave === 0
                            ? intDateStart
                            : Helper.transformDateInt(this.limitedFromDate)),
                    (intDateEnd =
                        this.isSave === 0
                            ? intDateEnd
                            : Helper.transformDateInt(this.limitedMaxDate)),
                    1,
                    action
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.newListEmpShopsDialog = false;

                        // clear value
                        this.resetAllInput();

                        this.loadData(1);
                        if (action === 'create') {
                            this.messageService.add({
                                severity: 'success',
                                summary:
                                    'Add new Employee shops List successfully',
                                detail: '',
                            });
                        } else if (action === 'update') {
                            this.messageService.add({
                                severity: 'success',
                                summary:
                                    'Edit Employee shops List successfully',
                                detail: '',
                            });
                        }
                    } else {
                        this.newListEmpShopsDialog = false;
                        this.messageService.add({
                            severity: 'danger',
                            summary: 'Error',
                            detail: '',
                        });
                    }
                });
        }
    }
    openEditForm(item: any) {
        this.editMode = true;
        this.isSave = 1;
        this.titleDialog = 'Edit';

        this.emShops_id = item.Id;

        this.emp_code = item.employee_code;
        this.shop_code = item.shop_code;
        this.limitedFromDate = this.FormatFromToDate(item.FromDate);
        this.limitedMaxDate = this.FormatFromToDate(item.ToDate);
        this.is_active = item.IsActive;

        this.newListEmpShopsDialog = true;
    }
    openDelete(item: any) {
        this.emShops_id = item.Id;

        this.emp_code = item.employee_code;
        this.shop_code = item.shop_code;
        this.from_date = item.FromDate;
        this.to_date = item.ToDate;
        this.is_active = item.IsActive;

        this.confirmationService.confirm({
            // target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .action(
                        this.emShops_id,
                        Helper.ProjectID(),
                        this.emp_code,
                        this.shop_code,
                        this.from_date,
                        this.to_date,
                        0,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            // clear value
                            this.resetAllInput();
                            this.loadData(1);

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Delete Employee Shop successfully',
                                detail: '',
                            });
                        } else {
                            this.messageService.add({
                                severity: 'danger',
                                summary: 'Error',
                                detail: '',
                            });
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
    //#endregion

    //#region Import Show data
    // ===================== IMPORT FILE CREATE PRODUCT ==========================//
    dataError: any;
    dataMessError: any;
    clearDataImport() {
        this.dataError = undefined;
        this.dataMessError = undefined;
    }

    typeImport: number = 0;
    showTemplate: number = 0;
    ShowHideTemplate(value: any) {
        if (this.showTemplate == 0) {
            this.showTemplate = 1;
            this.typeImport = value;
            this.clearDataImport();
        } else {
            this.showTemplate = 0;
        }
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

            this._service
                .Emp_Shops_ImportData(formDataUpload, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Product',
                            'Add product',
                            'Add successful products from Import file',
                            'success',
                            'Successful'
                        );
                        this.loadData(1);
                    } else {
                        if (data.data == null) {
                            this.dataMessError = data.message;

                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Warning',
                                // detail: 'Please select the correct file to import template file',
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
    //#endregion

    //#region Get template
    getTemplate() {
        this._service.Emp_Shops_GetTemplate(Helper.ProjectID());
    }
    //#endregion

    //#region Raw Data
    export() {
        let intDateStart = 0;
        let intDateEnd = 0;

        this.limitedFromDate == undefined || this.limitedFromDate == ''
            ? (intDateStart = 0)
            : (intDateStart = parseInt(
                  Pf.StringDateToInt(this.limitedFromDate)
              ));
        this.limitedMaxDate == undefined || this.limitedMaxDate == ''
            ? (intDateEnd = 0)
            : (intDateEnd = parseInt(Pf.StringDateToInt(this.limitedMaxDate)));

        if (intDateEnd < intDateStart && intDateEnd !== 0) {
            this.limitedFromDate = '';
            this.limitedMaxDate = '';
            this.messageService.add({
                severity: 'warn',
                summary: 'The end date must be greater than the starting date!',
                detail: '',
            });
            return;
        }
        this._service.Emp_Shops_RawData(
            Helper.ProjectID(),
            this.emp_code,
            null,
            this.shop_code,
            intDateStart,
            intDateEnd,
            100000,
            1,
            -1
        );
        // }
    }
    //#endregion

    // 'xlsx'
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.dataError);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'emp_shops');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }
}
