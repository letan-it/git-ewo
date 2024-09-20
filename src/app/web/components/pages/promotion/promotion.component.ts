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
    selector: 'app-promotion',
    templateUrl: './promotion.component.html',
    styleUrls: ['./promotion.component.scss'],
})
export class PromotionComponent implements OnInit {
    constructor(
        private router: Router,
        private _service: PromotionService,
        private messageService: MessageService
    ) {}

    items_menu: any = [
        { label: ' SETTING KPI' },
        { label: ' Display ', icon: 'pi pi-gift', routerLink: '/promo' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    icon_eye = 'pi pi-eye';
    menu_id = 23;
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

    promotion_id!: any;
    shop_code!: string;
    //variable data table

    dataPromotion: any[] = [];

    // variable action
    target: any;
    promotion_code: any;

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
            { field: 'promotion_code', header: 'Promotion Code' },
            { field: 'shop_code', header: 'Shop Code' },
            { field: 'target', header: 'Target' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this.items = [
            {
                label: 'Promotion',
                // icon: 'pi pi-question-circle',
                command: () => {
                    this.viewPromotionShop();
                },
            },
        ];

        this.getMonth();
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

    selectPromotion(e: any) {
        this.promotion_id = e?.code;
        this.promotion_code = e?.promotion_code;
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
            // this.rows  = 20;
            this._pageNumber = 1;
        }

        this._service
            .Promotion_Shop_GetList(
                Helper.ProjectID(),
                this.selectMonth?.code ? this.selectMonth?.code : 0,
                this.promotion_id,
                this.shop_code,
                this.rows,
                this._pageNumber
            )
            .subscribe((res: any) => {
                if ((res.result = EnumStatus.ok)) {
                    const data = res.data.map((e: any, i: any) => ({
                        rowNumber: e.RowNumber,
                        shop_code: e.shop_code,
                        shop_name: e.shop_name,
                        promotion: e.promotion_code + '-' + e.promotion_name,
                        promotion_code: e.promotion_code,
                        year_month: e.year_month,
                        _year_month: Helper.transformYearMonth(
                            e.year_month + ''
                        ),
                        target: e.target,
                        createDay: e.created_date,
                        TotalRows: e.TotalRows,
                    }));
                    this.dataPromotion = data;
                    this.totalRecords =
                        this.dataPromotion.length > 0
                            ? this.dataPromotion[0].TotalRows
                            : 0;
                    // this.promotion_code = this.dataPromotion.map((i: any) => (i.promotion_code))
                }
            });
    }

    ShowModel() {
        this.visible = true;
    }

    // action

    dataErrorAction: any = ``;
    detailsErrorAction: any = ``;

    action() {
        if (
            this.NofiIsNull(this.selectMonth?.code, 'year month') == 1 ||
            this.NofiIsNullTypeNumber(this.promotion_id, 'Promotion') == 1 ||
            this.NofiIsNull(this.shop_code, 'shop code') == 1 ||
            this.NofiIsNull(this.target, 'target') == 1 ||
            this.checkNumber(this.target, 'Target') == 1
        ) {
            return;
        } else {
            this._service
                .Promotion_Shop_Action(
                    Helper.ProjectID(),
                    this.selectMonth?.code,
                    this.promotion_id,
                    this.shop_code,
                    this.target
                )
                .subscribe((res: any) => {
                    if (res.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Promotion',
                            'Update promotion_Shop',
                            `Successfully edited the target = ${this.target} of the promotion code
          (${this.promotion_code}) for shops code (${this.shop_code}) in ${this.selectMonth.name}`,
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

    export() {
        this._service.Promotion_Shop_RawData(
            Helper.ProjectID(),
            this.selectMonth?.code,
            this.shop_code
        );
    }
    viewPromotionShop() {
        this.router.navigate(['/promo/item']);
    }
    // table

    // onPageChange(e: any) {
    //   this.first = e.first
    //   this.rows = e.rows
    //   this.numberPage = (this.first + this.rows) / this.rows
    //   this.handleFilter()
    // }

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
            .Promotion_Shop_ImportData(
                formDataUpload,
                Helper.ProjectID(),
                this.selectMonth.code
            )
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
}
