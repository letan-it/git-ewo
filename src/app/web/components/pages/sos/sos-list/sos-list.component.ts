import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SosService } from '../services/sos.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ProductService } from 'src/app/web/service/product.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';
import { MastersService } from 'src/app/web/service/masters.service';
import { Pf } from 'src/app/_helpers/pf';
import { CategoryService } from 'src/app/web/service/category.service';
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
    selector: 'app-sos-list',
    templateUrl: './sos-list.component.html',
    styleUrls: ['./sos-list.component.scss'],
})
export class SosListComponent {
    constructor(
        private router: Router,
        private _service: SosService,
        private messageService: MessageService,
        private _serviceProduct: ProductService,
        private _serviceMaster: MastersService,
        private _serviceCategory: CategoryService,
        private confirmationService: ConfirmationService
    ) { }
    id = 0;
    isSave = 0;
    titleDialog = '';
    target: number | undefined;

    ListError: any = [];
    listInventoryShop: any = [];

    first: number = 0;
    totalRecords: number = 0;

    messages: Message[] | undefined;
    cols!: Column[];
    exportColumns!: ExportColumn[];
    ngOnInit() {
        this.cols = [
            { field: 'RowNum', header: 'RowNum' },
            {
                field: 'sos_code',
                header: 'Sos Code',
                customExportHeader: 'Sos Code',
            },
            {
                field: 'sos_name',
                header: 'Sos Name',
                customExportHeader: 'Sos Name',
            },
            { field: 'unit', header: 'Unit', customExportHeader: 'Unit' },
            { field: 'order', header: 'Order', customExportHeader: 'Order' },
            { field: 'created_date', header: 'Created Date' },
            { field: 'created_name', header: 'Created By' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this.loadSelect();
        this.loadData(1);
        this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
    }

    loadSelect() {
        this.loadTypes();
        this.loadProducts();
        this.loadCategory();
    }
    listSOS: any = [];
    sosCode: any = '';
    sosName: any = '';
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }
    menu_id = 97;
    is_LoadForm: number = 0;
    isLoadForm = 1;
    items_menu: any = [
        { label: 'SOS ' },
        { label: ' List', icon: 'pi pi-list' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    check_permissions() {
        if (JSON.parse(localStorage.getItem('menu') + '') != null) {
            const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
                (item: any) => item.menu_id == this.menu_id && item.check == 1
            );
            if (menu.length > 0) {
            } else {
                this.router.navigate(['/empty']);
            }
        }
    }
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
    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }
    dateStart: any | undefined;
    dateEnd: any | undefined;
    activeDatesInt: any = [];
    activeDateInt: any | undefined;
    editActiveDate: any | undefined;
    selectedActiveDate(e: any) {
        this.activeDateInt = e.value;
    }
    clearActiveDate() {
        this.activeDateInt = '';
    }

    // #region action

    newListSOSDialog: boolean = false;
    editListSOSDialog: boolean = false;

    sosIdInput: any = null;
    sosCodeInput: any = null;
    sosNameInput: any = null;
    companyInput: any = null;
    widthInput: any = null;
    orderInput: any = null;

    resetNewListSOSDialog() {
        this.newListSOSDialog = false;
        this.resetAllInput();
    }
    openAddForm() {
        this.newListSOSDialog = true;
        this.isSave = 0;
        this.titleDialog = 'Create';
        this.editMode = false;
    }

    resetAllInput() {
        this.sosIdInput = null;
        this.sosCodeInput = null;
        this.sosNameInput = null;
        this.companyInput = null;
        this.widthInput = null;
        this.orderInput = null;

        this.typeInput = null;
        this.listType = [];
        this.productInput = null;
        this.listProduct = [];
        this.catetoryInput = null;
        this.listCategory = [];

        this.loadTypes();
        this.loadCategory();
        this.loadProducts();
    }
    //#region save
    saveNewListSOS(event: Event) {
        let check = true;
        if (this.typeInput == 'SOSITEM') {
            if (this.sosCodeInput == '') {
                this.confirmationService.confirm({
                    target: event.target as EventTarget,
                    message: 'Please enter sos Code!',
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    rejectButtonStyleClass: 'p-button-text',
                    accept: () => {
                        // document.getElementById('sosCodeInput')?.focus();
                        close();
                    },
                    reject: () => {
                        close();
                    },
                });
                check = false;
            }
            if (this.sosCodeInput == '') {
                this.confirmationService.confirm({
                    target: event.target as EventTarget,
                    message: 'Please enter sos Name!',
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    rejectButtonStyleClass: 'p-button-text',
                    accept: () => {
                        // document.getElementById('sosNameInput')?.focus();
                        close();
                    },
                    reject: () => {
                        close();
                    },
                });
                check = false;
            }
        } else if (this.typeInput == 'PRODUCT') {
            if (this.productInput == 0) {
                this.confirmationService.confirm({
                    target: event.target as EventTarget,
                    message: 'Please select product!',
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    rejectButtonStyleClass: 'p-button-text',
                    accept: () => {
                        document.getElementById('productSelect')?.focus();
                        close();
                    },
                    reject: () => {
                        close();
                    },
                });

                check = false;
            }
        } else if (this.typeInput == 'CATEGORY') {
            if (this.catetoryInput < 1) {
                this.confirmationService.confirm({
                    target: event.target as EventTarget,
                    message: 'Please select Category!',
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    rejectButtonStyleClass: 'p-button-text',
                    accept: () => {
                        document.getElementById('categorySelect')?.focus();
                        close();
                    },
                    reject: () => {
                        close();
                    },
                });
                check = false;
            }
        } else {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please complete all information!',
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
        if (this.inputUnit == '') {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please select unit!',
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
                .Web_SOSList_Action(
                    Helper.ProjectID(),
                    this.id,
                    this.typeInput,
                    this.catetoryInput,
                    this.productInput,
                    this.sosCodeInput,
                    this.sosNameInput,
                    this.companyInput,
                    this.widthInput,
                    this.inputUnit,
                    this.orderInput,
                    action
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.newListSOSDialog = false;
                        this.loadData(1);

                        // clear value
                        this.resetAllInput();

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Add new S0S List successfully',
                            detail: '',
                        });
                    } else {
                        this.newListSOSDialog = false;
                        this.messageService.add({
                            severity: 'danger',
                            summary: 'Error',
                            detail: '',
                        });
                    }
                });
        }
    }
    //#region update
    editMode = false;
    openEditForm(
        ID: any,
        type: '',
        categoryId: 0,
        productId: 0,
        sosCode: '',
        sosName: '',
        company: '',
        width: 0,
        unit: '',
        order: 0
    ) {
        this.editMode = true;
        this.isSave = 1;
        this.titleDialog = 'Update';
        this.newListSOSDialog = true;

        this.id = ID;
        //Load type select
        this.typeInput = type;
        this.loadTypes(type);
        //load category
        if (categoryId > 0) {
            this.catetoryInput = categoryId;
            this.itemCategory = categoryId;
            this.loadCategory();
        }
        //load product
        if (productId > 0) {
            this.productInput = productId;
            this.itemProduct = productId;
            this.loadProducts();
        }
        this.sosCodeInput = sosCode;
        this.sosNameInput = sosName;
        this.companyInput = company;
        this.widthInput = width;
        this.inputUnit = unit;
        if (this.inputUnit == 'm') {
            this.chooseM();
        } else if (this.inputUnit == 'mm') {
            this.chooseMM();
        } else if (this.inputUnit == 'cm') {
            this.chooseCM();
        }
        this.orderInput = order;
    }
    //#region delete
    openDelete(
        project_id: 0,
        ID: any,
        type: string,
        categoryId: 0,
        productId: 0,
        sosCode: string,
        sosName: string,
        company: string,
        width: 0,
        unit: string,
        order: 0,
        event: Event
    ) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .Web_SOSList_Action(
                        project_id,
                        ID,
                        type,
                        categoryId,
                        productId,
                        sosCode,
                        sosName,
                        company,
                        width,
                        unit,
                        order,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.loadData(1);

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Delete SOS List successfully',
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
    //  #region  Year Month To
    listMonthTo: any = null;
    listMonthsTo: any = [];

    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }

    isLoading_Filter: any = false;

    loadData(pageNumber: number) {
        this.is_LoadForm = 1;
        this.first = 0;
        this.totalRecords = 0;
        this.isLoading_Filter = true;

        if (this.listCategorys != null && this.listCategorys.length > 0) {
            this.categoryId = '';
            this.listCategorys.forEach((e: any) => {
                if (this.categoryId == '') {
                    this.categoryId += e.id;
                } else {
                    this.categoryId += ' ' + e.id;
                }
            });
        }
        if (this.listTypes != null && this.listTypes.length > 0) {
            this.typeId = '';
            this.listTypes.forEach((e: any) => {
                if (this.typeId == '') {
                    this.typeId += e.item_code;
                } else {
                    this.typeId += ' ' + e.item_code;
                }
            });
        }
        if (this.listProducts != null && this.listProducts.length > 0) {
            this.productId = '';
            this.listProducts.forEach((e: any) => {
                if (this.productId == '') {
                    this.productId += e.id;
                } else {
                    this.productId += ' ' + e.id;
                }
            });
        }
        this._service
            .Web_SOSList_GetList(
                Helper.ProjectID(),
                this.typeId,
                this.categoryId,
                this.productId,
                this.sosCode,
                this.sosName,
                this.rows,
                pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listSOS = data.data;
                    this.totalRecords =
                        Helper.IsNull(this.listSOS) != true
                            ? this.listSOS[0].TotalRows
                            : 0;
                    this.isLoading_Filter = false;
                } else {
                    this.listSOS = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    // #region porduct filter
    @Input() itemProduct!: number;
    productId: any = '';
    listProduct: any;
    listProducts: any = [];

    clearFilterType() { }

    productInput: any = 0;

    selectedListProduct(e: any) {
        this.productInput = e.value === null ? 0 : e.value.id;
        if (this.typeInput == 'PRODUCT') {
            this.sosCodeInput = e.value != null ? e.value.item_code : '';
            this.sosNameInput = e.value != null ? e.value.item_name : '';
        }
    }

    selectedProduct: any;
    loadProducts(categoryId?: any) {
        if (!categoryId) categoryId = 0;
        this._serviceProduct
            .ewo_Products_GetList(
                Helper.ProjectID(),
                '',
                '',
                categoryId,
                '',
                100000,
                1
            )
            .subscribe((data: any) => {
                this.isLoadForm = 0;
                this.listProduct = [];

                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        this.listProduct.push({
                            name: `[${element.product_id}] - ${element.product_code} - ${element.product_name}`,
                            id: element.product_id,
                            product_code: element.product_code,
                            item_code: element.product_code,
                            item_name: element.product_name,
                        });
                    });
                }

                if (this.itemProduct > 0) {
                    this.selectedProduct = this.listProduct.filter(
                        (item: any) => item.id == this.itemProduct
                    )[0];
                } else {
                    this.selectedProduct = '';
                }
            });
    }
    onClearProduct() {
        this.listProducts = [];
        this.productId = '';
    }
    //#end region
    // #region types filter
    @Input() itemType!: number;
    typeId: any = '';
    listType: any;
    listTypes: any = [];

    typeInput: any = null;

    selectedListType(e: any) {
        console.log(e);
        this.typeInput = e.value === null ? 0 : e.value.item_code;
    }

    selectedType: any;
    loadTypes(typeLoad?: any) {
        this._serviceMaster
            .ewo_Masters_GetList(
                Helper.ProjectID(),
                'sos_type',
                'SOSList',
                '',
                1
            )
            .subscribe((data: any) => {
                this.isLoadForm = 0;
                this.listType = [];

                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        this.listType.push({
                            name: `[${element.Id}] - ${element.Code} - ${element.NameVN}`,
                            id: element.Id,
                            item_code: element.Code,
                            item_name: element.NameVN,
                            item_image: element.image || '',
                        });
                    });
                }

                if (this.itemType > 0) {
                    this.selectedType = this.listType.filter(
                        (item: any) => item.id == this.itemType
                    )[0];
                } else {
                    this.selectedType = '';
                }

                if (typeLoad) {
                    this.selectedType = this.listType.filter(
                        (item: any) => item.item_code == typeLoad
                    )[0];
                } else {
                    this.selectedType = '';
                }
            });
    }
    onClearType() {
        this.typeId = '';
        this.listTypes = [];
    }
    //#end region
    //#region category filter
    @Input() itemCategory!: number;

    listCategory: any;
    listCategorys: any = [];
    categoryId = '';

    catetoryInput: any = 0;

    selectedListCategory(e: any) {
        this.catetoryInput = e.value === null ? 0 : e.value.item_code;
        if (this.typeInput == 'CATEGORY') {
            this.sosNameInput = e.value != null ? e.value.item_name : '';
        }

        this.loadProducts(this.catetoryInput);
    }

    selectedCategory: any;
    loadCategory() {
        this._serviceCategory
            .Get_Categories(Helper.ProjectID(), '', '', '', '', '', '', '')
            .subscribe((data: any) => {
                this.isLoadForm = 0;
                this.listCategory = [];
                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        this.listCategory.push({
                            name:
                                '[' +
                                element.category_id +
                                '] - ' +
                                element.category_name +
                                ' - ' +
                                element.category_name_vi,
                            id: element.category_id,
                            item_code: element.category_id,
                            item_name: element.category_name_vi,
                        });
                    });
                }

                if (this.itemCategory > 0) {
                    this.selectedCategory = this.listCategory.filter(
                        (item: any) => item.id == this.itemCategory
                    )[0];
                } else {
                    this.selectedCategory = '';
                }
            });
    }
    onClearCategory() {
        this.categoryId = '';
        this.listCategorys = [];
    }
    //#end region
    inputUnit: any = null;
    editInputUnit: any;
    showInputUnit: any;
    showEditInputUnit: any;
    chooseMM() {
        this.inputUnit = 'mm';
        this.editInputUnit = 'mm';
        this.showInputUnit = 'mm-Millimeter';
    }
    chooseCM() {
        this.inputUnit = 'cm';
        this.editInputUnit = 'cm';
        this.showInputUnit = 'cm-Centimeter';
    }
    chooseM() {
        this.inputUnit = 'm';
        this.editInputUnit = 'm';
        this.showInputUnit = 'm-Meter';
    }
    checkVNAccent(value: any) {
        var format = /^[^\u00C0-\u1EF9]+$/i;
        return format.test(value);
    }
    checkSpace(value: any) {
        var format = /\s+/;
        return format.test(value);
    }
    onChangeInputSosCode(event: any) {
        if (this.checkSpace(event) == true) {
            this.messageService.add({
                severity: 'warn',
                summary:
                    'Please remove the first space in the List Code inputs!',
            });
        } else if (this.checkVNAccent(event) == false) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please do not type accented Vietnamese',
            });
        }
        // else if (this.checkSpace(event) == false && this.checkVNAccent(event) == true) {
        //     this.checkedSpaceListCode = true;
        // }
    }
    //#region get template
    getTemplate() {
        this._service.SOS_List_GetTemplate(Helper.ProjectID());
    }
    //#region export
    export() {
        if (this.listCategorys != null && this.listCategorys.length > 0) {
            this.listCategorys.forEach((e: any) => {
                if (this.categoryId == '') {
                    this.categoryId += e.id;
                } else {
                    this.categoryId += ' ' + e.id;
                }
            });
        }
        if (this.listTypes != null && this.listTypes.length > 0) {
            this.listTypes.forEach((e: any) => {
                if (this.typeId == '') {
                    this.typeId += e.item_code;
                } else {
                    this.typeId += ' ' + e.item_code;
                }
            });
        }
        if (this.listProducts != null && this.listProducts.length > 0) {
            this.listProducts.forEach((e: any) => {
                if (this.productId == '') {
                    this.productId += e.id;
                } else {
                    this.productId += ' ' + e.id;
                }
            });
        }
        this._service.SOS_List_RawData(
            Helper.ProjectID(),
            this.typeId,
            this.categoryId,
            this.productId,
            this.sosCode,
            this.sosName,
            100000000,
            1
        );
    }
    //#region import data
    showImport: number = 0;
    showImportDialog() {
        this.showImport = 1;
    }

    dataError: any;
    dataMessError: any;
    fileTemplate!: any;
    onChangeFile(event: any) {
        this.dataError = undefined;
        this.dataMessError = undefined;
        this.fileTemplate = event.target.files[0];
    }
    @ViewChild('myInput') myInput: any;
    clearFileInput() {
        this.dataError = undefined;
        this.dataMessError = undefined;
        this.myInput.nativeElement.value = null;
        this.fileTemplate = undefined;
    }
    import() {
        if (this.fileTemplate == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a file',
            });

            return;
        }
        const formDataUpload = new FormData();
        formDataUpload.append('files', this.fileTemplate);

        this._service
            .SOS_List_ImportData(formDataUpload, Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.result_ewo_type_SOSShop.length > 0) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Successful SOS registration',
                        });

                        this.clearFileInput();
                        this.loadData(1);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error SOS registration',
                        });
                    }
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
            this.saveAsExcelFile(excelBuffer, 'sos_list');
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
