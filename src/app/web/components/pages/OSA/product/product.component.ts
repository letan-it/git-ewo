import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { ProductService } from 'src/app/web/service/product.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
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
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
    items_menu: any = [
        { label: ' MASTER' },
        { label: ' Product', icon: 'pi pi-database' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 15;
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
        private _service: ProductService,
        private router: Router,
        private messageService: MessageService,
        private edService: EncryptDecryptService,
        private serviceExport: ExportService
    ) {}

    items: any;
    statuses: any;
    userProfile: any;
    currentUser: any;
    itemsImport: any;

    cols!: Column[];
    exportColumns!: ExportColumn[];
    template_product: any = 'assets/template/template_product_import.xlsx';
    ngOnInit(): void {
        // this.getDataPromotion()
        this.LoadGroupProduct();
        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'product_code', header: 'Product Code' },
            { field: 'product_name', header: 'Product Name' },
            { field: 'category_id', header: 'Category Id' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'order', header: 'Order' },
            { field: 'unit', header: 'Unit' },
            { field: 'size', header: 'Size' },
            { field: 'barcode', header: 'QRCode' },
            { field: 'group_code', header: 'Group Code' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this.check_permissions();
        this.items = [
            {
                label: 'Category',
                icon: 'pi pi-book',
                command: () => {
                    this.viewCategory();
                },
            },
            { separator: true },
            {
                label: 'Group Product',
                icon: 'pi pi-sitemap',
                command: () => {
                    this.viewGroupProduct();
                },
            },
        ];

        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];

        this.itemsImport = [
            {
                label: 'Import Product',
                icon: 'pi pi-upload',
                command: () => {
                    this.ShowHideTemplate(1);
                },
            },
            { separator: true },
            {
                label: 'Close',
                icon: 'pi pi-times',
                command: () => {
                    this.close();
                },
            },
        ];

        let newDate = new Date();
        this.template_product += '?v=' + newDate.toUTCString();
    }
    //#region group product
    group_product_data: any;
    group_product_filter: any;
    LoadGroupProduct() {
        this.group_product_data = [];
        this._service
            .ewo_Product_Group_GetList(Helper.ProjectID(), '', '', 1000000, 1)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.group_product_data = data.data;
                        this.group_product_data.forEach((e: any) => {
                            e.name = e.group_code + ' (' + e.group_name + ')';
                        });
                        console.log('group', this.group_product_data);
                    } else {
                        this.group_product_data = [];
                    }
                }
            });
    }

    catsName: any = [
        { name: 'Category Name EN*' },
        { name: 'Category Name VI*' },
    ];
    selectedCatNameArr: any = null;
    selectedCatName(event: any) {
        this.selectedCatNameArr = event.value === null ? 0 : event.value;
        console.log(this.selectedCatNameArr);
    }
    onClearType() {
        this.selectedCatNameArr = [];
        console.log(this.selectedCatNameArr);
    }

    ProductView: boolean = false;
    itemProduct(newItem: any) {
        if (newItem == true) {
            this.filter(this._pageNumber);
            this.ProductView = true;
        }
    }

    viewCategory() {
        this.router.navigate(['/osa/product/category']);
    }
    viewGroupProduct() {
        this.router.navigate(['/osa/product/group-product']);
    }

    product_code: any = '';
    product_name: any = '';
    barcode: any = '';
    ListProduct: any = [];

    createListProduct() {}
    onRowEditSave(product: any) {}

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }

    onImageErrorImage(event: any, type: string) {
        if (type == 'image') {
            event.image = EnumSystem.imageError;
        }
    }

    item_Category: any = 0;

    selectedCategory(event: any) {
        this.item_Category = event != null ? event.id : 0;
    }

    isLoading_Filter: boolean = false;

    filter(pageNumber: number) {
        let group_code = '';
        if (!Helper.IsNull(this.group_product_filter)) {
            group_code = this.group_product_filter.group_code || '';
        }
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            // this.rows  = 20;
            this._pageNumber = 1;
        }

        this.ListProduct = [];
        this.isLoading_Filter = true;

        this._service
            .ewo_Products_GetListV2(
                Helper.ProjectID(),
                this.product_code,
                this.product_name,
                this.item_Category,
                this.barcode,
                group_code,
                this.rows,
                pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        console.log(data.data);

                        this.ListProduct = data.data;
                        this.ListProduct.forEach((element: any) => {
                            element.show_detail = 0;
                            if (
                                element.category != null &&
                                element.category != undefined
                            ) {
                                element.category = JSON.parse(element.category);
                            }
                        });

                        this.ListProduct = this.ListProduct.map(
                            (element: any) => ({
                                ...element,
                                _status: element.status == 1 ? true : false,
                            })
                        );

                        this.totalRecords = this.ListProduct[0].TotalRows;
                        this.isLoading_Filter = false;
                    } else {
                        this.ListProduct = [];
                        this.isLoading_Filter = false;
                        // this.message = 'No data';
                        // this.display = true;
                    }
                }
            });
    }

    producrtCreate: boolean = false;

    createProduct() {
        this.producrtCreate = true;
    }

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success create product',
        });
        this.filter(1);
        this.producrtCreate = newItem;
    }

    productUpdate: boolean = false;
    Product: any;
    updateProduct(product: any) {
        this.productUpdate = true;
        this.Product = product;
    }

    addItemUpdate(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success update product',
        });
        this.filter(1);
        this.productUpdate = newItem;
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

    // ===================== RAW DATA PRODUTS ===================================//
    export() {
        this.serviceExport.ewo_Products_GetList_Export(
            Helper.ProjectID(),
            this.product_code,
            this.product_name,
            this.item_Category,
            this.barcode,
            this.totalRecords,
            1
        );
    }
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

    getTemplate() {
        this._service.ewo_Products_GetTemplate(Helper.ProjectID());
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
                .ewo_Products_ImportData(formDataUpload, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Product',
                            'Add product',
                            'Add successful products from Import file',
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
                                // detail: 'Please select the correct file to import template file',
                                detail: this.dataMessError,
                            });
                        } else {
                            this.dataError = data.data;
                            console.log('error p', this.dataError);
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
            this.saveAsExcelFile(excelBuffer, 'product');
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
