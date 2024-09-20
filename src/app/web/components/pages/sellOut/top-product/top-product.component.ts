import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { ProductService } from 'src/app/web/service/product.service';
import { SellOutService } from 'src/app/web/service/sell-out.service';
import * as FileSaver from 'file-saver';
import { AppComponent } from 'src/app/app.component';
import { Pf } from 'src/app/_helpers/pf';

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
    selector: 'app-top-product',
    templateUrl: './top-product.component.html',
    styleUrls: ['./top-product.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TopProductComponent {
    constructor(
        private _service: SellOutService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    productDialog: boolean = false;
    products!: [];
    product!: any;
    selectedTopProduct!: any[] | null;
    submitted: boolean = false;
    statuses!: any[];

    cols!: Column[];
    exportColumns!: ExportColumn[];

    items_menu: any = [
        { label: ' SELLOUT' },
        {
            label: ' Top Product',
            icon: 'pi pi-shopping-bag',
            routerLink: '/topProduct',
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
            { field: 'product_code', header: 'Product Code' },
            { field: 'orders', header: 'Orders' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this.getMonth();
        this.loadData(1);
    }

    shop_code: any = null;
    product_id: any = null;
    rowPerPage: any = null;
    pageNumber: any = null;
    currentDate: any = null;
    listMonth: any = [];
    year_month: any = null;
    orders: any = null;
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
            // Ko đăng kí tháng cũ
            // this.listMonth = this.listMonth?.filter(
            //     (i: any) => i?.code >= this.currentDate
            // );
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

    loading: boolean = false;
    listTopProduct: any = [];
    loadData(pageNumber: number) {
        if (pageNumber == 1) {
            this.first = 1;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        // this.shop_id
        this.loading = true;
        this._service
            .TopProduct_GetList(
                Helper.ProjectID(),
                Helper.IsNull(this.year_month) != true
                    ? this.year_month.code
                    : 0,
                this.shop_code,
                this.product_id,
                this.rows,
                this._pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listTopProduct = data.data;
                    this.listTopProduct = this.listTopProduct.map((t: any) => ({
                        ...t,
                        _year_month: Helper.transformYearMonth(
                            t.year_month + ''
                        ),
                        _toolTip: `Create By : [${t.created_by}] - ${t.employee_code} - ${t.employee_name} | Create Date : ${t.created_date}`,
                    }));
                    this.totalRecords =
                        this.listTopProduct.length > 0
                            ? this.listTopProduct[0].TotalRows
                            : 0;
                    this.loading = false;
                } else {
                    this.listTopProduct = [];
                    this.loading = false;
                }
            });
    }

    shop_id: any = null;
    selectShop(event: any) {
        this.shop_id = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.shop_id += element != null ? element.id + ' ' : '';
            });
        } else {
            this.shop_id = '';
        }
    }

    clearSelectEmployee(event: any) {
        this.product_id = event == true ? '' : this.product_id;
    }

    selectProduct(event: any) {
        this.product_id = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.product_id += element != null ? element.id + ' ' : '';
            });
        } else {
            this.product_id = '';
        }
    }
    test() {
        console.log(this.product_id);
    }
    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message:
                'Are you sure you want to delete the selected top products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedTopProduct = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000,
                });
            },
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (
            this.NofiIsNull(this.year_month, 'year_month') == 1 ||
            this.NofiIsNull(this.product_id, 'product') == 1 ||
            this.NofiIsNull(this.shop_code, 'shop code') == 1 ||
            this.checkDuplicates(
                this.shop_code.split(' ').filter((e: any) => e != ''),
                'Duplicate shop code '
            ) == 1 ||
            this.checkValue(this.orders, 'orders') == 1
        ) {
            return;
        } else {
            this._service
                .TopProduct_Action(
                    Helper.ProjectID(),
                    this.year_month.code,
                    this.shop_code,
                    this.product_id,
                    this.orders
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Top Product',
                            'Update Top Product',
                            'Update Top Product SuccessFull',
                            'success',
                            'SuccessFull'
                        );
                        this.loadData(1);
                        this.clearSaveProduct();
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

    clearSaveProduct() {
        this.orders = null;
        this.productDialog = false;
        this.product = {};
    }

    export() {
        if (this.NofiIsNull(this.year_month, 'year month') == 1) {
            return;
        } else {
            this._service.TopProduct_RawData(
                Helper.ProjectID(),
                Helper.IsNull(this.year_month) != true
                    ? this.year_month.code
                    : 0,
                this.shop_code
            );
        }
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
        this._service.TopProduct_GetTemplate(Helper.ProjectID());
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
                .TopProduct_ImportData(
                    formDataUpload,
                    Helper.ProjectID(),
                    Helper.IsNull(this.year_month) != true
                        ? this.year_month.code
                        : 0
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Top Product',
                            'Update Top Product',
                            'Update Top Product Successfull',
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
                doc.save('Topproduct.pdf');
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
            this.saveAsExcelFile(excelBuffer, 'TopProduct');
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
