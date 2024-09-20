import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ShopsService } from 'src/app/web/service/shops.service';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { ExportService } from 'src/app/web/service/export.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
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
    selector: 'app-store-target',
    templateUrl: './store-target.component.html',
    styleUrls: ['./store-target.component.scss'],
    providers: [DatePipe],
})
export class StoreTargetComponent {
    constructor(
        private messageService: MessageService,
        private router: Router,
        private _service: ShopsService,
        private datePipe: DatePipe,
        private serviceExport: ExportService
    ) { }
    items_menu: any = [
        { label: ' PROJECT' },
        { label: ' Store', icon: 'pi pi-home', routerLink: '/stores' },
        { label: ' Target', icon: 'pi pi-thumbs-up' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    shop_code: any = '';
    isLoading_Filter: boolean = false;

    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }

    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    selectMonth: any = '';
    ListMonth: any = [];
    PlanDate: any;
    date: any;
    getMonth(date: Date, format: string) {
        const today = new Date();
        const year = today.getFullYear();
        const monthToday = today.getMonth() + 1;
        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        const dataMonth = Helper.getMonth()
        this.ListMonth = dataMonth.ListMonth
        this.ListMonth = this.ListMonth.map((x: any) => ({
            ...x,
            code: x.code + ``,
        }))

        const monthString = monthToday.toString().padStart(2, '0')
        const currentDate = parseInt(year + monthString)
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find((i: any) => (i?.code == currentDate))
        }

        this.month = year + monthString + ``;
    }


    year_month: any;

    cols!: Column[];
    exportColumns!: ExportColumn[];
    ngOnInit(): void {

        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' }, 
            { field: 'error_name', header: 'Error Name', customExportHeader: 'Error Name' },
            { field: 'shop_code', header: 'Shop Code' }

        ];
        this.exportColumns = this.cols.map((col: any) => ({ title: col.header, dataKey: col.field }));

        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');


    }

    //   20230807
    transformdate(value: any) {
        console.log('value');
        console.log(value);

        const year = value.slice(0, 4);
        const month = value.slice(4, 6);
        const day = value.slice(6);
        return `${day}/${month}/${year}`;
    }

    showTemplate: number = 0;
    ShowHideTemplate() {
        if (this.showTemplate == 1) {
            this.showTemplate = 0;
        } else {
            this.showTemplate = 1;
        }
    }

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;

        this._pageNumber = (this.first + this.rows) / this.rows;

        this.filter(this._pageNumber);
    }

    ListShopByMonth: any = [];
    month: any = '';

    filter(pageNumber: number) {

        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }

        this.ListShopByMonth = [];
        this.isLoading_Filter = true;

        this._service
            .ShopInfo_byMonth_GetList(
                Helper.ProjectID(),
                this.shop_code,
                Helper.IsNull(this.selectMonth) == true ? this.month : this.selectMonth.code,
                this.rows,
                pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListShopByMonth = data.data;
                        this.totalRecords = this.ListShopByMonth[0].TotalRows;

                        this.ListShopByMonth = this.ListShopByMonth.map(
                            (item: any) => ({
                                ...item,
                                _year_month: Helper.transformYearMonth(
                                    item.year_month + ''
                                ),
                            })
                        );

                        this.isLoading_Filter = false;
                    } else {
                        this.isLoading_Filter = false;
                        // this.message = 'No data';
                        // this.display = true;
                    }
                }
            });
    }
    export() {
        console.log(
            '🚀 ~ file: store-target.component.ts:164 ~ StoreTargetComponent ~ export ~  this.shop_code, this.selectMonth, this.rows, this._pageNumber:',
            this.shop_code,
            Helper.IsNull(this.selectMonth) == true ? this.month : this.selectMonth.code,
            this.rows,
            this._pageNumber
        );
        this.serviceExport.ShopInfo_byMonth_GetList_Export(
            Helper.ProjectID(),
            this.shop_code,
            Helper.IsNull(this.selectMonth) == true ? this.month : this.selectMonth.code,
            // '202308',
            this.rows,
            this._pageNumber
        );
    }

    dataError: any;
    dataMessError: any;
    clearDataImport() {
        this.dataError = undefined;
        this.dataMessError = undefined;
    }

    importData() {

        this.clearDataImport()

        if (this.NofiIsNull(this.selectMonth, 'year month') == 1 ||
            this.NofiIsNull(this.shop_code, 'shop code') == 1) {
            return;
        } else {
            this._service.ShopInfo_byMonth_ImportData(
                Helper.ProjectID(),
                Helper.IsNull(this.selectMonth) == true ? this.month : this.selectMonth.code,
                this.shop_code)
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(`Page Store Target`, `Import Data`, `Sign up for a shop list ( ${this.shop_code} ) in ${this.selectMonth.name} successfully`, `success`, `Successfull`)
                        this.clearFormImportData();
                        this.filter(1)
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
                })
        }

    }
    clearFormImportData() {
        this.shop_code = '';
    }
    getStatusName(status: string): any {
        switch (status) {
            case 'Thành công':
                return 'success';
            case 'Không thành công':
                return 'danger';
            // case 'LOWSTOCK':
            // return 'warning';
        }
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

    // 'xlsx'
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.dataError);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'stores-target');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    exportTemplate() { }
    importTemplate() { }


}
