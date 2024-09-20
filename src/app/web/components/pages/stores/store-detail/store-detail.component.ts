import { DatePipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import {
    ConfirmEventType,
    ConfirmationService,
    Message,
    MessageService,
} from 'primeng/api';
import { ShopsService } from 'src/app/web/service/shops.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Pf } from 'src/app/_helpers/pf';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { FileService } from 'src/app/web/service/file.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
    selector: 'app-store-detail',
    templateUrl: './store-detail.component.html',
    styleUrls: ['./store-detail.component.scss'],
    providers: [ConfirmationService, DatePipe],
})
export class StoreDetailComponent implements OnInit {
    constructor(
        private messageService: MessageService,
        private shopService: ShopsService,
        private datePipe: DatePipe,
        private router: Router,
        private taskService: TaskFileService,
        private _file: FileService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService
    ) { }
    getStatusReport(status: string) {
        try {
            switch (status.toLocaleLowerCase()) {
                case 'thành công':
                    return 'success';
                case 'không thành công':
                    return 'danger';
            }
            return '';
        } catch (error) {
            return '';
        }
    }
    employeeShopDialog: boolean = false;
    ListEmployeeShop: any = [];
    EmployeeShop: any;
    selectedEmployeeShops: any;
    submitted: boolean = false;
    statuses: any = [];

    isActives: any;
    FromDate: any;
    ToDate: any = null;

    project_id: any;
    project:any 
    projectName () {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }

