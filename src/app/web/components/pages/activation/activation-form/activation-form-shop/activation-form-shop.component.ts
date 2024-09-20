import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnyRecord } from 'dns';
import { MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { PromotionService } from 'src/app/web/service/promotion.service';
import * as FileSaver from 'file-saver';
import { ActivationService } from 'src/app/web/service/activation.service';

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
    selector: 'app-activation-form-shop',
    templateUrl: './activation-form-shop.component.html',
    styleUrls: ['./activation-form-shop.component.scss'],
})
export class ActivationFormShopComponent implements OnInit {
    constructor(
        private router: Router,
        private _service: ActivationService,
        private messageService: MessageService
    ) {}

    status: any = -1;
    statuses: any = [
        {
            title: 'Active',
            value: 1,
        },
        {
            title: 'In Active',
            value: 0,
        },
    ];

    selectStatus(e: any) {
        this.status = e.value === null ? -1 : e.value;
    }

    items_menu: any = [
        { label: ' ACTIVATION ' },
        {
            label: ' Form Shop ',
            icon: 'pi pi-table',
            routerLink: '/activation/promotion-shop',
        },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    icon_eye = 'pi pi-eye';
    menu_id = 85;
    check_permissions() {
        // console.log(JSON.parse(localStorage.getItem('menu')))
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }

    visible: boolean = false;
    items: any;
    selectMonth: any;
    listMonth: any[] = [];
    currentDate: any;

    activation_form!: any;
    shop_code!: string;
    //variable data table

    dataForm: any[] = [];

    // variable action
    form_name: any;

    cols!: Column[];
    exportColumns!: ExportColumn[];

    ngOnInit(): void {
        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'form_name', header: 'Form Name' },
            { field: 'shop_code', header: 'Shop Code' },
            { field: 'status', header: 'Status' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this.items = [
            {
                label: 'Form',
                // icon: 'pi pi-question-circle',
                command: () => {
                    this.viewFormShop();
                },
            },
        ];

        this.getMonth();
        this.handleFilter(1);
    }

    getMonth() {
        const date = new Date();
        const year = date.getFullYear();
        const monthToday = date.getMonth() + 1;
        const monthString = monthToday.toString().padStart(2, '0');
        this.currentDate = parseInt(year + monthString);

        for (let i = 1; i <= 12; i++) {
            const month = i.toString().padStart(2, '0');
            const dateString = `${year} - Tháng ${month}`;

            const dataMonth = Helper.getMonth();
            this.listMonth = dataMonth.ListMonth;
            // this.listMonth = this.listMonth?.filter((i: any) => i?.code >= this.currentDate)
        }

        this.selectMonth = this.listMonth?.find(
            (i: any) => i?.code == this.currentDate
        );
    }

    selectForm(e: any) {
        this.activation_form = e?.code;
        this.form_name = e?.form_name;
    }

    first: number = 0;
    rows: number = 20;
    totalRecords: number = 0;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.handleFilter(this._pageNumber);
    }

    // filter
    is_loadForm: number = 0;
    handleFilter(pageNumber: number) {
        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }

        this._service
            .activation_shop_GetList(
                Helper.ProjectID(),
                this.activation_form,
                this.shop_code,
                this.status,
                this.rows,
                this._pageNumber
            )
            .subscribe((res: any) => {
                if ((res.result = EnumStatus.ok)) {
                    const data = res.data.map((e: any, i: any) => ({
                        rowNumber: e.RowNumber,
                        shop_code: e.shop_code,
                        shop_name: e.shop_name,

                        form: e.activation_form + '-' + e.form_name,
                        activation_form: e.activation_form,
                        form_name: e.form_name,
                        year_month: e.year_month,
                        _year_month: Helper.transformYearMonth(
                            e.year_month + ''
                        ),
                        target: e.target,
                        status: e.status,
                        createDay: e.created_date,
                        TotalRows: e.TotalRows,
                    }));
                    this.dataForm = data;
                    this.totalRecords =
                        this.dataForm.length > 0
                            ? this.dataForm[0].TotalRows
                            : 0;
                }
            });
    }

    ShowModel() {
        this.visible = true;
    }

    // action

    dataErrorAction: any = ``;
    detailsErrorAction: any = ``;

    target: any = null;
    action() {
        if (
            this.NofiIsNullTypeNumber(this.activation_form, 'form') == 1 ||
            this.NofiIsNull(this.shop_code, 'shop code') == 1 ||
            this.checkDuplicates(
                this.shop_code.split(' ').filter((e: any) => e != ''),
                'Duplicate shop code '
            ) == 1 ||
            this.NofiIsNullStatus(this.status, 'status') == 1
        ) {
            return;
        } else {
            this._service
                .activation_shop_Action(
                    Helper.ProjectID(),
                    this.activation_form,
                    this.shop_code,
                    this.status
                )
                .subscribe((res: any) => {
                    if (res.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page form shop',
                            'Update form shop',
                            `Successfully edited the status = ${this.status} of the form name
          (${this.form_name}) for shops code (${this.shop_code})`,
                            'success',
                            'Successfull'
                        );
                        this.handleFilter(1);
                        this.visible = false;
                    } else {
                        this.clearDataError();
                        res.data.forEach((element: any) => {
                            this.detailsErrorAction = `${element.error_name}:`;
                            this.dataErrorAction += ` ${element.shop_code} `;
                        });
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail:
                                this.detailsErrorAction + this.dataErrorAction,
                        });
                    }
                });
        }
    }
    clearDataError() {
        this.dataErrorAction = ``;
        this.dataErrorAction = ``;
    }

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
    NofiIsNullStatus(value: any, name: any): any {
        let check = 0;
        if (value != 0 && value != 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
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

    NofiIsNullTypeNumber(value: any, name: any): any {
        let check = 0;

        if (
            Helper.IsNullTypeNumber(value) == true ||
            Pf.checkSpace(value) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        // }
        return check;
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

    checkNumber(value: any, name: any): any {
        if (Helper.number(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
    }

    checkStatus(value: any, name: any): any {
        if (value != -1 && value != 0 && value != 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name,
            });
            return 1;
        }
        return 0;
    }

    export() {
        this._service.activation_shop_RawData(
            Helper.ProjectID(),
            this.shop_code
        );
    }
    viewFormShop() {
        this.router.navigate(['/activation/activation-form']);
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
    dataError: any;
    dataMessError: any;
    clearDataImport() {
        this.dataError = undefined;
        this.dataMessError = undefined;
    }

    getTemplate() {
        this._service.Promotion_Shop_GetTemplate(Helper.ProjectID());
    }

    importTemplate() {
        if (Helper.IsNull(this.file) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter file',
            });
            return;
        }

        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a month',
            });
            return;
        }

        this.clearDataImport();
        const formDataUpload = new FormData();
        formDataUpload.append('files', this.file);

        this._service
            .Promotion_Shop_ImportData(formDataUpload, Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.NofiResult(
                        'Page Promotion',
                        'Add Promotion Shop',
                        'Add Promotion Shop Successfull',
                        'success',
                        'Successfull'
                    );
                    this.handleFilter(1);
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
                        console.log(
                            '🚀 ~ file: promo.component.ts:226 ~ PromoComponent ~ .subscribe ~ this.dataError:',
                            this.dataError
                        );
                    }
                }
                this.clearFileInput();
            });
    }

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
            this.saveAsExcelFile(excelBuffer, 'promotion_shop');
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

    getSeverity(value: any): any {
        switch (value) {
            case 0:
                return 'danger';
            case 1:
                return 'success';
            default:
                return 'warning';
        }
    }
}
