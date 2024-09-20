import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, Header, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { SellOutService } from 'src/app/web/service/sell-out.service';
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
    selector: 'app-sell-out-target',
    templateUrl: './sell-out-target.component.html',
    styleUrls: ['./sell-out-target.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class SellOutTargetComponent {
    cols!: Column[];
    exportColumns!: ExportColumn[];

    shopDialog: boolean = false;
    products!: any[];
    product!: any;

    selectedProducts!: any[] | null;
    submitted: boolean = false;
    statuses!: any[];

    constructor(
        private _service: SellOutService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    items_menu: any = [
        { label: ' SELLOUT' },
        {
            label: ' Shop Action',
            icon: 'pi pi-shopping-cart',
            routerLink: '/shop-action',
        },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };

    ngOnInit() {
        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'shop_code', header: 'Shop Code' },
            { field: 'target', header: 'Target' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this.getMonth();
        this.loadData(1);
    }

    currentDate: any = null;
    listMonth: any = null;

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
        this.year_month = this.listMonth?.find(
            (i: any) => i?.code == this.currentDate
        );
    }

    showFiter: any = true;
    showFilter() {
        this.showFiter = !this.showFiter;
    }

    first: number = 0;
    rows: number = 20;
    // numberPage: number = 1
    totalRecords: number = 0;
    _pageNumber: any = 0;
    onPageChange(e: any) {
        this.first = e.first;
        this.rows = e.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }

    year_month: any = null;
    shop_code: any = null;

    listSellOutTarget: any = [];
    loading: boolean = false;
    loadData(pageNumber: number) {
        if (pageNumber == 1) {
            this.first = 1;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }

        this.loading = true;
        this._service
            .SellOut_Target_GetList(
                Helper.ProjectID(),
                Helper.IsNull(this.year_month) != true
                    ? this.year_month.code
                    : 0,
                this.shop_code,
                this.rows,
                this._pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listSellOutTarget = data.data;
                    this.listSellOutTarget = this.listSellOutTarget.map(
                        (x: any) => ({
                            ...x,
                            _year_month: Helper.transformYearMonth(
                                x.year_month + ''
                            ),
                            _tooltip: `Create By : [${x.created_by}] - ${x.create_code} - ${x.create_name} | Create Date : ${x.created_date}`,
                        })
                    );
                    this.totalRecords =
                        this.listSellOutTarget.length > 0
                            ? this.listSellOutTarget[0].TotalRows
                            : 0;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.listSellOutTarget = [];
                }
            });
    }

    openNew() {
        // this.product = {};
        this.submitted = false;
        this.shopDialog = true;
    }

    deleteProduct(product: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(
                    (val) => val.id !== product.id
                );
                this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'any Deleted',
                    life: 3000,
                });
            },
        });
    }

    hideDialog() {
        this.shopDialog = false;
        this.submitted = false;
    }

    target: any = null;
    saveShop() {
        this.submitted = true;
        if (
            this.NofiIsNull(this.year_month, 'year month') == 1 ||
            this.NofiIsNull(this.shop_code, 'shop code') == 1 ||
            this.checkDuplicates(
                this.shop_code.split(' ').filter((e: any) => e != ''),
                'Duplicate shop code '
            ) == 1 ||
            this.checkValue(this.target, 'target') == 1
        ) {
            return;
        } else {
            this._service
                .SellOut_Target_Action(
                    Helper.ProjectID(),
                    this.year_month.code,
                    this.shop_code,
                    this.target
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Shop Action',
                            'Update Shop Action',
                            'Update Shop Action SuccessFull',
                            'success',
                            'SuccessFull'
                        );
                        this.loadData(1);
                        this.clearSaveShop();
                    }
                });
        }
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

    clearSaveShop() {
        // this.products = [...this.products];
        this.target = null;
        this.shopDialog = false;
        this.product = {};
    }

    export() {
        this._service.SellOut_Target_RawData(
            Helper.ProjectID(),
            Helper.IsNull(this.year_month) != true ? this.year_month.code : 0,
            this.shop_code,
            100000000,
            1
        );
    }

    showTemplate: any = 0;
    typeImport: number = 0;
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
        this._service.SellOut_Target_GetTemplate(Helper.ProjectID());
    }
    importTemplate() {
        if (
            this.NofiIsNull(this.file, 'file') == 1 ||
            this.NofiCheckFile(
                this.file.name.split('.').pop(),
                'File import'
            ) == 1 ||
            this.NofiIsNull(this.year_month, 'year_month') == 1
        ) {
            return;
        } else {
            this.clearDataImport();
            const formDataUpload = new FormData();
            formDataUpload.append('files', this.file);

            this._service
                .SellOut_Target_ImportData(
                    formDataUpload,
                    Helper.ProjectID(),
                    Helper.IsNull(this.year_month) != true
                        ? this.year_month.code
                        : 0
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Shop Action',
                            'Update Shop Action',
                            'Update Shop Action Successfull',
                            'success',
                            'Successfull'
                        );
                        this.loadData(1);
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
    // 'jspdf' - 'jspdf-autotable'
    exportPdf(title: any, value: any) {
        import(title).then((jsPDF) => {
            import(value).then((x) => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.dataError);
                doc.save('ShopAction.pdf');
            });
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
            this.saveAsExcelFile(excelBuffer, 'ShopAction');
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

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            /*
      if (this.products[i].id === id) {
        index = i;
        break;
      }
      */
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string): any {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }

    // notification
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
    checkValue(value: any, name: any): any {
        let check = 0;
        if (value < 0 || (value != 0 && Helper.IsNull(value) == true)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `Please enter ${name} larger or equal to 0`,
            });
            check = 1;
        }
        return check;
    }

    NofiIsNullNumber(value: any, name: any): any {
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
        return check;
    }

    NofiCheckFile(value: any, name: any): any {
        let check = 0;
        if (value != 'xlsx') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
            this.clearFileInput();
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
}
