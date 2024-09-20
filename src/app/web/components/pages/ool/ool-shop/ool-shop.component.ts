import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { MastersService } from 'src/app/web/service/masters.service';
import { OolService } from 'src/app/web/service/ool.service';

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
    selector: 'app-ool-shop',
    templateUrl: './ool-shop.component.html',
    styleUrls: ['./ool-shop.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class OolShopComponent {
    constructor(
        private _service: OolService,
        private masters: MastersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private router: Router
    ) {}

    actions: any = [];
    selectedActions: any = null;

    cols!: Column[];
    exportColumns!: ExportColumn[];

    ngOnInit() {
        // this.productService.getProducts().then((data) => (this.listOOLShop = data));

        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'shop_code', header: 'Shop Code' },
            { field: 'ool_code', header: 'OOL Code' },
            { field: 'target', header: 'Target' },
            { field: 'target_type', header: 'Target Type' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        // error_name	shop_code	ool_code	target	target_type

        this.loadUser();
        this.getMonth();
        this.getTargetType();
        this.loadData(1);
    }
    currentUser: any = null;

    create() {
        this.router.navigate(['/ool-shop/ool-list']);
    }
    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];
    }
    item_ool: any = null;
    selectOOLList(event: any) {
        this.item_ool = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.item_ool += element != null ? element.id + ' ' : '';
            });
        } else {
            this.item_ool = '';
        }
        console.log('this.item_ool ', this.item_ool);
    }

    clearSelectOOLList(event: any) {
        this.item_ool = event == true ? null : this.item_ool;
    }

    items_menu: any = [
        { label: ' SETTING KPI' },
        { label: ' OOL ', icon: 'pi pi-th-large', routerLink: '/ool-shop' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };

    targetType: any = null;
    itemTargetType: any = null;
    selectTargetType(event: any) {
        this.targetType = Helper.IsNull(event) != true ? event.value : null;
        console.log('this.targetType : ', this.targetType);
    }

    targetTypeList: any = [];
    getTargetType() {
        this.masters
            .ewo_GetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    const result = data.data.filter(
                        (x: any) =>
                            x.Status == 1 &&
                            x.ListCode == 'target_type' &&
                            x.Table == 'OOL_Target'
                    );
                    result.forEach((element: any) => {
                        this.targetTypeList.push({
                            id: element.Id,
                            name: `[${element.Id}] - ${element.NameVN}`,
                        });
                    });
                }
            });
    }

    rowPerPage: any = null;
    pageNumber: any = null;
    currentDate: any = null;
    listMonth: any = [];
    selectMonth: any = null;
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
            // this.listMonth = this.listMonth?.filter((i: any) => i?.code >= this.currentDate)
        }
        this.year_month = this.listMonth?.find(
            (i: any) => i?.code == this.currentDate
        );
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
    listOOLTarget: any = [];
    loadData(pageNumber: number) {
        if (pageNumber == 1) {
            this.first = 1;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        // this.shop_id
        //  project_id, year_month, shop_code, ool_id,  target_type, rowPerPage, pageNumber
        this.loading = true;
        this._service
            .OOL_Target_GetList(
                Helper.ProjectID(),
                Helper.IsNull(this.year_month) != true
                    ? this.year_month.code
                    : 0,
                this.shop_code,
                Helper.IsNull(this.item_ool) != true ? this.item_ool : null,
                Helper.IsNull(this.targetType) != true ? this.targetType.id : 0,
                this.rows,
                this._pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listOOLTarget = data.data;
                    this.listOOLTarget = this.listOOLTarget.map((t: any) => ({
                        ...t,
                        _year_month: Helper.transformYearMonth(
                            t.year_month + ''
                        ),
                        _toolTip: `Create By : [${t.created_by}] - ${t.create_code} - ${t.create_name} | Create Date : ${t.created_date}`,
                    }));
                    this.totalRecords =
                        this.listOOLTarget.length > 0
                            ? this.listOOLTarget[0].TotalRows
                            : 0;
                    console.log('this.listOOLTarget : ', this.listOOLTarget);
                    this.loading = false;
                } else {
                    this.listOOLTarget = [];
                    this.loading = false;
                }
            });
    }

    shop_code: any = null;
    oolDialog: boolean = false;
    listOOLShop!: any[];

    product!: any;
    selectedProducts!: any[] | null;
    submitted: boolean = false;
    statuses!: any[];

    openNew() {
        this.product = {};
        this.submitted = false;
        this.oolDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message:
                'Are you sure you want to delete the selected listOOLShop?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.listOOLShop = this.listOOLShop.filter(
                    (val) => !this.selectedProducts?.includes(val)
                );
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000,
                });
            },
        });
    }

    editOOL(product: any) {
        this.product = { ...product };
        this.oolDialog = true;
    }

    deleteOOL(product: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.listOOLShop = this.listOOLShop.filter(
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
        this.oolDialog = false;
        this.submitted = false;
    }

    target: any = null;
    saveOOL() {
        this.submitted = true;

        if (
            this.NofiIsNull(this.year_month, 'year_month') == 1 ||
            this.NofiIsNull(this.item_ool, 'OOL List') == 1 ||
            this.NofiIsNull(this.shop_code, 'shop code') == 1 ||
            this.checkDuplicates(
                this.shop_code.split(' ').filter((e: any) => e != ''),
                'Duplicate shop code '
            ) == 1 ||
            this.NofiIsNull(this.targetType, 'target type') == 1 ||
            this.checkValue(this.target, 'target') == 1 ||
            this.checkTypeTarget(
                this.target,
                this.targetType.id,
                'Please choose a different type of Target or a target greater than 0'
            )
        ) {
            return;
        } else {
            // Helper.ProjectID(), this.year_month.code, this.shop_code, this.product_id, this.orders
            this._service
                .OOL_Target_Action(
                    Helper.ProjectID(),
                    this.year_month.code,
                    this.shop_code,
                    this.item_ool,
                    this.target,
                    this.targetType.id
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page OOL Target',
                            'Update OOL Target',
                            'Update OOL Target SuccessFull',
                            'success',
                            'SuccessFull'
                        );
                        this.loadData(1);
                        this.clearSaveOOL();
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

    clearSaveOOL() {
        this.target = null;
        this.oolDialog = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.listOOLShop.length; i++) {
            if (this.listOOLShop[i].id === id) {
                index = i;
                break;
            }
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
        if (value < -1 || (value != 0 && Helper.IsNull(value) == true)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `Please enter ${name} larger or equal to -1`,
            });
            check = 1;
        }
        return check;
    }

    // Please choose a different type of Target or a target greater than 0

    checkTypeTarget(target: any, type_target: any, name: any): any {
        let check = 0;
        console.log('checkTypeTarget : ', target, type_target, name);

        if (target == 0 && type_target == 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name,
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

    // NofiCheckFile(value: any, name: any): any {
    //   let check = 0;
    //   if (value != 'xlsx') {
    //     this.messageService.add({
    //       severity: 'warn',
    //       summary: 'Warning',
    //       detail: name + ' wrong format',
    //     });
    //     check = 1;
    //     this.clearFileInput()
    //   }
    //   return check;
    // }

    showFiter: any = true;
    showFilter() {
        this.showFiter = !this.showFiter;
    }

    export() {
        if (this.NofiIsNull(this.year_month, 'year month') == 1) {
            return;
        } else {
            this._service.OOL_Target_RawData(
                Helper.ProjectID(),
                Helper.IsNull(this.year_month) != true
                    ? this.year_month.code
                    : 0,
                this.shop_code,
                Helper.IsNull(this.item_ool) != true ? this.item_ool : null,
                Helper.IsNull(this.targetType) != true ? this.targetType.id : 0,
                1000000,
                1
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
        this._service.OOL_Target_GetTemplate(Helper.ProjectID());
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
                .OOL_Target_ImportData(
                    formDataUpload,
                    Helper.ProjectID(),
                    Helper.IsNull(this.year_month) != true
                        ? this.year_month.code
                        : 0
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page OOL Target',
                            'Update OOL Target',
                            'Update OOL Target Successfull',
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
                doc.save('OOLTarget.pdf');
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
            this.saveAsExcelFile(excelBuffer, 'OOLTarget');
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
