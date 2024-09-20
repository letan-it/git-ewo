import {
    Component,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import {
    ConfirmationService,
    MenuItem,
    Message,
    MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { startWith } from 'rxjs';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { ActivationService } from 'src/app/web/service/activation.service';
import { FileService } from 'src/app/web/service/file.service';
import { OolService } from 'src/app/web/service/ool.service';
import { OsaService } from 'src/app/web/service/osa.service';
import { PhotoService } from 'src/app/web/service/photo.service';
import { PosmService } from 'src/app/web/service/posm.service';
import { ProductService } from 'src/app/web/service/product.service';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { QcsService } from 'src/app/web/service/qcs.service';
import { ReportsService } from 'src/app/web/service/reports.service';
import { SellInService } from 'src/app/web/service/sell-in.service';
import { SellOutService } from 'src/app/web/service/sell-out.service';
import { InventoryService } from '../../inventory/service/inventory.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SosService } from '../../sos/services/sos.service';
import { PrcsService } from '../../prcs/service/prcs.service';
import { AtdPrcsService } from 'src/app/web/service/atd_prcs.service';
import { NodeService } from 'src/app/web/service/node.service';
import { AppComponent } from 'src/app/app.component';
import { WorksDetailComponent } from '../../works/works-detail/works-detail.component';

@Component({
    selector: 'app-works-attendance-details',
    templateUrl: './works-attendance-details.component.html',
    styleUrls: ['./works-attendance-details.component.scss'],
    providers: [
        MessageService,
        ConfirmationService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: WorksDetailComponent,
            multi: true,
        },
    ],
})
export class WorksAttendanceDetailsComponent {
    constructor(
        private _service: ReportsService,
        private prcService: AtdPrcsService,
        private photoService: PhotoService,
        private pomService: PosmService,
        private messageService: MessageService,
        private taskService: TaskFileService,
        private _file: FileService,
        private edService: EncryptDecryptService,
        private qcService: QcsService,
        private osaService: OsaService,
        private promotionService: PromotionService,
        private oolService: OolService,
        private productService: ProductService,
        private sellOutService: SellOutService,
        private sellInService: SellInService,
        private activationService: ActivationService,
        private inventoryService: InventoryService,
        private confirmationService: ConfirmationService,
        private sosService: SosService
    ) {}
    items: any;
    project_id: any = Helper.ProjectID();

    leftTooltipItems: any;
    onImageError(event: any, image: any) {
        const link_err = 'https://audit-api.acacy.vn/template/no_photo.jpg';
        if (image == 'ListATT_getItemOne')
            this.ListATT_getItemOne.atd_photo = link_err;
        else if (image == 'ListATT_getItemTwo') {
            this.ListATT_getItemTwo.atd_photo = link_err;
        } else if (image == 'ListATT_getItemThree') {
            this.ListATT_getItemThree.atd_photo = link_err;
        }
    }
    listphoto: any;
    openImage(index: any) {
        const changeindex = index;
        localStorage.setItem('listphoto', JSON.stringify(this.listphoto));
        localStorage.setItem('changeindex', JSON.stringify(changeindex));

        this.urlgallery = 'assets/ZoomImage/tool.html';
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }
    @Input() action: any = 'view';
    @Input() inValue: any;
    @Input() FilterSurvey: any = 0;

    MapShop: string = '';
    msgs: Message[] = [];
    message: string = '';
    display: boolean = false;

    isHistory: boolean = false;
    ListATT_getItem: any;
    ListATT_getItemOne: any;
    ListATT_getItemTwo: any;
    ListATT_getItemThree: any;

    ListSurvey_getItem: any;
    ListSurveyResult: any;
    ListSurveyDetail: any;
    ListSurveyDetailModel: any;
    ListSurveyImage: any;
    ConfigImage: any;

    urlgallery: any;
    images: any;

    activeIndex: number = 0;

    showThumbnails: any = true;
    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];

    mapPopup(lat: any, long: any) {
        this.urlgallery =
            'https://www.google.com/maps/search/' + lat + '+' + long;
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    Listquestion_type: any = [
        { label: 'DATA', value: 'DATA' },
        { label: 'IMAGE', value: 'IMAGE' },
    ];
    Listquestion_group: any = [
        { label: 'SAMSUNG', value: 'SAMSUNG' },
        { label: 'AQUA', value: 'AQUA' },
        { label: 'HITACHI', value: 'HITACHI' },
        { label: 'LG', value: 'LG' },
        { label: 'PANASONIC', value: 'PANASONIC' },
        { label: 'SHARP', value: 'SHARP' },
        { label: 'TOSHIBA', value: 'TOSHIBA' },
    ];

    dataQC: any;
    clear(table: Table) {
        table.clear();
    }
    visible: boolean = false;
    edit_survey: any = { item_data: undefined, tab: undefined };
    showDialogEdit(tab: any, item: any) {
        this.visible = true;
        this.edit_survey.item_data = item;
        this.edit_survey.tab = tab;
    }

    onRowEditSaveSurvey(item: any) {}

    onRowEditCancelSurvey(item: any, index: number) {}
    tabViewChange(e: any, tab: any) {
        //this.activeIndex = tab._activeIndex;
    }
    is_loadForm: number = 1;
    //list_question_group: any;
    getDistinctObjects(dataList: any, property: any) {
        const uniqueValues = new Set();
        return dataList.filter((obj: any) => {
            const value = obj[property];
            if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                return true;
            }
            return false;
        });
    }
    getDistinct(items: any) {
        return items.filter(
            (item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => t === item)
        );
    }

    CheckCol(data: any) {
        try {
            const check = data.filter((obj: any) => obj.note != null);
            if (check.length > 0) {
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            return 1;
        }
    }

    listDataLocation: any = [];
    loadItemKPI() {
        try {
            this._service
                .ewo_ShopCheckResult_GetList(
                    Helper.ProjectID(),
                    this.inValue.report_id
                )
                .subscribe((data: any) => {
                    this.is_loadForm = 0;
                    this.listDataLocation = [];

                    if (data.result == EnumStatus.ok) {
                        data.data.forEach((element: any) => {
                            element.key = this.checkInfoShop(element.key_check);
                        });

                        this.inValue.data_checkShop = data.data;

                        const listImage = data.data.filter(
                            (x: any) => x.key_check == 'image'
                        );
                        const list = data.data.filter(
                            (y: any) =>
                                y.key_check != 'image' &&
                                y.key_check != 'latitude' &&
                                y.key_check != 'longitude'
                        );

                        const listphoto = [];
                        const listphotoImage = [];

                        if (
                            Helper.IsNull(listImage) != true &&
                            listImage.length > 0
                        ) {
                            listphoto.push({
                                id: 1,
                                src: listImage[0].data_check,
                                result: listImage[0].result,
                                title:
                                    'Ảnh tổng quan' +
                                    ': ' +
                                    listImage[0].app_time,
                                image_time: listImage[0].app_time,
                                _index: 1,
                            });
                        }
                        if (
                            Helper.IsNull(listImage) != true &&
                            listImage.length > 1
                        ) {
                            for (var i = 0; i < listImage.length; i++) {
                                listphotoImage.push({
                                    id: i + 1,
                                    src: listImage[i].value_string,
                                    title:
                                        'Ảnh mới' +
                                        ': ' +
                                        listImage[i].app_time,
                                    image_time: listImage[i].app_time,
                                    _index: i + 1,
                                });
                            }
                        }

                        const dataLatitude = data.data.filter(
                            (x: any) => x.key_check == 'latitude'
                        )[0];
                        const dataLongitude = data.data.filter(
                            (x: any) => x.key_check == 'longitude'
                        )[0];

                        if (
                            Helper.IsNull(dataLatitude) != true &&
                            Helper.IsNull(dataLongitude) != true
                        ) {
                            const data_checklatitude = dataLatitude.data_check;
                            const resultlatitude = dataLatitude.result;
                            const value_stringlatitude =
                                dataLatitude.value_string;

                            const data_checklongitude =
                                dataLongitude.data_check;
                            const resultlongitude = dataLongitude.result;
                            const value_stringlongitude =
                                dataLongitude.value_string;

                            // Tính khoảng cách
                            var distance = Pf.haversine(
                                data_checklatitude,
                                data_checklongitude,
                                value_stringlatitude,
                                value_stringlongitude
                            );
                            // In ra khoảng cách

                            this.listDataLocation.push({
                                id: 1,
                                src: this.linkMap(
                                    data_checklatitude,
                                    data_checklongitude
                                ),
                                data_check: data_checklatitude,
                                result: resultlatitude,
                                value_string: value_stringlatitude,
                                haversine: distance.toFixed(2),
                                title:
                                    'Ảnh tọa độ' + ': ' + dataLatitude.app_time,
                                image_time: dataLatitude.app_time,
                                _index: 1,
                            });

                            this.listDataLocation.push({
                                id: 2,
                                src: this.linkMap(
                                    value_stringlatitude,
                                    value_stringlongitude
                                ),
                                data_check: data_checklongitude,
                                result: resultlongitude,
                                value_string: value_stringlongitude,
                                title:
                                    'Ảnh tọa độ' +
                                    ': ' +
                                    dataLongitude.app_time,
                                image_time: dataLongitude.app_time,
                                _index: 2,
                            });
                        } else {
                            this.listDataLocation = [];
                        }
                        this.inValue.data_checkShop.list = list;
                        this.inValue.data_checkShop.listphoto = listphoto;
                        this.inValue.data_checkShop.listphotoImage =
                            listphotoImage;
                        this.inValue.data_checkShop.listLocation =
                            this.listDataLocation;
                    } else {
                        this.inValue.data_checkShop = [];
                    }
                });
        } catch (error) {}

        try {
            this.loadDataATD(this.inValue.project_id, this.inValue.report_id);
        } catch (error) {}

        try {
            this._service
                .ewo_Survey_getItem(
                    this.inValue.project_id,
                    this.inValue.report_id
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.is_loadForm = 0;
                        if (data.data.result.length > 0) {
                            this.ListSurveyResult = data.data.result;
                            if (this.FilterSurvey > 0) {
                                this.ListSurveyResult =
                                    this.ListSurveyResult.filter(
                                        (item: any) =>
                                            item.survey_id == this.FilterSurvey
                                    );
                            }
                            this.ListSurveyDetail = data.data.detail;

                            this.ListSurveyDetail = this.ListSurveyDetail.map(
                                (item: any) => ({
                                    ...item,
                                    history: JSON.parse(item.history),
                                    representative: {
                                        name: item.question_group,
                                        color: item.color,
                                    },
                                })
                            );
                            this.isHistory = false;
                            this.ListSurveyDetail.forEach((e: any) => {
                                if (e.history && e.history.length > 0) {
                                    this.isHistory = true;
                                }
                                e.tooltip =
                                    e.updateby != null
                                        ? 'Updated by: ' + e.updateby
                                        : '';
                            });

                            this.ListSurveyDetailModel = data.data.modeledit;
                            this.ListSurveyDetail.forEach((element: any) => {
                                try {
                                    element.answer_item = JSON.parse(
                                        element.answer_item
                                    );
                                } catch (error) {}
                                try {
                                    element.answer_option = JSON.parse(
                                        element.answer_option
                                    );
                                } catch (error) {}
                            });

                            this.ListSurveyImage = data.data.image;
                            this.ConfigImage = data.data.configimage;
                            this.ListSurveyResult.forEach((element: any) => {
                                element.is_edit_data = this.dataQC.filter(
                                    (qc: any) =>
                                        qc.KPI == 'SURVEY' &&
                                        qc.item_id == element.survey_id
                                )[0].is_edit_data;

                                element.detail = this.ListSurveyDetail.filter(
                                    (d: any) =>
                                        d.survey_result_id ==
                                        element.survey_result_id
                                );

                                const _temp = this.getDistinctObjects(
                                    element.detail,
                                    'question_group'
                                );
                                try {
                                    const group: any = [];
                                    _temp.forEach((element: any) => {
                                        if (element.question_group.length > 0)
                                            group.push({
                                                label: element.question_group,
                                                value: element.question_group,
                                            });
                                    });
                                    element.group = group;
                                } catch (error) {}

                                element.detailmodel =
                                    this.ListSurveyDetailModel.filter(
                                        (d: any) =>
                                            d.survey_result_id ==
                                            element.survey_result_id
                                    );

                                element.photo = this.ListSurveyImage.filter(
                                    (i: any) =>
                                        i.survey_result_id ==
                                        element.survey_result_id
                                );
                                element.configImage = this.ConfigImage.filter(
                                    (p: any) =>
                                        p.survey_result_id ==
                                        element.survey_result_id
                                );
                            });
                        } else {
                            this.message = 'No data';
                            this.display = true;
                        }
                    }
                });
        } catch (error) {}
    }

    filterWorkShift: any;
    filterWorkShifts: any = [];
    selectedFilterWorkShift(event: any) {
        this.filterWorkShift = event.value === null ? 0 : event.value.id;
    }
    isdelete_ATD: any;

    loadDataATD(project_id: any, report_id: any) {
        if (Helper.ProjectID() != 20 && Helper.ProjectID() != 21) {
            this._service
                .ew_ATT_getItem(project_id, report_id)
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.activeIndex = 0;
                        if (data.data.length > 0) {
                            this.is_loadForm = 0;
                            this.ListATT_getItem = data.data;
                            this.ListATT_getItem.isdelete_ATD =
                                this.isdelete_ATD;
                            const list = this.ListATT_getItem;

                            this.listphoto = [];
                            for (
                                var i = 0;
                                i < this.ListATT_getItem.length;
                                i++
                            ) {
                                this.listphoto.push({
                                    id: i + 1,
                                    src: this.ListATT_getItem[i].atd_photo,
                                    title:
                                        this.ListATT_getItem[i].atd_type +
                                        ': ' +
                                        this.ListATT_getItem[i].atd_time,
                                    image_time:
                                        this.ListATT_getItem[i].atd_time,
                                    _index: i + 1,
                                });
                            }

                            const editData = this.dataQC.filter(
                                (qc: any) => qc.KPI == 'ATTENDANCE'
                            )[0].is_edit_data;
                            this.ListATT_getItem.is_edit_data = editData;
                            try {
                                this.ListATT_getItemOne =
                                    this.ListATT_getItem.filter(
                                        (item: any) =>
                                            item.atd_type == 'CHECKIN'
                                    )[0];
                                this.ListATT_getItemOne.is_edit_data = editData;
                            } catch (error) {}
                            try {
                                this.ListATT_getItemTwo =
                                    this.ListATT_getItem.filter(
                                        (item: any) =>
                                            item.atd_type == 'CHECKOUT'
                                    )[0];
                                this.ListATT_getItemTwo.is_edit_data = editData;
                            } catch (error) {}
                            try {
                                this.ListATT_getItemThree =
                                    this.ListATT_getItem.filter(
                                        (item: any) =>
                                            item.atd_type == 'OVERVIEW'
                                    )[0];
                                this.ListATT_getItemThree.is_edit_data =
                                    editData;
                            } catch (error) {}

                            let numMaxOfListATT = 0;
                            // let y = this.ListATT_getItem.pop();
                            this.ListATT_getItem.forEach((item: any) => {
                                const x = this.ListATT_getItem.filter(
                                    (element: any) => element.r === item.r
                                );
                                this.filterWorkShifts.push({
                                    label:
                                        '[' +
                                        x[0].shift_code +
                                        '] - ' +
                                        x[0].note,
                                    items: [...x],
                                });
                                numMaxOfListATT = item.r;
                            });
                            this.filterWorkShifts = this.filterWorkShifts.slice(
                                0,
                                numMaxOfListATT
                            );
                        } else {
                            this.message = 'No data';
                            this.display = true;
                        }
                    }
                });
        } else {
            this._service
                .ew_ATT_getItem_Shift(project_id, report_id)
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.activeIndex = 0;
                        if (data.data.length > 0) {
                            this.is_loadForm = 0;
                            this.ListATT_getItem = data.data;

                            const list = this.ListATT_getItem;

                            this.listphoto = [];
                            for (
                                var i = 0;
                                i < this.ListATT_getItem.length;
                                i++
                            ) {
                                this.listphoto.push({
                                    id: i + 1,
                                    src: this.ListATT_getItem[i].atd_photo,
                                    title:
                                        this.ListATT_getItem[i].atd_type +
                                        ': ' +
                                        this.ListATT_getItem[i].atd_time,
                                    image_time:
                                        this.ListATT_getItem[i].atd_time,
                                    _index: i + 1,
                                });
                            }

                            const editData = this.dataQC.filter(
                                (qc: any) => qc.KPI == 'ATTENDANCE'
                            )[0].is_edit_data;
                            this.ListATT_getItem.is_edit_data = editData;

                            try {
                                this.ListATT_getItemOne =
                                    this.ListATT_getItem.filter(
                                        (item: any) =>
                                            item.atd_type == 'CHECKIN'
                                    )[0];
                                this.ListATT_getItemOne.is_edit_data = editData;
                            } catch (error) {}
                            try {
                                this.ListATT_getItemTwo =
                                    this.ListATT_getItem.filter(
                                        (item: any) =>
                                            item.atd_type == 'CHECKOUT'
                                    )[0];
                                this.ListATT_getItemTwo.is_edit_data = editData;
                            } catch (error) {}
                            try {
                                this.ListATT_getItemThree =
                                    this.ListATT_getItem.filter(
                                        (item: any) =>
                                            item.atd_type == 'OVERVIEW'
                                    )[0];
                                this.ListATT_getItemThree.is_edit_data =
                                    editData;
                            } catch (error) {}

                            let numMaxOfListATT = 0;
                            // let y = this.ListATT_getItem.pop();
                            this.ListATT_getItem.forEach((item: any) => {
                                const x = this.ListATT_getItem.filter(
                                    (element: any) => element.r === item.r
                                );
                                this.filterWorkShifts.push({
                                    label:
                                        '[' +
                                        x[0].shift_code +
                                        '] - ' +
                                        x[0].note,
                                    items: [...x],
                                });
                                numMaxOfListATT = item.r;
                            });
                            this.filterWorkShifts = this.filterWorkShifts.slice(
                                0,
                                numMaxOfListATT
                            );
                        } else {
                            this.message = 'No data';
                            this.display = true;
                        }
                    }
                });
        }
    }

    loadValueString(listMultiSelect: any, element: any) {
        element.value_string = [];

        if (Helper.IsNull(listMultiSelect) != true) {
            listMultiSelect
                .filter(
                    (x: any) =>
                        x.ool_result_id == element.ool_result_id &&
                        x.ool_detail_id == element.ool_detail_id &&
                        x.ool_id == element.ool_id &&
                        x.layer == element.layer &&
                        x.ool_item_id == element.ool_item_id
                )
                .forEach((z: any) => {
                    if (Helper.IsNull(z._value_string[0]) != true) {
                        element.value_string.push(z._value_string[0]);
                    }
                });
            element._listAnswer = '';
            element.value_string_info = '';

            if (Helper.IsNull(element.value_string) != true) {
                element.value_string.forEach((x: any) => {
                    if (Helper.IsNull(x.ool_answer_id) != true) {
                        element._listAnswer += `${x.ool_answer_id},`;
                        element.value_string_info += `${x.value},`;
                    }
                });
            }
        }
    }

    listProduct: any = [];
    getListProduct() {
        this.productService
            .ewo_Products_GetList(Helper.ProjectID(), '', '', 0, '', 1000000, 1)
            .subscribe((data: any) => {
                this.listProduct = [];
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        data.data.forEach((element: any) => {
                            this.listProduct.push({
                                ool_answer_id: element.product_id,
                                product_code: element.product_code,
                                product_name: element.product_name,
                                name: `[${element.product_id}] - ${element.product_code} - ${element.product_name}`,
                                value: element.product_name,
                            });
                        });
                    }
                }
            });
    }

    listItemMaster: any = [];
    loadMaster() {
        this.oolService
            .OOL_item_Master(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listItemMaster = [];
                    if (data.data.length > 0) {
                        data.data.forEach((element: any) => {
                            this.listItemMaster.push({
                                name: element.name,
                                question_type: element.question_type,
                                support_data: element.support_data,
                                typeOf: element.typeOf,
                            });
                        });
                    } else {
                        this.listItemMaster = [];
                    }
                }
            });
    }

    total(quantity: any, price: any) {
        return quantity * price;
    }

    listLocation(value_string: any, value_int: any): any {
        return {
            name: value_string,
            code: value_int,
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue']) {
            try {
                this.loadData(this.inValue.report_id);
            } catch (error) {}
        }
    }
    loadData(value: any) {
        this.qcService.ewo_QC_Result_Setup(value).subscribe((result: any) => {
            if (result.result == EnumStatus.ok) {
                this.dataQC = result.data.result;

                this.inValue.configQC = this.dataQC;

                this.loadItemKPI();
            }
        });
    }
    is_ChangeNote = 0;
    is_ChangeReportStatus = 0;
    item_reportStatus: number = 0;
    splitString(code: string): string[] {
        return code.split(' - ').map((part) => part.trim());
    }
    onUpdateAvatar(table: string, item: any) {
        let id = 0;
        let url = '';
        if (table == 'employee') {
            id = item.employee_id;
        }
        if (table == 'shop') {
            id = item.shop_id;
        }
        url = item.atd_photo;

        this._service
            .Report_ATD_ChooseImageEmployee(id, url, table)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (table == 'employee') {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Notification',
                            detail: 'Update avatars successfully',
                        });
                    }
                    if (table == 'shop') {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Notification',
                            detail: 'Update Image Overview Shop successfully',
                        });
                    }
                }
            });
    }

    copyText(item: any) {
        let val = 'Mã báo cáo: ' + item.report_id + ' - (' + item.UUID + ')';
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.messageService.add({
            severity: 'success',
            summary: 'copy text successfully',
            detail: val,
        });
    }

    imageUpload!: any;
    onUploadImge(event: any, type: string, fulldata: any) {
        this.imageUpload = event.target.files[0];
        // let WriteLabel =
        //     fulldata.project_code + ' - ShopCode: ' + fulldata.shop_code;
        let WriteLabel = 'ShopCode: ' + fulldata.shop_code;
        this.taskService
            .ImageRender(this.imageUpload, this.imageUpload.name)
            .then((file) => {
                this.imageUpload = file;

                const formUploadImageBefore = new FormData();
                formUploadImageBefore.append('files', this.imageUpload);
                formUploadImageBefore.append('ImageType', type);
                formUploadImageBefore.append('WriteLabel', WriteLabel);

                const fileName = AppComponent.generateGuid();
                const newFile = new File(
                    [this.imageUpload],
                    fileName +
                        this.imageUpload.name.substring(
                            this.imageUpload.name.lastIndexOf('.')
                        ),
                    { type: this.imageUpload.type }
                );
                const modun = type;
                const drawText = WriteLabel;
                this._file
                    .FileUpload(
                        newFile,
                        this.project.project_code,
                        modun,
                        drawText
                    )
                    .subscribe(
                        (response: any) => {
                            let url = response.url;
                            this._service
                                .Report_ATDImage_Action(url, fulldata.id)
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        fulldata.atd_photo = url;
                                        this.clearFileInput();
                                    }
                                });
                        },
                        (error: any) => {
                            let url = null;
                        }
                    );
            });
    }
    @ViewChild('myInputImageCheckIN') myInputImageCheckIN: any;
    @ViewChild('myInputImageCheckOUT') myInputImageCheckOUT: any;
    @ViewChild('myInputImageOVERVIEW') myInputImageOVERVIEW: any;

    clearFileInput() {
        try {
            this.myInputImageCheckIN.nativeElement.value = null;
        } catch (error) {}
        try {
            this.myInputImageCheckOUT.nativeElement.value = null;
        } catch (error) {}
        try {
            this.myInputImageOVERVIEW.nativeElement.value = null;
        } catch (error) {}
    }

    selectReportStatus(event: any) {
        this.item_reportStatus = event != null ? event.code : 0;

        try {
            this._service
                .ewo_Report_Action(
                    'change.report_status',
                    this.inValue.report_id,
                    this.item_reportStatus + ''
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Change report status',
                            detail: 'Change report status',
                        });
                        this.is_ChangeReportStatus = 0;
                        this.inValue.report_status = this.item_reportStatus;

                        var splitted = this.splitString(event.name);

                        this.inValue.report_desc = splitted[2];
                        this.inValue.report_status_type = splitted[0];
                        this.inValue.report_status_name = splitted[1];
                    }
                });
        } catch (error) {}
    }
    ReportAction_EmployeeNote(action: string, report_id: number, value: any) {
        this._service
            .ewo_Report_Action(action, report_id, value)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Adjust employee notes',
                        detail: 'Adjust employee notes',
                    });
                    this.is_ChangeNote = 0;
                }
            });
    }
    currentUser: any;
    permission_full = 0;
    requestExplanation = false;
    historyRequest = false;
    dataNoti: any;
    dataRequest: any = {
        note: '',
    };
    loading_save = false;
    type_code = '';
    setData() {
        this.dataNoti = {
            title: '',
            description:
                this.currentUser.employee_name +
                '  yêu cầu giải trình công ngày ' +
                Helper.convertDateStr1(Helper.convertDateInt(new Date())),
            content: '',
        };
    }
    sendRequest() {
        let token = '';
        let check = true;
        this.loading_save = true;
        this.prcService
            .GetTokenByEmpId(this.inValue.employee_id || 0)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    token = data.data.data_token[0].fcm_token || '';
                    if (!Helper.IsNull(data) && token != '') {
                        this.prcService
                            .PushNoti(
                                token,
                                this.type_code,
                                '',
                                this.dataNoti.title,
                                this.dataNoti.content,
                                'WEB',
                                Helper.ProjectID()
                            )
                            .subscribe((data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    this.prcService
                                        .Prc_process_request_explanation(
                                            Helper.ProjectID(),
                                            this.trans_uuid,
                                            this.dataNoti.content,
                                            this.inValue.report_id,
                                            0,
                                            this.filterWorkShift
                                        )
                                        .subscribe((data: any) => {
                                            if (data.result != EnumStatus.ok) {
                                                check = false;
                                            }
                                        });

                                    this.prcService
                                        .Web_Notification_Save(
                                            this.inValue.employee_id,
                                            Helper.ProjectID(),
                                            this.dataNoti.title,
                                            this.dataNoti.description,
                                            this.dataNoti.content,
                                            'explanation_plan',
                                            'WEB'
                                        )
                                        .subscribe((data: any) => {
                                            if (data.result != EnumStatus.ok) {
                                                check = false;
                                                this.setData();
                                            }
                                        });
                                    this.requestExplanation = false;
                                    this.loading_save = false;
                                } else {
                                    check = false;
                                    this.requestExplanation = false;
                                    this.loading_save = false;
                                }

                                if (check == true) {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Thành công',
                                        detail: 'Đã yêu cầu thành công!',
                                    });
                                } else {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Lỗi',
                                        detail: 'Gửi thông báo không thành công!',
                                    });
                                }
                            });
                    }
                }
            });
    }
    viewIamges: boolean = false;
    closeRequest() {
        this.requestExplanation = false;
        this.historyRequest = false;
        this.viewIamges = false;
    }
    checkRequest() {
        this.prcService
            .PrcCheckIsRequest(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok && data.data != false) {
                    this.is_request = true;
                    this.type_code = data.data[0].type_process || '';
                    this.items = [
                        {
                            tooltipOptions: {
                                tooltipLabel: 'Yêu cầu giải trình',
                                tooltipPosition: 'right',
                            },
                            icon: 'pi pi-info-circle',
                            command: () => {
                                this.requestExplanation = true;
                            },
                        },
                        {
                            tooltipOptions: {
                                tooltipLabel: 'Lịch sử yêu cầu',
                                tooltipPosition: 'right',
                            },
                            icon: 'pi pi-history',
                            command: () => {
                                this.historyRequest = true;
                                this.getListRequest();
                            },
                        },
                        {
                            tooltipOptions: {
                                tooltipLabel: 'Hình ảnh nhân viên',
                                tooltipPosition: 'right',
                            },
                            icon: 'pi pi-images',
                            command: () => {
                                this.viewIamges = true;
                            },
                        },
                    ];
                } else {
                    this.items = [
                        {
                            tooltipOptions: {
                                tooltipLabel: 'Hình ảnh nhân viên',
                                tooltipPosition: 'right',
                            },
                            icon: 'pi pi-images',
                            command: () => {
                                this.viewIamges = true;
                            },
                        },
                    ];
                }
            });
    }
    dataHistory: any;
    getListRequest() {
        this.prcService
            .Prc_Request_Explanation_GetList(
                this.inValue.report_id,
                Helper.ProjectID()
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok && data.data != null) {
                    this.dataHistory = data.data.request_Explanation || [];
                    this.dataHistory.forEach((e: any) => {
                        e.emp = e.employee_name + ' (' + e.employee_code + ')';
                        e.transaction_uuid = e.transaction_uuid.toUpperCase();
                    });
                    this.loading = false;
                }
            });
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
    trans_uuid: any = '';
    is_request: any = false;

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    clearHistory(table: Table) {
        table.clear();
        this.searchValue = '';
    }
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }
    ngOnInit(): void {
        this.projectName();
        this.trans_uuid = AppComponent.generateGuid();
        this.checkRequest();
        // this.type_code = 'explanation_plan';

        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];
        this.setData();

        if (
            this.currentUser.employee_type_id == 1 ||
            this.currentUser.employee_type_id == 2 ||
            this.currentUser.employee_type_id == 3
        ) {
            this.permission_full = 1;
            this.isdelete_ATD = 1;
        } else {
            this.permission_full = 0;
            this.isdelete_ATD = 0;
        }

        this.photoService.getImages().then((images) => (this.images = images));

        this.leftTooltipItems = [
            {
                tooltipOptions: {
                    tooltipLabel: 'Adjust employee notes',
                    tooltipPosition: 'top',
                },
                icon: 'pi pi-pencil',
                command: () => {
                    this.is_ChangeNote = 1;
                },
            },
            {
                tooltipOptions: {
                    tooltipLabel: 'Change report status',
                    tooltipPosition: 'top',
                },
                icon: 'pi pi-briefcase',
                command: () => {
                    this.is_ChangeReportStatus = 1;
                },
            },

            {
                tooltipOptions: {
                    tooltipLabel: 'Delete report',
                    tooltipPosition: 'top',
                },
                icon: 'pi pi-trash',
                command: () => {
                    this.confirmationService.confirm({
                        message: 'Are you sure that you want to proceed?',
                        header: 'Confirm',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            this._service
                                .ewo_Report_Action(
                                    'delete.report',
                                    this.inValue.report_id,
                                    '1'
                                )
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        this.messageService.add({
                                            severity: 'error',
                                            summary: 'Delete',
                                            detail: 'Data Deleted',
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
                            return;
                        },
                    });
                    // return;
                },
            },
            {
                tooltipOptions: {
                    tooltipLabel: 'Copy report id',
                    tooltipPosition: 'top',
                },
                icon: 'pi pi-copy',
                command: () => {
                    this.copyText(this.inValue);
                },
            },
            {
                tooltipOptions: {
                    tooltipLabel: 'Reload data report',
                    tooltipPosition: 'top',
                },
                icon: 'pi pi-sync',
                command: () => {
                    this.loadData(this.inValue.report_id);
                },
            },
            {
                tooltipOptions: {
                    tooltipLabel: 'Public Image list',
                    tooltipPosition: 'left',
                },
                icon: 'pi pi-external-link',
                target: '_blank',
                url: '/auth/access/images/' + this.inValue.UUID,
            },
            // {
            //     icon: 'pi pi-upload',
            //     tooltipOptions: {
            //         tooltipLabel: 'Upload',
            //         tooltipPosition: 'left',
            //     },
            // },
            // {
            //     tooltipOptions: {
            //         tooltipLabel: 'Angular Website',
            //         tooltipPosition: 'left',
            //     },
            //     icon: 'pi pi-external-link',
            //     url: 'http://angular.io',
            // },
        ];

        if (this.inValue.show_customer == 0) {
            this.leftTooltipItems.push({
                tooltipOptions: {
                    tooltipLabel: 'Chuyển báo cáo cho page khách hàng',
                    tooltipPosition: 'top',
                },
                icon: 'pi pi-flag',
                command: () => {
                    this.confirmationService.confirm({
                        message: 'Are you sure that you want to proceed?',
                        header: 'Confirm',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            this._service
                                .ewo_Report_Action(
                                    'showcustomer.report',
                                    this.inValue.report_id,
                                    '1'
                                )
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        this.messageService.add({
                                            severity: 'info',
                                            summary: 'Thành công',
                                            detail: 'Đã chuyển báo cáo cho trang khách hàng',
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
                            return;
                        },
                    });
                    // return;
                },
            });
        } else {
            this.leftTooltipItems.push({
                tooltipOptions: {
                    tooltipLabel: 'Thu hồi báo cáo cho page khách hàng',
                    tooltipPosition: 'top',
                },
                icon: 'pi pi-flag-fill',
                command: () => {
                    this.confirmationService.confirm({
                        message: 'Are you sure that you want to proceed?',
                        header: 'Confirm',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            this._service
                                .ewo_Report_Action(
                                    'showcustomer.report',
                                    this.inValue.report_id,
                                    '0'
                                )
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        this.messageService.add({
                                            severity: 'info',
                                            summary: 'Thành công',
                                            detail: 'Đã thu hồi cáo cho trang khách hàng',
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
                            return;
                        },
                    });
                    // return;
                },
            });
        }
    }

    readLoadDataATD(event: any) {
        this.loadDataATD(event.project_id, event.report_id);
    }

    // readData(event: any) {
    //     this.loadDataPromotion(event);
    // }

    checkInfoShop(value: any): any {
        //         latitude
        // longitude
        switch (value) {
            case 'shop_name':
                return 'Tên cửa hàng';
            case 'image':
                return 'Ảnh tổng quan';
            case 'contact_name':
                return 'Tên chủ cửa hàng';
            case 'contact_mobile':
                return 'SĐT chủ cửa hàng';
            case 'province_id':
                return 'Tỉnh/Thành phố';
            case 'district_id':
                return 'Quận/Huyện';
            case 'ward_id':
                return 'Phường/Xã';
            case 'shop_address':
                return 'Địa chỉ';
            case 'latitude':
                return 'Vị trí cửa hàng';
            case 'longitude':
                return 'Vị trí cửa hàng';
            default:
                return 'Thông tin';
        }
    }
    linkMap(latitude: any, longitude: any): any {
        return (
            `https://maps.googleapis.com/maps/api/staticmap?center=` +
            `${latitude},${longitude}&zoom=18&size=600x300&maptype=roadmap&markers=color:red%7Clabel:Shop%7C` +
            `${latitude},${longitude}&markers=color:blue%7Clabel:Marker1%7C` +
            `${latitude},${longitude}&key=AIzaSyAa8HeLH2lQMbPeOiMlM9D1VxZ7pbGQq8o`
        );
    }
}
