import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    SimpleChanges,
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { ProductService } from 'src/app/web/service/product.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
    providers: [ConfirmationService],
})
export class ProductDetailsComponent {
    @Input() inValue: any;
    @Input() action: any = 'view';
    @Output() newItemEventProduct = new EventEmitter<boolean>();
    @Output() newItemEvent = new EventEmitter<boolean>();
    @Output() newItemEventUpdate = new EventEmitter<boolean>();

    constructor(
        private _service: ProductService,
        private taskService: TaskFileService,
        private _file: FileService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService
    ) {}
    cols!: any[];
    setupTable() {
        this.cols = [
            { field: 'product_barcode', header: 'Bar Code' },
            { field: 'created_date', header: 'Created Date' },
        ];
    }
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['inValue'] || changes['action']) {
            if (this.inValue) {
                try {
                    this.item_Category = this.inValue.category_id;
                    this.image = this.inValue.image;
                    this.LoadGroupProduct();
                } catch (error) {}
                try {
                    this.getItemProductBarCode();
                } catch (error) {}
            }
        }
    }

    getItemProductBarCode() {
        if (this.inValue.product_id > 0)
            this._service
                .ProductBarCode_getbyitem(
                    Helper.ProjectID(),
                    this.inValue.product_id
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        data.data = data.data.map((bc: any) => ({
                            ...bc,
                            toolTip: `Created By : [${bc.created_by}] - ${bc.created_code} - ${bc.created_name}`,
                        }));
                        this.inValue.barcode_list = data.data;
                    }
                });
    }

    productBarcodeDialog: boolean = false;
    actionBarCode: any = 'remove';
    product_barcode: any = null;

    showModel() {
        this.actionBarCode = 'create';
        this.productBarcodeDialog = true;
    }

    /*
     NofiIsNull ( ko dc bỏ trống )
NofiAccentedCharacters (ko có dấu )
NofiEmptyCharacters ( Ko có khoảng trống )
NofiSpecialCharacters ( kí tự đặc biệt )
    */
    actionProductBarcode(rowData: any) {
        if (
            this.actionBarCode == 'create' &&
            (this.NofiIsNull(this.product_barcode, 'product barcode') == 1 ||
                this.NofiAccentedCharacters(
                    this.product_barcode,
                    'Product barcode'
                ) == 1 ||
                this.NofiEmptyCharacters(
                    this.product_barcode,
                    'Product barcode'
                ) == 1)
            // || this.NofiEmptyCharacters(this.product_barcode, 'Product barcode') == 1
        ) {
            return;
        } else {
            this._service
                .product_barcode_Action(
                    Helper.ProjectID(),
                    this.actionBarCode == 'create'
                        ? this.inValue.product_id
                        : rowData.product_id,
                    this.actionBarCode == 'create'
                        ? this.product_barcode
                        : rowData.product_barcode,
                    this.actionBarCode
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Product',
                            `${
                                this.actionBarCode == 'create'
                                    ? 'Add'
                                    : 'Remove'
                            } product barcode`,
                            `${
                                this.actionBarCode == 'create'
                                    ? 'Add'
                                    : 'Remove'
                            } successful product barcode`,
                            'success',
                            'Successfull'
                        );
                    }
                    this.clearActionBarCode();
                });
        }
    }

    clearActionBarCode() {
        this.actionBarCode = 'remove';
        this.product_barcode = null;
        this.productBarcodeDialog = false;
        this.getItemProductBarCode();
    }

    confirm1(event: Event, rowData: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.actionProductBarcode(rowData);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    public myAngularxQrCode: string = '';
    public qrCodeDownloadLink: SafeUrl = '';
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
        console.log(this.project);
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.myAngularxQrCode = 'Your QR code data string';
        this.setupTable();
    }
    onChangeURL(url: SafeUrl) {
        console.log(
            '🚀 ~ file: product-details.component.ts:65 ~ ProductDetailsComponent ~ onChangeURL ~ url:',
            url
        );
        this.qrCodeDownloadLink = url;
    }

    onImageErrorImage(event: any, type: string) {
        if (type == 'image') {
            this.image = EnumSystem.imageError;
        }
    }

    addNewItem() {
        this.newItemEvent.emit(false);
    }
    addItemUpdate() {
        this.newItemEventUpdate.emit(false);
    }

    item_Category: any = 0;
    selectedCategory(event: any) {
        this.item_Category = event != null ? event.id : 0;
    }

    product_code: string = '';
    product_name: string = '';
    category_id: number = 0;
    image: any = null;
    price: any = null;
    order: any = null;
    unit: any = null;
    size: any = null;
    _status: boolean = false;
    barcode: any = null;

    @ViewChild('myInputImage') myInputImage: any;

    clearFileInput() {
        this.myInputImage.nativeElement.value = null;
    }

    clear() {
        this.product_code = '';
        this.product_name = '';
        this.item_Category = 0;
        this.image = null;
        this.price = null;
        this.order = null;
        this.unit = null;
        this.size = null;
        this._status = false;
        this.barcode = null;
        this.clearFileInput();
    }
    loadForm() {
        this.clear();
        this.display = false;
    }

    imageFile!: any;
    onChangeImage(event: any, code: any) {
        this.imageFile = event.target.files[0];
        console.log(
            '🚀 ~ ProductDetailsComponent ~ onChangeImage ~ this.imageFile:',
            this.imageFile
        );

        if (
            this.imageFile == undefined ||
            this.NofiImage(
                this.imageFile.name.split('.').pop(),
                'File image'
            ) == 1
        ) {
            this.image = null;
            this.inValue.image = null;
            return;
        } else {
            this.taskService
                .ImageRender(this.imageFile, this.imageFile.name)
                .then((file) => {
                    this.imageFile = file;
                });

            const formUploadImage = new FormData();
            formUploadImage.append('files', this.imageFile);
            formUploadImage.append('ImageType', code);
            formUploadImage.append('WriteLabel', code);

            // this._file.UploadImage(formUploadImage).subscribe((data: any) => {
            //     if (data.result == EnumStatus.ok) {
            //         this.image = EnumSystem.fileLocal + data.data;
            //         this.inValue.image = EnumSystem.fileLocal + data.data;
            //     }
            // });

            const fileName = AppComponent.generateGuid();
            const newFile = new File(
                [this.imageFile],
                fileName +
                    this.imageFile.name.substring(
                        this.imageFile.name.lastIndexOf('.')
                    ),
                { type: this.imageFile.type }
            );
            const modun = 'PRODUCT-IMAGE';
            const drawText = code;
            this._file
                .FileUpload(
                    newFile,
                    this.project?.project_code,
                    modun,
                    drawText
                )
                .subscribe(
                    (response: any) => {
                        this.image = response.url;
                        this.inValue.image = response.url;
                    },
                    (error: any) => {
                        this.image = null;
                        this.inValue.image = null;
                    }
                );
        }
    }

    listProduct: any;

    createProduct() {
        let group_code = '';
        if (Helper.IsNull(this.image) == true) {
            this.image = EnumSystem.noImage;
        }
        if (Helper.IsNull(this.price) == true) {
            this.price = null;
        }
        if (Helper.IsNull(this.order) == true) {
            this.order = null;
        }
        if (Helper.IsNull(this.size) == true) {
            this.size = null;
        }
        if (Helper.IsNull(this.group_product_selected) == true) {
            this.group_product_selected = null;
        } else {
            group_code = this.group_product_selected.group_code || '';
        }
        if (
            this.NofiIsNullCode(this.product_code, 'product code') == 1 ||
            this.NofiEmptyCharacters(this.product_code, 'Product code') == 1 ||
            this.NofiAccentedCharacters(this.product_code, 'Product code') ==
                1 ||
            this.NofiSpecialCharacters(this.product_code, 'Product code') ==
                1 ||
            this.NofiLengthCode(this.product_code, 'Product code') == 1 ||
            this.NofiIsNull(this.product_name, 'product name') == 1 ||
            this.NofiIsNull(this.item_Category, 'category') == 1 ||
            this.NofiIsNull(this.image, 'image') == 1 ||
            // this.NofiIsNull(
            //     this.group_product_selected,
            //     'group_product_selected'
            // ) == 1 ||
            this.NofiIsNullBarCode(this.barcode, 'Barcode') == 1
        ) {
            return;
        } else {
            this._service
                .ewo_Products_GetList(
                    Helper.ProjectID(),
                    '',
                    '',
                    0,
                    '',
                    100000,
                    1
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.listProduct = data.data;

                        try {
                            const productList = this.listProduct.filter(
                                (x: any) =>
                                    x.product_code.toUpperCase() ==
                                    this.product_code.toUpperCase()
                            );

                            if (productList.length > 0) {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Warning',
                                    detail: 'Product code already exist',
                                });

                                return;
                            } else {
                                this._service
                                    .Products_Action(
                                        Helper.ProjectID(),
                                        0,
                                        this.product_code,
                                        this.product_name,
                                        this.item_Category,

                                        this.image,
                                        this.price,
                                        this.order,
                                        this.unit,
                                        this.size,
                                        this._status == true ? 1 : 0,
                                        this.barcode,
                                        group_code,
                                        'create'
                                    )
                                    .subscribe((data: any) => {
                                        if (data.result == EnumStatus.ok) {
                                            if (data.data) {
                                                AppComponent.pushMsg(
                                                    'Page Product',
                                                    'Create Product',
                                                    'Create product successfull',
                                                    EnumStatus.info,
                                                    0
                                                );
                                                this.clear();
                                                this.addNewItem();
                                                return;
                                            }
                                        }
                                    });
                            }
                        } catch (error) {}
                    }
                });
        }
    }

    updateProduct() {
        let group_code = '';
        if (Helper.IsNull(this.group_product_selected) == true) {
            this.group_product_selected = null;
        } else {
            group_code = this.group_product_selected.group_code || '';
        }
        if (Helper.IsNull(this.image) == true) {
            this.image = EnumSystem.noImage;
        }
        if (Helper.IsNull(this.inValue.price) == true) {
            this.inValue.price = null;
        }
        if (Helper.IsNull(this.inValue.order) == true) {
            this.inValue.order = null;
        }
        if (Helper.IsNull(this.inValue.size) == true) {
            this.inValue.size = null;
        }
        if (
            this.NofiIsNull(this.inValue.product_name, 'product name') == 1 ||
            this.NofiIsNull(this.item_Category, 'category') == 1 ||
            // this.NofiIsNull(
            //     this.group_product_selected,
            //     'group_product_selected'
            // ) == 1 ||
            this.NofiIsNullBarCode(this.inValue.barcode, 'Barcode') == 1
        ) {
            return;
        } else {
            this._service
                .Products_Action(
                    this.inValue.project_id,
                    this.inValue.product_id,
                    this.inValue.product_code,
                    this.inValue.product_name,
                    this.item_Category,
                    this.image,
                    this.inValue.price,
                    this.inValue.order,
                    this.inValue.unit,
                    this.inValue.size,
                    this.inValue._status == true ? 1 : 0,
                    this.inValue.barcode == null ? null : this.inValue.barcode,
                    group_code,
                    'update'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            AppComponent.pushMsg(
                                'Page Product',
                                'Update Product',
                                `Update product ${this.inValue.product_code}-${this.inValue.product_name} successfull`,
                                EnumStatus.info,
                                0
                            );
                            this.clearFileInput();
                            this.addItemUpdate();
                            return;
                        }
                    }
                });
        }
    }

    // Name
    NofiIsNull(value: any, name: any): any {
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }

    NofiIsNullCode(value: any, name: any): any {
        if (Helper.IsNull(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }
    // Shop code is not allowed to enter accented characters
    NofiAccentedCharacters(value: any, name: any): any {
        if (Pf.checkUnsignedCode(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' is not allowed to enter accented characters',
            });
            return 1;
        }
        return 0;
    }

    // Shop code must not contain empty characters
    NofiEmptyCharacters(value: any, name: any): any {
        if (Pf.checkSpaceCode(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' must not contain empty characters',
            });
            return 1;
        }
        return 0;
    }

    // Product codes cannot contain special characters
    NofiSpecialCharacters(value: any, name: any): any {
        if (Pf.CheckAccentedCharacters(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' cannot contain special characters',
            });
            return 1;
        }
        return 0;
    }

    // Product codes cannot contain special characters
    NofiLengthCode(value: any, name: any): any {
        if (Pf.CheckCode(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' must be greater than or equal to 8 characters',
            });

            return 1;
        }
        return 0;
    }

    NofiIsNullBarCode(value: any, name: any): any {
        if (Helper.IsNull(value) != true) {
            if (
                Pf.checkSpaceCode(value) == true ||
                Pf.checkUnsignedCode(value) == true
            ) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: name + ' wrong format',
                });
                return 1;
            }
        }
        return 0;
    }

    NofiIsNullProductBarCode(value: any, name: any): any {
        if (Helper.IsNull(value) == true || Pf.checkSpaceCode(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }

    NofiCheckProductBarCode(value: any, name: any): any {
        if (Pf.checkUnsignedCode(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
    }

    // Price
    checkNumber(value: any, name: any): any {
        if (Helper.number(value) != true && Helper.IsNull(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
    }

    NofiImage(value: any, name: any): any {
        let check = 0;
        if (value != 'png' && value != 'jpg' && value != 'jpeg') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
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

    display = false;
    showDialog() {
        this.display = true;
    }
    //#region group product
    group_product_data: any;
    group_product_selected: any;
    LoadSelectGroup(code: string) {
        if (!Helper.IsNull(code) && code != '') {
            this.group_product_selected = this.group_product_data.find(
                (e: any) => {
                    return e.group_code === code.trim(); // Using strict equality and trimming code
                }
            );
        }
    }
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
                        if (this.action == 'update') {
                            if (this.inValue && this.inValue.group_code != '') {
                                this.LoadSelectGroup(this.inValue.group_code);
                            }
                        }
                    } else {
                        this.group_product_data = [];
                    }
                }
            });
    }
}