    ngOnInit(): void {
        this. projectName ();
        this.loadUser();
        this.isActives = [
            { label: 'Status', value: 1 },
            { label: 'Not Status', value: 0 },
        ];
        let newDate = new Date();
        this.FromDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.ToDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' },
        ];

        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
        this.project_id = Helper.ProjectID();

    }
    @Input() inValue: any;
    @Input() action: any = 'view';
    @Output() newItemEvent = new EventEmitter<boolean>();
    @Output() newEventCreate = new EventEmitter<boolean>();
    @Output() newEventInfo = new EventEmitter<boolean>();

    status: string[] = [];
    checkIsTest: boolean = true;

    shop_code: string = '';
    project_shop_code: string = '';
    shop_name: string = '';
    customer_shop_code: string = '';
    customer_shop_name: string = '';
    shop_address: string = '';
    created_from: string = '';
    latitude!: number;

    longitude!: number;
    contact_name: string = '';
    contact_mobile: string = '';

    image!: string;
    image_logo!: string;

    image_File!: any;
    image_logo_File!: any;
    sign_name: any = ''
    tax_code: any = ''
    ShopInfoCreate: boolean = false;

    selectMonth: any;
    ListMonth: any = [];
    PlanDate: any;
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

        const monthString = monthToday.toString().padStart(2, '0')
        const currentDate = parseInt(year + monthString)
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find((i: any) => (i?.code == currentDate))
        }

        // this.month = year + monthString;

        // for (let month = 1; month <= monthNow; month++) {
        //     const monthString = month.toString().padStart(2, '0');
        //     const yearMonth = `${year} - Tháng ${monthString}`;
        //     this.ListMonth.push({
        //         name: yearMonth,
        //         code: `${year}${monthString}`,
        //     });
        //     if (month == monthNow - 1) {
        //         this.selectMonth = {
        //             name: yearMonth,
        //             code: `${year}${monthString}`,
        //         };
        //     }
        // }
    }

    // onChangeImage(event: any) {
    //     this.image_File = event.target.files[0];

    //     this.taskService
    //         .ImageRender(this.image_File, this.image_File.name)
    //         .then((file) => {
    //             this.image_File = file;
    //         });
    //     this.loadImage();
    // }

    onChangeImage(event: any, action: any) {
        this.image_File = event.target.files[0];

        if (this.NofiImage(this.image_File.name.split('.').pop(), 'Image') == 1) {
            return;
        } else {
            this.taskService
                .ImageRender(this.image_File, this.image_File.name)
                .then((file) => {
                    this.image_File = file;
                });
            this.loadImage(action);
        }
    }

    onChangeImageLogo(event: any, action: any) {
        this.image_logo_File = event.target.files[0];


        if (this.NofiImage(this.image_logo_File.name.split('.').pop(), 'Image logo') == 1) {
            return;
        } else {

            this.taskService
                .ImageRender(this.image_logo_File, this.image_logo_File.name)
                .then((file) => {
                    this.image_logo_File = file;
                });
            this.loadImageAfter(action);
        }
    }

    loadImage(action: any) {
        if (this.image_File == undefined) {
            this.image = '';
        } else {
            const formUploadImageBefore = new FormData();
            formUploadImageBefore.append('files', this.image_File);
            let modun = '';
            let drawText = ''; 
            try {
                if (action == 'edit') {
                    formUploadImageBefore.append(
                        'ImageType',
                        'ImageTypeShop' + this.inValue.shop_code
                    );
                    formUploadImageBefore.append(
                        'WriteLabel',
                        'ImageShop' + this.inValue.shop_code
                    );
                    modun = 'ImageTypeShop' + this.inValue.shop_code;
                    drawText = 'ImageShop' + this.inValue.shop_code;
                } else if (action == 'create') {
                    formUploadImageBefore.append(
                        'ImageType',
                        'ImageTypeShop' + this.shop_code
                    );
                    formUploadImageBefore.append(
                        'WriteLabel',
                        'ImageShop' + this.shop_code
                    );
                    modun = 'ImageTypeShop' + this.shop_code;
                    drawText = 'ImageShop' + this.shop_code;
                } else {
                    formUploadImageBefore.append(
                        'ImageType',
                        'ImageTypeShop' + this.image_File.name
                    );
                    formUploadImageBefore.append(
                        'WriteLabel',
                        'ImageShop' + this.image_File.name
                    );
                    modun = 'ImageTypeShop' + this.image_File.name;
                    drawText = 'ImageShop' + this.image_File.name;
                }
            } catch (error) { }

            // this._file
            //     .UploadImage(formUploadImageBefore)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image = EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.image = '';
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_File], fileName+this.image_File.name.substring(this.image_File.name.lastIndexOf('.')),{type: this.image_File.type});
                // const modun = 'EMPLOYEE-FACE-RIGHT';
                // const drawText = this.userProfile.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.image = response.url;   
                    },
                    (error : any) => { 
                        this.image = '';
                    }
                );
        }
    }


    loadImageAfter(action: any) {
        if (this.image_logo_File == undefined) {
            this.image_logo = '';
        } else {
            const formUploadImageAfter = new FormData();
            formUploadImageAfter.append('files', this.image_logo_File);
            let modun = '';
            let drawText = ''; 
            try {
                if (action == 'edit') {
                    formUploadImageAfter.append(
                        'ImageType',
                        'ImageTypeShop' + this.inValue.shop_code
                    );
                    formUploadImageAfter.append(
                        'WriteLabel',
                        'ImageShop' + this.inValue.shop_code
                    );
                    modun = 'ImageTypeShop' + this.inValue.shop_code;
                    drawText = 'ImageShop' + this.inValue.shop_code;
                } else if (action == 'create') {
                    formUploadImageAfter.append(
                        'ImageType',
                        'ImageTypeShop' + this.shop_code
                    );
                    formUploadImageAfter.append(
                        'WriteLabel',
                        'ImageShop' + this.shop_code
                    );
                    modun = 'ImageTypeShop' + this.shop_code;
                    drawText = 'ImageShop' + this.shop_code;
                } else {
                    formUploadImageAfter.append(
                        'ImageType',
                        'ImageTypeShop' + this.image_logo_File.name
                    );
                    formUploadImageAfter.append(
                        'WriteLabel',
                        'ImageShop' + this.image_logo_File.name
                    );
                    modun = 'ImageTypeShop' + this.image_logo_File.name;
                    drawText = 'ImageShop' + this.image_logo_File.name;
                }
            } catch (error) { }

            // this._file
            //     .UploadImage(formUploadImageAfter)
            //     .subscribe((data: any) => {
            //         if (data.result == EnumStatus.ok) {
            //             this.image_logo = EnumSystem.fileLocal + data.data;
            //         } else {
            //             this.image_logo = '';
            //         }
            //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.image_logo_File], fileName+this.image_logo_File.name.substring(this.image_logo_File.name.lastIndexOf('.')),{type: this.image_logo_File.type});
                // const modun = 'EMPLOYEE-FACE-RIGHT';
                // const drawText = this.userProfile.employee_code;
                this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                    (response : any) => {   
                        this.image_logo = response.url;   
                    },
                    (error : any) => { 
                        this.image_logo = '';
                    }
                );
        }
    }

    transform(value: any) {
        const year = value.slice(0, 4);
        const month = value.slice(4);
        return `${year} - Tháng ${month}`;
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.

        if (changes['inValue'] || changes['action']) {
            try {
                if (this.inValue.hide == 1) {
                    this.inValue.status == 1 ? (this.status = ['1']) : [];
                }

                this.item_ShopType = this.inValue.shop_type_id;
                this.item_channel = this.inValue.channel_id;
                this.item_ShopRouter = this.inValue.router_id;

                this.item_Province = this.inValue.province_id;
                this.item_District = this.inValue.district_id;
                this.item_Ward = this.inValue.ward_id;

                this.itemManager = this.inValue.manager_id;

                this.image = this.inValue.image;
                this.image_logo = this.inValue.image_logo;

                this.inValue.shopinfo = this.inValue.shopinfo.map(
                    (item: any) => ({
                        ...item,
                        _status: item.status == 1 ? true : false,
                    })
                );
                this.inValue.shopinfoProject = this.inValue.shopinfoProject.map((item: any) => ({
                    ...item,
                    _status: item.status == 1 ? true : false
                }))


                this.itemAreas =
                    Helper.IsNull(this.inValue.shopinfoProject) != true

                        ? this.inValue.shopinfoProject[0].areas
                        : null;

                this.itemSupplier = Helper.IsNull(this.inValue.shopinfoProject) != true ? this.inValue.shopinfoProject[0].supplier_id : null;

                this.inValue.shopinfobymonth = this.inValue.shopinfobymonth.map(
                    (item: any) => ({
                        ...item,
                        _year_month: this.transform(item.year_month + ''),
                    })
                );

                console.log("🚀 ~ file: store-detail.component.ts:334 ~ StoreDetailComponent ~ ngOnChanges ~  this.inValue:", this.inValue)

                // {name: 'Active', code: '1'}
                // this.loadUser();
            } catch (error) { }
        }
    }

    onImageErrorImage(event: any, type: string) {
        if (type == 'image') {
            this.inValue.image = EnumSystem.imageError;
        }
        if (type == 'image_logo') {
            this.inValue.image_logo = EnumSystem.imageError;
        }
    }

    onImageErrorImageCreate(event: any, type: string) {
        if (type == 'image') {
            this.image = EnumSystem.imageError;
        }
        if (type == 'image_logo') {
            this.image_logo = EnumSystem.imageError;
        }
    }

    msgs: Message[] = [];
    msgsInfo: Message[] = [];
    checked: boolean = false;

    _check_location!: boolean;
    _status!: boolean;
    _verify!: boolean;

    selected_project: any;

    ListStatus: any = [
        { name: 'Active', code: '1' },
        { name: 'In-Active', code: '0' },
    ];
    selectStatus: any;

    item_ShopType: any = 0;
    item_ShopTypeCreate: number = 0;
    selectShopType(event: any) {
        this.item_ShopType = event != null ? event.code : 0;
        this.item_ShopTypeCreate = event != null ? event.code : 0;

    }
    item_ShopRouter: any = 0;
    item_ShopRouterCreate: number = 0;
    selectShopRouter(event: any) {
        this.item_ShopRouter = event != null ? event.code : 0;
        this.item_ShopRouterCreate = event != null ? event.code : 0;
    }

    item_channel: any = 0;
    item_channelCreate: any;
    selectedChannel(event: any) {
        this.item_channel = event != null ? event.code : 0;
        this.item_channelCreate = event != null ? event.code : 0;
    }

    item_Province: any;
    selectProvince(event: any) {
        this.item_Province = event != null ? event : null;
        this.item_District = null;
        this.item_Ward = null;
    }
    item_District: any;
    selectDistrict(event: any) {
        this.item_District = event != null ? event : null;
        this.item_Ward = null;
    }
    item_Ward: any = 0;
    selectWard(event: any) {
        this.item_Ward = event != null ? event : null;
    }
    itemManager: number = 0;
    selectManager(event: any) {
        this.itemManager = event != null ? event.code : 0;
    }

    item_Project: any = 0;
    selectProject(event: any) {
        this.item_Project = event != null ? event.Id : 0;
    }

    update_info() {
 
        if (this.NofiIsNullCode(this.inValue.shopinfoProject[0].shop_code, 'project shop code') == 1 ||
            this.NofiIsNull(this.inValue.shop_name, 'shop name') == 1 ||
            this.NofiIsNull(this.inValue.shop_address, 'shop address') == 1 ||
            this.NofiIsNull(this.inValue.latitude, 'latitude') == 1 ||
            this.NofiIsNull(this.inValue.longitude, 'longitude') == 1 || 
            this.NofiIsNull(this.item_ShopType, 'shop type') == 1 ||
            this.NofiIsNull(this.item_channel, 'shop channel') == 1 ||
            this.NofiIsNull(this.item_ShopRouter, 'shop router') == 1 ||
            this.NofiIsNull(this.item_Province, 'province') == 1 ||
            this.NofiIsNull(this.item_District, 'district') == 1 ||
            this.NofiIsNull(this.item_Ward, 'ward') == 1 ||
            this.NofiInactive(this.item_ShopType.status, 'You are choosing a shop type inactive') == 1 ||
            this.NofiInactive(this.item_channel.status, 'You are choosing a shop channel inactive') == 1 ||
            this.NofiInactive(this.item_ShopRouter.status, 'You are choosing a shop router inactive') == 1) {

            return;

        }
        if (!Helper.isValidGPSCoordinates(this.inValue.latitude, this.inValue.longitude)) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'GPS: No coordinates do not exist',
            });
            return;
        }

        if (this.inValue._check_location == false && (this.inValue.radius == null || this.inValue.radius == undefined)) {
            this.inValue.radius = 0
        }
        if ((this.inValue._check_location == true
            && (this.inValue.radius <= 0 || Helper.number(this.inValue.radius) == false))
            || (Helper.IsNull(this.inValue.radius) != true && Helper.number(this.inValue.radius) == false)) {

            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a radius greater than 0',
            });
            return;
        }

        // this.item_channel == 0 ? this.inValue.channel_id : this.item_channel.code,
        // this.item_ShopRouter == 0 ? this.inValue.router_id : this.item_ShopRouter.code,

        this.shopService
            .ewo_Shop_Action_Audit(
                Helper.ProjectID(),
                this.inValue._status == true
                    ? (this.inValue.status = 1)
                    : (this.inValue.status = 0),
                this.inValue.shop_code,
                this.inValue.shopinfoProject[0].shop_code,
                this.inValue.shopinfoProject[0].customer_code,
                this.inValue.shop_name,
                this.inValue.shop_address,
                // this.item_ShopType == 0 ? this.inValue.shop_type_id : this.item_ShopType.code,
                this.item_ShopType,
                this.item_Province > 0 ? this.item_Province : this.item_Province.code,
                this.item_District > 0 ? this.item_District : this.item_District.code,
                this.item_Ward > 0 ? this.item_Ward : this.item_Ward.code,

                this.item_channel,
                this.item_ShopRouter,
                this.item_ASM,
                this.inValue.latitude,
                this.inValue.longitude,

                this.inValue.contact_name,
                this.inValue.contact_mobile,
                this.inValue._check_location == true
                    ? (this.inValue.check_location = 1)
                    : (this.inValue.check_location = 0),
                this.inValue.radius,
                this.inValue._verify == true
                    ? (this.inValue.verify = 1)
                    : (this.inValue.verify = 0),
                this.inValue.shopinfoProject[0].sign_name,
                this.inValue.shopinfoProject[0].tax_code,
                'update',
                this.inValue.created_from,
                this.image,
                this.image_logo
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data == 1) {
                        // this.updateAreas()
                        this.clearFileInput()
                        if (Helper.IsNull(this.itemSupplier) != true) {
                            // this.updateSupplier()
                            this.shopService
                                .Shop_Supplier_Action(
                                    Helper.ProjectID(),
                                    this.inValue.shop_id,
                                    this.itemSupplier
                                )
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        if (data.data == 1) {
                                            this.addNewItem()
                                        }
                                    }
                                });
                        }

                        if (Helper.IsNull(this.itemAreas) != true) {
                            // this.updateAreas()
                            this.shopService
                                .ewo_ShopAreas_Action(
                                    Helper.ProjectID(),
                                    this.inValue.shop_id,
                                    this.itemAreas
                                )
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        if (data.data == 1) {
                                            this.addNewItem()
                                        }
                                    }
                                });

                        }
                        this.NofiResult('Page Shop', 'Update store', 'Successful store update', 'success', 'Successful')
                        this.addNewItem();
                    } else {
                        this.NofiResult('Page Shop', 'Update store', 'Error store update', 'error', 'Error')
                        return;
                    }
                }
            });
    }

    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }

    @ViewChild('myInputImage') myInputImage: any;
    @ViewChild('myInputLogo') myInputLogo: any;

    clearFileInput() {
        this.myInputImage.nativeElement.value = null;
        this.myInputLogo.nativeElement.value = null;
    }

    radius!: number;
    clear() {
        this._status = false;
        this.shop_code = '';
        this.project_shop_code = '';
        this.customer_shop_code = '';
        this.shop_name = '';
        this.shop_address = '';
        this.item_ShopType = 0;
        this.item_Province = 0;
        this.item_District = 0;
        this.item_Ward = 0;
        this.item_channel = 0;
        this.item_ShopRouter = 0;
        this.item_ASM = 0;
        this.latitude = 0;
        this.longitude = 0;

        this.contact_name = '';
        this.contact_mobile = '';
        this._check_location = false;
        this.radius = 0;
        this._verify = false;
        this.created_from = '';
        this.sign_name = '';
        this.tax_code = ''
        this.image = '';
        this.image_logo = '';
        this.item_ShopRouterCreate = 0;
        this.item_ShopTypeCreate = 0;
        this.item_channelCreate = 0;
        this.clearFileInput();
    }

    createShops() {


        if (Helper.IsNull(this.shop_code) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a shop code',
            });
            return;
        }
        if (Pf.checkLengthCode(this.shop_code) != true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Character length of shop code must be greater than or equal to 8',
            });
            return;
        }
        if (Pf.checkSpaceCode(this.shop_code) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Shop code must not contain empty characters',
            });

            return;
        }
        if (Pf.checkUnsignedCode(this.shop_code) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Shop code is not allowed to enter accented characters',
            });

            return;
        }
        if (this.NofiIsNullCode(this.project_shop_code, 'project shop code') == 1 ||
            this.NofiIsNull(this.shop_name, 'shop name') == 1 ||
            this.NofiIsNull(this.shop_address, 'shop address') == 1 ||
            this.NofiIsNull(this.latitude, 'latitude') == 1 ||
            this.NofiIsNull(this.longitude, 'longitude') == 1 || 
            this.NofiIsNull(this.item_ShopType, 'shop type') == 1 ||
            this.NofiIsNull(this.item_channel, 'shop channel') == 1 ||
            this.NofiIsNull(this.item_ShopRouter, 'shop router') == 1 ||
            this.NofiIsNull(this.item_Province, 'province') == 1 ||
            this.NofiIsNull(this.item_District, 'district') == 1 ||
            this.NofiIsNull(this.item_Ward, 'ward') == 1 ||
            this.NofiInactive(this.item_ShopType.status, 'You are choosing a shop type inactive') == 1 ||
            this.NofiInactive(this.item_channel.status, 'You are choosing a shop channel inactive') == 1 ||
            this.NofiInactive(this.item_ShopRouter.status, 'You are choosing a shop router inactive') == 1) {

            return;

        }

        if (!Helper.isValidGPSCoordinates(this.latitude, this.longitude)) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'GPS: No coordinates do not exist',
            });
            return;
        }
        if (this._check_location == false || Helper.IsNull(this.radius) == true) {
            this.radius = 0;
        }

        if (
            (this._check_location == true && (this.radius <= 0 || this.radius == undefined || Helper.number(this.radius) == false))

            || (Helper.IsNull(this.radius) != true && Helper.number(this.radius) == false)

        ) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Format wrong radius',
            });

            return;
        }


        this.shopService
            .ewoGetShopList(1000, 1, Helper.ProjectID(), this.shop_code, '', '',
                0, 0, 0, 0, 0, 0, -1, 0, '', 0
            )
            .subscribe((data: any): any => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.messageService.add({
                            severity: EnumStatus.warning,
                            summary: EnumSystem.Notification,
                            detail: 'Shop code already exists',
                        });
                        // return
                    } else {
                        this.shopService
                            .ewoGetShopList(100000, 1, Helper.ProjectID(),
                                '', '', '', 0, 0, 0, 0, 0, 0, -1, 0, '', 0)
                            .subscribe((data: any) => {
                                let check = 0;
                                if (data.result == EnumStatus.ok) {
                                    if (data.data.length > 0) {
                                        data.data.forEach((element: any): any => {
                                            if (Helper.IsNull(element.shopinfo) != true) {
                                                element.shopinfo = JSON.parse(element.shopinfo)
                                                element.shopinfo = element.shopinfo.filter((x: any) => x.project_id == Helper.ProjectID())
                                                if (element.shopinfo[0].shop_code == this.project_shop_code) {
                                                    this.messageService.add({
                                                        severity: EnumStatus.warning,
                                                        summary: EnumSystem.Notification,
                                                        detail: 'Project shop code already exists',
                                                    });
                                                    // return
                                                    check = 1
                                                }
                                            }
                                        });
                                    }
                                }
                                if (check == 1) {
                                    return;
                                }
                                else {
                                    this.shopService
                                        .ewo_Shop_Action_Audit(
                                            Helper.ProjectID(),
                                            this._status == true ? 1 : 0,
                                            this.shop_code,
                                            this.project_shop_code,
                                            this.customer_shop_code,
                                            this.shop_name,
                                            this.shop_address,
                                            this.item_ShopTypeCreate,
                                            this.item_Province.code,
                                            this.item_District.code,
                                            this.item_Ward.code,
                                            this.item_channelCreate,
                                            this.item_ShopRouterCreate,
                                            this.item_ASM,
                                            this.latitude,
                                            this.longitude,
                                            this.contact_name,
                                            this.contact_mobile,
                                            this._check_location == true ? 1 : 0,
                                            this.radius,
                                            this._verify == true ? 1 : 0,
                                            this.sign_name,
                                            this.tax_code,
                                            'create',
                                            'web',
                                            this.image,
                                            this.image_logo
                                        )
                                        .subscribe((data: any) => {
                                            if (data.result == EnumStatus.ok) {
                                                if (data.data == 1) {

                                                    this.NofiResult('Page Shop', 'Create Shop', 'Success Create Shop', 'success', 'Successful')

                                                    // if (Helper.IsNull(this.itemSupplier) != true) {
                                                    //     // this.updateSupplier()
                                                    //     this.shopService
                                                    //         .Shop_Supplier_Action(
                                                    //             Helper.ProjectID(),
                                                    //             this.inValue.shop_id,
                                                    //             this.itemSupplier
                                                    //         )
                                                    //         .subscribe((data: any) => {
                                                    //             if (data.result == EnumStatus.ok) {
                                                    //                 if (data.data == 1) {
                                                    //                     this.addNewItem()
                                                    //                 }
                                                    //             }
                                                    //         });
                                                    // } 
                                                    // if (Helper.IsNull(this.itemAreas) != true) {
                                                    //     // this.updateAreas()
                                                    //     this.shopService
                                                    //         .ewo_ShopAreas_Action(
                                                    //             Helper.ProjectID(),
                                                    //             this.inValue.shop_id,
                                                    //             this.itemAreas
                                                    //         )
                                                    //         .subscribe((data: any) => {
                                                    //             if (data.result == EnumStatus.ok) {
                                                    //                 if (data.data == 1) {
                                                    //                     this.addNewItem()
                                                    //                 }
                                                    //             }
                                                    //         });

                                                    // }
                                                    this.clear();
                                                    this.clearFileInput();
                                                    this.displayShopForm();
                                                } else {
                                                    this.NofiResult('Page Shop', 'Create Shop', 'Error Create Shop', 'error', 'Error')
                                                    return;
                                                }
                                            }
                                        });
                                }

                            })
                    }
                }
            });


    }


    checkAccountTest() {
        this.checked == false
            ? (this.inValue.status = 0)
            : (this.inValue.status = 1);
    }

    addNewItem() {
        this.newItemEvent.emit(false);
    }
    displayShopForm() {
        this.newEventCreate.emit(false);
    }
    displayShopInfo() {
        this.newEventInfo.emit();
    }

    onRowEditSave(info: any) {

        // if (Helper.IsNull(this.itemManager) == true && Helper.IsNull(info.manager_id) == true) {
        //     this.messageService.add({
        //         severity: EnumStatus.warning,
        //         summary: EnumSystem.Notification,
        //         detail: 'Please enter a manager'
        //     });
        //     return;
        // }

        this.shopService
            .ewo_ShopInfoProject_UpdateManager(
                info.id,
                this.itemManager,
                info.sign_name,
                info.tax_code
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.inValue.shopinfo = data.data;

                        this.NofiResult('Page Shop', 'Update management', 'Update successful management information', 'success', 'Successful');

                    }
                }
            });
    }

    createShopInfoProject() {
        this.ShopInfoCreate = true;
    }

    onRowRemove(event: any, info: any) { }

    dataOut(data: any) {
        if (this.inValue.shopinfo.length != data.length) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Create shop info project successful',
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Project already exist',
            });
        }
    }

    addItem(newItem: boolean) {
        this.ShopInfoCreate = newItem;
    }

    itemAreas: any = null;
    selectAreas(event: any) {
        this.itemAreas = event != null ? event.code : null;
    }

    updateAreas() {
        if (this.nofiIsNull(this.itemAreas, 'areas') == 1) {
            return;
        } else {
            this.shopService
                .ewo_ShopAreas_Action(
                    Helper.ProjectID(),
                    this.inValue.shop_id,
                    this.itemAreas
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.NofiResult('Page Shop', 'Update Areas Shop', 'Update Areas Shop Successfull', 'success', 'Successfull');
                            this.addNewItem()
                        }
                    }
                });
        }
    }


    itemSupplier: any = null;
    selectSupplier(event: any) {
        this.itemSupplier = event != null ? event.code : null;
    }

    updateSupplier() {

        if (this.nofiIsNull(this.itemSupplier, 'supplier') == 1) {
            return;
        } else {
            this.shopService
                .Shop_Supplier_Action(
                    Helper.ProjectID(),
                    this.inValue.shop_id,
                    this.itemSupplier
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.NofiResult('Page Shop', 'Update supplier shop', 'Update Supplier Shop Successfull', 'success', 'Successfull');
                            this.addNewItem()
                        }
                    }
                });
        }

    }

    nofiIsNull(value: any, name: any): any {
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

    // ============================= MANAGER SHOPS ====================================== //

    actionEmployeeShops: any = 'create';

    openNew() {
        this.EmployeeShop = {};
        this.item_SS = 0;
        this.actionEmployeeShops = 'create';
        let newDate = new Date();
        this.EmployeeShop.FromDate = this.getFormatedDate(
            newDate,
            'YYYY-MM-dd'
        );
        this.EmployeeShop.ToDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.submitted = false;
        this.employeeShopDialog = true;
    }

    deleteSelectedEmployeeShop() {

        this.confirmationService.confirm({
            message:
                'Are you sure you want to delete the selected ListEmployeeShop?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedEmployeeShops.forEach((element: any) => {

                    // this.deleteEmployeeShop(element)
                });

                this.selectedEmployeeShops = null;
            },
            reject: (type: any) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Rejected',
                            detail: 'You have rejected',
                        });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Cancelled',
                            detail: 'You have cancelled',
                        });
                        break;
                }
            },
        });
    }

    editEmployeeShop(EmployeeShop: any) {
        this.EmployeeShop = { ...EmployeeShop };
        this.actionEmployeeShops = 'update';

        if (Helper.IsNull(this.EmployeeShop.FromDate) != true) {
            this.EmployeeShop.FromDate = Pf.convertToISODate(
                this.EmployeeShop.FromDate + ''
            );
        }
        if (Helper.IsNull(this.EmployeeShop.ToDate) != true) {
            this.EmployeeShop.ToDate = Pf.convertToISODate(
                this.EmployeeShop.ToDate + ''
            );
        } else {
            this.EmployeeShop.ToDate = 'mm/dd/yyyy';
        }
        this.employeeShopDialog = true;
    }

    deleteEmployeeShop(EmployeeShop: any) {
        this.confirmationService.confirm({
            message:
                ' Are you sure you want to delete the store manager information ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.shopService
                    .ewo_EmployeeShops_Action(
                        EmployeeShop.ProjectId,
                        EmployeeShop.Id,
                        EmployeeShop.EmployeeId,
                        EmployeeShop.ShopId,
                        EmployeeShop.FromDate,
                        EmployeeShop.ToDate,
                        EmployeeShop.IsActive,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            // if (data.data.length > 1) {
                            this.NofiResult('Page Shop', 'Delete manager', 'Delete manager shop successfull', 'success', 'Successful');

                            this.clearSaveEmployeeShop(data.data);
                            // }
                        }
                    });
            },
            reject: (type: any) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Rejected',
                            detail: 'You have rejected',
                        });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Cancelled',
                            detail: 'You have cancelled',
                        });
                        break;
                }
            },
        });
    }

    hideDialog() {
        this.employeeShopDialog = false;
        this.submitted = false;
    }

    item_SS: number = 0;
    selectEmployee(event: any) {
        this.item_SS = event != null ? event.code : 0;
    }

    saveEmployeeShop() {
        this.submitted = true;
        if (
            this.NofiIsNull(this.item_SS, 'manager') == 1 ||
            this.NofiIsNull(this.EmployeeShop.FromDate, 'from date') == 1 ||
            this.Compare(
                this.EmployeeShop.FromDate,
                this.EmployeeShop.ToDate,
                'To Date',
                'from date'
            ) == 1
        ) {
            return;
        } else {
            try {
                if (Helper.IsNull(this.EmployeeShop.FromDate) != true) {
                    this.EmployeeShop.FromDate = parseInt(
                        Pf.StringDateToInt(this.EmployeeShop.FromDate)
                    );
                }
                if (Helper.IsNull(this.EmployeeShop.ToDate) != true) {
                    this.EmployeeShop.ToDate = parseInt(
                        Pf.StringDateToInt(this.EmployeeShop.ToDate)
                    );
                } else {
                    this.EmployeeShop.ToDate = null;
                }
            } catch (error) { }
            this.shopService
                .ewo_EmployeeShops_Action(
                    this.actionEmployeeShops == 'create'
                        ? Helper.ProjectID()
                        : this.EmployeeShop.ProjectId,
                    this.actionEmployeeShops == 'create'
                        ? 0
                        : this.EmployeeShop.Id,
                    this.item_SS,
                    this.actionEmployeeShops == 'create'
                        ? this.inValue.shop_id
                        : this.EmployeeShop.ShopId,
                    this.EmployeeShop.FromDate,
                    this.EmployeeShop.ToDate,
                    this.EmployeeShop._IsActive == true ? 1 : 0,
                    this.actionEmployeeShops
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        const action =
                            this.actionEmployeeShops == 'create'
                                ? 'Create'
                                : 'Update';
                        this.NofiResult('Page Shop', action, action + ' manager shop successfull', 'success', 'Successful');
                        this.clearSaveEmployeeShop(data.data);
                    }
                });
        }
    }
    clearSaveEmployeeShop(data: any) {
        // EmployeeShop._IsActive

        data = data.map((item: any) => ({
            ...item,
            _IsActive: item.IsActive == 1 ? true : false,
        }));

        this.inValue.employeeShops = data;
        this.employeeShopDialog = false;
        this.EmployeeShop = {};
        this.item_SS = 0;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.ListEmployeeShop.length; i++) {
            if (this.ListEmployeeShop[i].id === id) {
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


    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
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

    Compare(min: any, max: any, nameMax: any, nameMin: any): any {
        let check = 0;
        if (
            min > max &&
            Helper.IsNull(min) != true &&
            Helper.IsNull(max) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail:
                    nameMax +
                    ' value must be greater than or equal to ' +
                    nameMin,
            });
            check = 1;
        }
        return check;
    }

    user_profile: string = 'current';
    currentUser: any;
    userProfile: any;

    loadUser() {
        if (this.user_profile == EnumSystem.current) {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.currentUser.employee[0]._status =
                this.currentUser.employee[0].status == 1 ? true : false;
            this.userProfile = this.currentUser.employee[0];
            this.checkActionManagerShops();
        }
    }

    checkActionMS: boolean = false;
    checkActionManagerShops(): any {
        if (
            this.userProfile.employee_type_id == 1 ||
            this.userProfile.employee_type_id == 3
        ) {
            // return true
            this.checkActionMS = true;
        } else {
            // return false
            this.checkActionMS = false;
        }
    }
    NofiIsNull(value: any, name: any): any {

        let check = 0;
        if (value == 0) {
            check = 1;
        }
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


    NofiIsNullCode(value: any, name: any): any {
        //  Pf.CheckCode(value) != true
        if (
            Helper.IsNull(value) == true ||
            Pf.checkSpaceCode(value) == true ||
            Pf.checkUnsignedCode(value) == true
        ) {

            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }

    NofiInactive(value: any, name: any): any {
        let check = 0
        if (value == 0) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: name,
            });
            check = 1
        }
        return check;
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

}
