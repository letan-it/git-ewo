import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
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

@Component({
    selector: 'app-works-sellout-detail',
    templateUrl: './works-sellout-detail.component.html',
    styleUrls: ['./works-sellout-detail.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class WorksSelloutDetailComponent implements OnInit {
    constructor(
        private _service: ReportsService,
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
        private confirmationService: ConfirmationService
    ) {}
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
    @Output() outValue = new EventEmitter<any>();
    @Output() outReport = new EventEmitter<any>();
    @Output() outTotal = new EventEmitter<any>();

    MapShop: string = '';
    msgs: Message[] = [];
    message: string = '';
    display: boolean = false;

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
            this._service
                .ew_ATT_getItem(this.inValue.project_id, this.inValue.report_id)
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
                        } else {
                            this.message = 'No data';
                            this.display = true;
                        }
                    }
                });
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
                                    representative: {
                                        name: item.question_group,
                                        color: item.color,
                                    },
                                })
                            );

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

        try {
            this.pomService
                .POSM_results_GetItem(
                    this.inValue.project_id,
                    this.inValue.report_id
                )
                .subscribe((data: any) => {
                    this.is_loadForm = 0;
                    if (data.result == EnumStatus.ok) {
                        this.inValue.data_posm = data.data;

                        try {
                            const editData = this.dataQC.filter(
                                (qc: any) => qc.KPI == 'POSM'
                            )[0].is_edit_data;
                            this.inValue.data_posm.is_edit_data = editData;

                            this.inValue.data_posm.posM_Results.forEach(
                                (element: any) => {
                                    try {
                                        element.his = JSON.parse(element.his);
                                        element.now_value = element.values;
                                        element.now_reason_name =
                                            element.reason_name;
                                        element.is_edit_data = editData;
                                    } catch (error) {
                                        element.his = [];
                                    }
                                }
                            );
                        } catch (error) {}
                    }
                });
        } catch (error) {}

        try {
            this.osaService
                .OSA_result_GetItem(this.inValue.report_id, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.inValue.data_osa = data.data;

                        this.inValue.data_osa.osA_Results.forEach(
                            (element: any) => {
                                element.detail =
                                    this.inValue.data_osa.osA_Detail.filter(
                                        (item: any) => item.Guid == element.Guid
                                    );

                                element.sort = [];
                                element.detail.forEach((x: any, index: any) => {
                                    x._oos = x.oos == 1 ? true : false;
                                    x._ooc = x.ooc == 1 ? true : false;

                                    x.representative = {
                                        name: x.category_name_vi,
                                        color:
                                            x.color == ''
                                                ? Helper.colorArray(index)
                                                : x.color,
                                    };

                                    element.sort.push({
                                        label: x.category_name_vi,
                                        value: x.category_name_vi,
                                    });

                                    x.his = JSON.parse(x.his);
                                    if (x.his) {
                                        x.his.forEach((y: any) => {
                                            y._oos = y.oos == 1 ? true : false;
                                            y._ooc = y.ooc == 1 ? true : false;
                                        });
                                    }
                                });
                                const _temp = this.getDistinctObjects(
                                    element.sort,
                                    'value'
                                );
                                element.sort = _temp;
                                element.image =
                                    this.inValue.data_osa.osA_image.filter(
                                        (item: any) => item.Guid == element.Guid
                                    );

                                element.detail.fromOOC =
                                    element.detail.filter(
                                        (x: any) => x.ooc != null
                                    ).length > 0 ||
                                    element.detail[0].check_ooc == 1
                                        ? 1
                                        : 0;
                                element.detail.fromOOS =
                                    element.detail.filter(
                                        (x: any) => x.oos != null
                                    ).length > 0 ||
                                    element.detail[0].check_oos == 1
                                        ? 1
                                        : 0;
                                element.detail.fromQuantity =
                                    element.detail.filter(
                                        (x: any) => x.quantity != null
                                    ).length > 0 ||
                                    element.detail[0].check_qty == 1
                                        ? 1
                                        : 0;
                                element.detail.fromPrice =
                                    element.detail.filter(
                                        (x: any) => x.price != null
                                    ).length > 0 ||
                                    element.detail[0].check_price == 1
                                        ? 1
                                        : 0;
                                element.detail.fromFacing =
                                    element.detail.filter(
                                        (x: any) => x.facing != null
                                    ).length > 0 ||
                                    element.detail[0].check_facing == 1
                                        ? 1
                                        : 0;
                            }
                        );

                        try {
                            const editData = this.dataQC.filter(
                                (qc: any) => qc.KPI == 'OSA'
                            )[0].is_edit_data;
                            this.inValue.data_osa.is_edit_data = editData;

                            this.inValue.data_osa.osA_Results.forEach(
                                (element: any) => {
                                    try {
                                        element.is_edit_data = editData;
                                    } catch (error) {}
                                }
                            );
                        } catch (error) {}
                    }
                });
        } catch (error) {}

        try {
            this.loadDataPromotion(this.inValue.report_id);
        } catch (error) {}

        try {
            this.loadDataSellOut(this.inValue.report_id);
        } catch (error) {}

        try {
            this.loadDataSellIn(this.inValue.report_id);
        } catch (error) {}
        try {
            this.getListProduct();
            this.loadMaster();
            this.loadDataOOL(this.inValue.report_id);
        } catch (error) {}
    }

    loadDataOOL(report_id: any) {
        // this.getListProduct();
        // this.loadMaster();

        this.oolService
            .OOL_Results_GetList(Helper.ProjectID(), report_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.inValue.data_ool = data.data;

                    if (
                        Helper.IsNull(this.inValue.data_ool.details_item) !=
                        true
                    ) {
                        this.inValue.data_ool.details_item =
                            this.inValue.data_ool.details_item.map(
                                (x: any) => ({
                                    ...x,
                                    history:
                                        Helper.IsNull(x.history) != true
                                            ? JSON.parse(x.history)
                                            : [],
                                    question_master:
                                        Helper.IsNull(this.listItemMaster) !=
                                        true
                                            ? this.listItemMaster.filter(
                                                  (element: any) =>
                                                      element.question_type ==
                                                          x.question_type &&
                                                      element.support_data ==
                                                          x.support_data &&
                                                      element.typeOf == x.typeOf
                                              )[0]
                                            : {},
                                    answer_option:
                                        Helper.IsNull(x.answer_option) !=
                                            true && x.answer_option.length > 0
                                            ? JSON.parse(x.answer_option)
                                            : [],
                                    product_option:
                                        Helper.IsNull(this.listProduct) !=
                                            true && this.listProduct.length > 0
                                            ? this.listProduct
                                            : [],
                                })
                            );
                    }

                    if (
                        Helper.IsNull(this.inValue.data_ool.details_item) !=
                        true
                    ) {
                        this.inValue.data_ool.details_item.forEach((x: any) => {
                            if (
                                x.question_type == 'select' ||
                                x.question_type == 'multi-select'
                            ) {
                                x._value_string =
                                    Helper.IsNull(x.answer_option) != true &&
                                    x.answer_option.length > 0 &&
                                    Helper.IsNull(x.value_int) != true
                                        ? x.question_type == 'select'
                                            ? x.answer_option.filter(
                                                  (element: any) =>
                                                      element.ool_answer_id ==
                                                      x.value_int
                                              )[0]
                                            : x.answer_option.filter(
                                                  (element: any) =>
                                                      element.ool_answer_id ==
                                                      x.value_int
                                              )
                                        : [];
                            } else if (
                                x.support_data == 'select-product' ||
                                x.support_data == 'multi-select-product'
                            ) {
                                x._value_string =
                                    Helper.IsNull(x.product_option) != true &&
                                    x.product_option.length > 0 &&
                                    Helper.IsNull(x.value_int) != true
                                        ? x.support_data == 'select-product'
                                            ? x.product_option.filter(
                                                  (element: any) =>
                                                      element.ool_answer_id ==
                                                      x.value_int
                                              )[0]
                                            : x.product_option.filter(
                                                  (element: any) =>
                                                      element.ool_answer_id ==
                                                      x.value_int
                                              )
                                        : [];
                            }

                            if (Helper.IsNull(x.history) != true) {
                                x.history
                                    .filter((c: any) => c.show_history != 1)
                                    .forEach((h: any) => {
                                        if (
                                            Helper.IsNull(h.delete_guild) !=
                                            true
                                        ) {
                                            const _history = x.history.filter(
                                                (x1: any) =>
                                                    x1.show_history == 1
                                            );
                                            _history.forEach((dv: any) => {
                                                if (
                                                    dv.delete_guild ==
                                                    h.delete_guild
                                                ) {
                                                    dv.value_string += `, ${h.value_string}`;
                                                }
                                            });
                                            x.history = _history;
                                        }
                                    });
                            }
                        });
                    }

                    const listMultiSelect =
                        Helper.IsNull(this.inValue.data_ool.details_item) !=
                        true
                            ? this.inValue.data_ool.details_item.filter(
                                  (x: any) =>
                                      x.support_data == null &&
                                      x.question_type == 'multi-select' &&
                                      x.typeOf == 'int'
                              )
                            : [];
                    listMultiSelect
                        .filter((x: any) => x.show_web == 1)
                        .forEach((element: any) => {
                            this.loadValueString(listMultiSelect, element);
                        });

                    const listMultiSelect_Product =
                        Helper.IsNull(this.inValue.data_ool.details_item) !=
                        true
                            ? this.inValue.data_ool.details_item.filter(
                                  (x: any) =>
                                      x.support_data ==
                                          'multi-select-product' &&
                                      x.question_type == 'text' &&
                                      x.typeOf == 'int'
                              )
                            : [];
                    listMultiSelect_Product
                        .filter((x: any) => x.show_web == 1)
                        .forEach((element: any) => {
                            this.loadValueString(
                                listMultiSelect_Product,
                                element
                            );
                        });

                    if (Helper.IsNull(this.inValue.data_ool.details) != true) {
                        this.inValue.data_ool.details.forEach((detail: any) => {
                            detail.resultTooltip = `[${detail.ool_result}] - ${detail.ool_result_code} - ${detail.ool_result_name}`;
                            detail.image =
                                Helper.IsNull(this.inValue.data_ool.image) !=
                                true
                                    ? this.inValue.data_ool.image.filter(
                                          (item: any) =>
                                              item.ool_result_id ==
                                                  detail.ool_result_id &&
                                              item.ool_detail_id ==
                                                  detail.ool_detail_id &&
                                              item.UUID == detail.UUID
                                      )
                                    : [];
                            detail.details_item =
                                Helper.IsNull(
                                    this.inValue.data_ool.details_item
                                ) != true
                                    ? this.inValue.data_ool.details_item.filter(
                                          (item: any) =>
                                              item.ool_result_id ==
                                                  detail.ool_result_id &&
                                              item.ool_detail_id ==
                                                  detail.ool_detail_id &&
                                              item.UUID == detail.UUID
                                      )
                                    : [];
                            detail.detail_ool_toolTip = `[${detail.index_details}] - ${detail.ool_code} - ${detail.ool_name}`;
                        });
                    }

                    this.inValue.data_ool.result.forEach((element: any) => {
                        element.details =
                            Helper.IsNull(this.inValue.data_ool.details) != true
                                ? this.inValue.data_ool.details.filter(
                                      (item: any) =>
                                          item.ool_result_id ==
                                              element.ool_result_id &&
                                          item.UUID == element.UUID
                                  )
                                : [];
                    });

                    try {
                        const editData = this.dataQC.filter(
                            (qc: any) => qc.KPI == 'OOL'
                        )[0].is_edit_data;
                        this.inValue.data_ool.is_edit_data = editData;

                        this.inValue.data_ool.result.forEach((element: any) => {
                            try {
                                element.is_edit_data = editData;
                            } catch (error) {}
                        });
                    } catch (error) {}
                } else {
                    this.inValue.data_ool = [];
                }
            });
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

    loadDataPromotion(report_id: any) {
        this.promotionService
            .Promotion_result_GetList(Helper.ProjectID(), report_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    // this.is_loadForm = 0;
                    this.inValue.data_promotion = data.data;

                    this.inValue.data_promotion.result.forEach(
                        (element: any) => {
                            element.detail =
                                this.inValue.data_promotion.detail.filter(
                                    (item: any) => item.Guid == element.Guild
                                );
                            element.detail.forEach((element: any) => {
                                element.answer_option =
                                    Helper.IsNull(element.answer_option) != true
                                        ? JSON.parse(element.answer_option)
                                        : [];
                                element.detail_item =
                                    Helper.IsNull(element.detail_item) != true
                                        ? JSON.parse(element.detail_item)
                                        : [];

                                if (
                                    element.answer_option.length > 0 &&
                                    Helper.IsNull(element.value_int) != true
                                ) {
                                    element._value_string =
                                        element.answer_option.filter(
                                            (x: any) =>
                                                x.answer_id == element.value_int
                                        )[0];
                                } else {
                                    element._value_string = [];
                                }
                            });
                            const surveyListAnswer = element.detail.filter(
                                (s: any) =>
                                    s.support_data == null &&
                                    s.question_type == 'multi-select' &&
                                    s.typeOf == 'int'
                            );
                            surveyListAnswer
                                .filter((x: any) => x.show_web == 1)
                                .forEach((element: any) => {
                                    element.value_string = [];
                                    surveyListAnswer
                                        .filter(
                                            (x: any) =>
                                                x.pr_item_id ==
                                                    element.pr_item_id &&
                                                x.pr_id == element.pr_id &&
                                                x.item_data ==
                                                    element.item_data &&
                                                x.data_form_survey ==
                                                    element.data_form_survey &&
                                                x.product_id ==
                                                    element.product_id &&
                                                x.question_id ==
                                                    element.question_id
                                        )
                                        .forEach((z: any) => {
                                            element.value_string.push(
                                                z._value_string
                                            );
                                        });

                                    element._listAnswer = '';
                                    element.value_string_info = '';
                                    element.value_string?.forEach((x: any) => {
                                        if (
                                            Helper.IsNull(x.answer_id) != true
                                        ) {
                                            element._listAnswer += `${x.answer_id},`;
                                            element.value_string_info += `${x.value},`;
                                        }
                                    });
                                });

                            const surveyListLocation = element.detail.filter(
                                (s: any) =>
                                    (s.support_data == 'Provinces' ||
                                        s.support_data == 'Districts' ||
                                        s.support_data == 'Wards') &&
                                    s.question_type == 'text' &&
                                    s.typeOf == 'int'
                            );

                            surveyListLocation.forEach((element: any) => {
                                if (element.support_data == 'Provinces') {
                                    element.item_Province = {
                                        name: element.value_string,
                                        code: element.value_int,
                                    };
                                }
                                surveyListLocation
                                    .filter(
                                        (x: any) =>
                                            x.pr_item_id ==
                                                element.pr_item_id &&
                                            x.pr_id == element.pr_id &&
                                            x.item_data == element.item_data &&
                                            x.data_form_survey ==
                                                element.data_form_survey &&
                                            x.product_id == element.product_id
                                    )
                                    .forEach((z: any) => {
                                        if (
                                            z.support_data == 'Districts' &&
                                            element.support_data == 'Provinces'
                                        ) {
                                            z.item_District = {
                                                name: z.value_string,
                                                code: z.value_int,
                                            };
                                            element.item_District =
                                                z.item_District;
                                            z.item_Province =
                                                element.item_Province;

                                            z._idProvince = element.id;
                                            z._idDistrict = z.id;
                                            element._idProvince = element.id;
                                            element._idDistrict = z.id;
                                            z._noteProvince = element.note;
                                            z._noteDistrict = z.note;
                                            element._noteProvince =
                                                element.note;
                                            element._noteDistrict = z.note;
                                        } else if (
                                            z.support_data == 'Wards' &&
                                            element.support_data == 'Provinces'
                                        ) {
                                            z.item_Ward = {
                                                name: z.value_string,
                                                code: z.value_int,
                                            };
                                            element.item_Ward = z.item_Ward;
                                            z.item_Province =
                                                element.item_Province;

                                            z._idProvince = element._idProvince;
                                            z._idDistrict = element._idDistrict;
                                            z._idWard = z.id;
                                            element._idWard = z.id;

                                            z._noteProvince =
                                                element._noteProvince;
                                            z._noteDistrict =
                                                element._noteDistrict;
                                            z._noteWard = z.note;
                                            element._noteWard = z.note;
                                        } else if (
                                            z.support_data == 'Wards' &&
                                            element.support_data == 'Districts'
                                        ) {
                                            z.item_Ward = {
                                                name: z.value_string,
                                                code: z.value_int,
                                            };
                                            element.item_Ward = z.item_Ward;
                                            z.item_District =
                                                element.item_District;

                                            z._idProvince = element._idProvince;
                                            z._idDistrict = element._idDistrict;
                                            z._idWard = z.id;
                                            element._idWard = z.id;

                                            z._noteProvince =
                                                element._noteProvince;
                                            z._noteDistrict =
                                                element._noteDistrict;
                                            z._noteWard = z.note;
                                            element._noteWard = z.note;
                                        } else {
                                        }
                                    });
                            });
                            element.image =
                                this.inValue.data_promotion.image.filter(
                                    (item: any) =>
                                        item.Guid == element.Guild &&
                                        item.question_type != 'audio'
                                );
                            element.audio =
                                this.inValue.data_promotion.image.filter(
                                    (item: any) =>
                                        item.Guid == element.Guild &&
                                        item.question_type == 'audio'
                                );
                        }
                    );
                    this.inValue.data_promotion.result.forEach(
                        (element: any) => {
                            element.detail.forEach((d: any) => {
                                d.history =
                                    Helper.IsNull(d.history) != true
                                        ? JSON.parse(d.history)
                                        : [];

                                d.history
                                    .filter((c: any) => c.show_history != 1)
                                    .forEach((h: any) => {
                                        if (
                                            Helper.IsNull(h.delete_guild) !=
                                            true
                                        ) {
                                            const _history = d.history.filter(
                                                (x: any) => x.show_history == 1
                                            );
                                            _history.forEach((x: any) => {
                                                if (
                                                    x.delete_guild ==
                                                    h.delete_guild
                                                )
                                                    x.value_string += `, ${h.value_string}`;
                                            });
                                            d.history = _history;
                                        }
                                    });
                            });

                            element.detail.survey = element.detail.filter(
                                (item: any) => item.item_data == 'SURVEY'
                            );
                            element.detail.product = element.detail.filter(
                                (item: any) => item.item_data == 'PRODUCT'
                            );
                            element.image.survey = element.image.filter(
                                (item: any) => item.item_data == 'SURVEY'
                            );
                            element.image.product = element.image.filter(
                                (item: any) => item.item_data == 'PRODUCT'
                            );
                            element.audio.survey = element.audio.filter(
                                (item: any) => item.item_data == 'SURVEY'
                            );
                            element.audio.product = element.audio.filter(
                                (item: any) => item.item_data == 'PRODUCT'
                            );

                            const sortSurvey = [] as any;
                            element.detail.survey.forEach(
                                (x: any, index: any) => {
                                    x.representative = {
                                        name: x.survey_name,
                                        color: Helper.colorArray(index + 1),
                                    };

                                    sortSurvey.push({
                                        label: x.survey_name,
                                        value: x.survey_name,
                                    });
                                    x.sort = sortSurvey;

                                    x.question =
                                        this.inValue.data_promotion.question.filter(
                                            (y: any) =>
                                                y.data_form_survey ==
                                                    x.data_form_survey &&
                                                element.promotion_id ==
                                                    y.promotion_id &&
                                                y.item_data == 'SURVEY'
                                        );
                                }
                            );
                            element.detail.productList = [];
                            const _temp = this.getDistinctObjects(
                                element.detail.product,
                                'product_id'
                            );
                            _temp.forEach((x: any, index: any) => {
                                element.detail.productList.push({
                                    product_id: x.product_id,
                                    color: Helper.colorArray(index),
                                });
                            });

                            const sortProduct = [] as any;
                            element.detail.product.forEach((x: any) => {
                                x.representative = {
                                    name:
                                        x.product_code + ' - ' + x.product_name,
                                    value:
                                        x.product_code + ' - ' + x.product_name,

                                    image: x.product_image,
                                    color: element.detail.productList.filter(
                                        (y: any) => y.product_id == x.product_id
                                    )[0].color,
                                };

                                sortProduct.push({
                                    label:
                                        x.product_code + ' - ' + x.product_name,
                                    value:
                                        x.product_code + ' - ' + x.product_name,
                                });

                                x.sort = sortProduct;

                                x.question =
                                    this.inValue.data_promotion.question.filter(
                                        (y: any) =>
                                            y.data_form_survey ==
                                                x.data_form_survey &&
                                            y.product_id == x.product_id &&
                                            element.promotion_id ==
                                                y.promotion_id &&
                                            y.item_data == 'PRODUCT'
                                    );
                            });
                            const photoImageSurvey = [];
                            const listImageSurvey =
                                (element.image as any) == ([] as any)
                                    ? []
                                    : element.image.survey;
                            // pr_id: 2
                            if (
                                Helper.IsNull(listImageSurvey) != true &&
                                listImageSurvey.length > 0
                            ) {
                                for (
                                    var i = 0;
                                    i < listImageSurvey.length;
                                    i++
                                ) {
                                    photoImageSurvey.push({
                                        id: i + 1,
                                        _id: listImageSurvey[i].id,
                                        pr_item_id:
                                            listImageSurvey[i].pr_item_id,
                                        pr_id: listImageSurvey[i].pr_id,
                                        question_id:
                                            listImageSurvey[i].question_id,
                                        src: listImageSurvey[i].url,
                                        title: `${listImageSurvey[i].question_name} - ${listImageSurvey[i].image_time}`,
                                        question_name:
                                            listImageSurvey[i].question_name,
                                        item_data: listImageSurvey[i].item_data,
                                        survey: listImageSurvey[i].survey_name,
                                        image_time:
                                            listImageSurvey[i].image_time,
                                        _index: i + 1,
                                    });
                                }
                            }

                            const photoImageProduct = [];
                            const listImageProduct =
                                (element.image as any) == ([] as any)
                                    ? []
                                    : element.image.product;
                            // pr_id: 2
                            if (
                                Helper.IsNull(listImageProduct) != true &&
                                listImageProduct.length > 0
                            ) {
                                for (
                                    var i = 0;
                                    i < listImageProduct.length;
                                    i++
                                ) {
                                    photoImageProduct.push({
                                        id: i + 1,
                                        _id: listImageProduct[i].id,
                                        pr_item_id:
                                            listImageProduct[i].pr_item_id,
                                        pr_id: listImageProduct[i].pr_id,
                                        question_id:
                                            listImageProduct[i].question_id,
                                        src: listImageProduct[i].url,
                                        title: `${listImageProduct[i].question_name} - ${listImageProduct[i].image_time}`,
                                        question_name:
                                            listImageProduct[i].question_name,
                                        item_data:
                                            listImageProduct[i].item_data,
                                        product: `${listImageProduct[i].product_code} - ${listImageProduct[i].product_name}`,
                                        image_time:
                                            listImageProduct[i].image_time,
                                        _index: i + 1,
                                    });
                                }
                            }

                            element.image.survey.listphotoImage =
                                photoImageSurvey;
                            element.image.product.listphotoImage =
                                photoImageProduct;
                        }
                    );

                    try {
                        const editData = this.dataQC.filter(
                            (qc: any) => qc.KPI == 'DISPLAY'
                        )[0].is_edit_data;
                        this.inValue.data_promotion.is_edit_data = editData;

                        this.inValue.data_promotion.result.forEach(
                            (element: any) => {
                                try {
                                    element.is_edit_data = editData;
                                } catch (error) {}
                            }
                        );
                    } catch (error) {}
                } else {
                    this.inValue.data_promotion = [];
                }
            });
    }

    loadDataSellOut(report_id: any) {
        this.sellOutService
            .SellOut_Result_GetList(Helper.ProjectID(), report_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.inValue.data_sellOut = data.data;
                    this.inValue.data_sellOut.result.forEach((r: any) => {
                        r.details = this.inValue.data_sellOut.details.filter(
                            (d: any) => d.sellout_id == r.sellout_id
                        );
                        r.image = this.inValue.data_sellOut.image.filter(
                            (i: any) => i.sellout_id == r.sellout_id
                        );
                        r.master =
                            Helper.IsNull(this.inValue.data_sellOut.master) !=
                            true
                                ? this.inValue.data_sellOut.master
                                : [];

                        r._comfirm_status =
                            r.comfirm_status == 1 ? true : false;
                        r.history_confirm =
                            Helper.IsNull(r.history_confirm) != true
                                ? JSON.parse(r.history_confirm)
                                : [];
                        // r._master = (Helper.IsNull(r.master) != true) ? (r.master.filter((x: any) => x.Id == r.comfirm_status) ? r.master.filter((x: any) => x.Id == r.comfirm_status) : r.master) : []
                        // r.buttonMaster = (r._master && r._master.length > 0) ? true : false

                        let sumTotal = 0;
                        const listProduct = [] as any;
                        r.details.forEach((item: any) => {
                            item.comfirm = `Confirm By: [${item.comfirm_by}] - ${item.comfirm_code} - ${item.comfirm_name} | Comfirm Date: ${item.comfirm_date}`;
                            item._category = `[${item.category_id}] - ${item.category_name} - ${item.category_name_vi}`;
                            item._product = `[${item.product_id}] - ${item.product_code} - ${item.product_name}`;

                            item.history =
                                Helper.IsNull(item.history) != true
                                    ? JSON.parse(item.history)
                                    : [];
                            item.total = this.total(item.quantity, item.price);
                            sumTotal += item.total;
                            listProduct.push({
                                id: item.id,
                                name: `[${item.product_id}] - ${item.product_code} - ${item.product_name}`,
                            });
                            if (Helper.IsNull(item.history) != true) {
                                item.history = item.history.map((h: any) => ({
                                    ...h,
                                    total: this.total(h.quantity, h.price),
                                }));
                            }
                        });
                        r.details.sumTotal = sumTotal;
                        r.details.listProduct = listProduct;

                        const listphotoImage = [] as any;
                        const listImage = r.image;
                        if (
                            Helper.IsNull(listImage) != true &&
                            listImage &&
                            listImage.length > 0
                        ) {
                            for (var i = 0; i < listImage.length; i++) {
                                listphotoImage.push({
                                    id: i + 1,
                                    src: listImage[i].url,
                                    title: `[${listImage[i].product_id}] - ${listImage[i].product_code} - ${listImage[i].product_name} | ${listImage[i].app_time} `,
                                    product: `[${listImage[i].product_id}] - ${listImage[i].product_code} - ${listImage[i].product_name}`,
                                    alt: listImage[i].alt,
                                    image_time: listImage[i].app_time,
                                    _idDetails: listImage[i].id,
                                });
                            }
                        }
                        if (Helper.IsNull(r.image) != true) {
                            r.image.listphotoImage =
                                Helper.IsNull(listphotoImage) != true
                                    ? listphotoImage
                                    : [];
                        }
                    });

                    try {
                        const editData = this.dataQC.filter(
                            (qc: any) => qc.KPI == 'SELLOUT'
                        )[0].is_edit_data;
                        this.inValue.data_sellOut.is_edit_data = editData;
                    } catch (error) {}
                } else {
                    this.inValue.data_sellOut = [];
                }
            });
    }

    loadDataSellIn(report_id: any) {
        this.sellInService
            .SellIn_Result_GetList(Helper.ProjectID(), report_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.inValue.data_sellIn = data.data;
                    this.inValue.data_sellIn.result.forEach((r: any) => {
                        r.details = this.inValue.data_sellIn.details.filter(
                            (d: any) => d.sellin_id == r.sellin_id
                        );
                        r.image = this.inValue.data_sellIn.image.filter(
                            (i: any) => i.sellin_id == r.sellin_id
                        );
                        r.master =
                            Helper.IsNull(this.inValue.data_sellIn.master) !=
                            true
                                ? this.inValue.data_sellIn.master
                                : [];

                        r._comfirm_status =
                            r.comfirm_status == 1 ? true : false;
                        r.history_confirm =
                            Helper.IsNull(r.history_confirm) != true
                                ? JSON.parse(r.history_confirm)
                                : [];

                        const listImageType = [] as any;
                        if (
                            Helper.IsNull(
                                this.inValue.data_sellIn.type_image
                            ) != true
                        ) {
                            this.inValue.data_sellIn.type_image.forEach(
                                (t: any) => {
                                    listImageType.push({
                                        id: t.Id,
                                        code: t.Code,
                                        name: `${t.Code} - ${t.NameVN}`,
                                    });
                                }
                            );
                        }
                        let sumTotal = 0;
                        const listProduct = [] as any;
                        r.details.forEach((item: any) => {
                            item.comfirm = `Confirm By: [${item.comfirm_by}] - ${item.comfirm_code} - ${item.comfirm_name} | Comfirm Date: ${item.comfirm_date}`;
                            item._category = `[${item.category_id}] - ${item.category_name} - ${item.category_name_vi}`;
                            item._product = `[${item.product_id}] - ${item.product_code} - ${item.product_name}`;

                            item.history =
                                Helper.IsNull(item.history) != true
                                    ? JSON.parse(item.history)
                                    : [];
                            item.total = this.total(item.quantity, item.price);
                            sumTotal += item.total;
                            listProduct.push({
                                id: item.id,
                                product_id: item.product_id,
                                name: `[${item.product_id}] - ${item.product_code} - ${item.product_name}`,
                            });
                            if (Helper.IsNull(item.history) != true) {
                                item.history = item.history.map((h: any) => ({
                                    ...h,
                                    total: this.total(h.quantity, h.price),
                                }));
                            }
                        });
                        r.details.sumTotal = sumTotal;
                        r.details.listProduct = listProduct;
                        r.details.listImageType = listImageType;

                        const listphotoImage = [] as any;
                        const listImage = r.image;
                        // NameVN
                        if (
                            Helper.IsNull(listImage) != true &&
                            listImage &&
                            listImage.length > 0
                        ) {
                            for (var i = 0; i < listImage.length; i++) {
                                listphotoImage.push({
                                    id: i + 1,
                                    src: listImage[i].url,
                                    title:
                                        Helper.IsNull(
                                            listImage[i].product_id
                                        ) != true
                                            ? `[${listImage[i].product_id}] - ${listImage[i].product_code} - ${listImage[i].product_name} | ${listImage[i].app_time} `
                                            : `${listImage[i].image_type} - ${listImage[i].NameVN} | ${listImage[i].app_time}`,
                                    product:
                                        Helper.IsNull(
                                            listImage[i].product_id
                                        ) != true
                                            ? `[${listImage[i].product_id}] - ${listImage[i].product_code} - ${listImage[i].product_name}`
                                            : null,
                                    alt: listImage[i].alt,
                                    image_time: listImage[i].app_time,
                                    _idDetails: listImage[i].id,
                                    image_type: listImage[i].image_type,
                                    type: `${listImage[i].image_type} - ${listImage[i].NameVN}`,
                                });
                            }
                        }
                        if (Helper.IsNull(r.image) != true) {
                            r.image.listphotoImage =
                                Helper.IsNull(listphotoImage) != true
                                    ? listphotoImage
                                    : [];
                        }
                    });

                    try {
                        const editData = this.dataQC.filter(
                            (qc: any) => qc.KPI == 'SELLIN'
                        )[0].is_edit_data;
                        this.inValue.data_sellIn.is_edit_data = editData;
                    } catch (error) {}
                } else {
                    this.inValue.data_sellIn = [];
                }
            });
    }

    resetLoadData(event: any) {
        this.outReport.emit(event);
        this.loadDataSellOut(event);
    }
    resetLoadTotal(event: any) {
        this.outTotal.emit(event);
    }
    resetDataSellOut() {
        this.outValue.emit(true);
    }

    resetLoadDataSellIn(event: any) {
        this.loadDataSellIn(event);
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
        //   fulldata.project_code + ' - ShopCode: ' + fulldata.shop_code;
        let WriteLabel = 'ShopCode: ' + fulldata.shop_code;
        this.taskService
            .ImageRender(this.imageUpload, this.imageUpload.name)
            .then((file) => {
                this.imageUpload = file;

                const formUploadImageBefore = new FormData();
                formUploadImageBefore.append('files', this.imageUpload);
                formUploadImageBefore.append('ImageType', type);
                formUploadImageBefore.append('WriteLabel', WriteLabel);
                // this._file
                //   .UploadImage(formUploadImageBefore)
                //   .subscribe((data: any) => {
                //     if (data.result == EnumStatus.ok) {
                //       let url = EnumSystem.fileLocal + data.data;
                //       this._service
                //         .Report_ATDImage_Action(url, fulldata.id)
                //         .subscribe((data: any) => {
                //           if (data.result == EnumStatus.ok) {
                //             fulldata.atd_photo = url;
                //             this.clearFileInput();
                //           }
                //         });
                //     }
                //   });

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
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }

    ngOnInit(): void {
        this.projectName();
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];

        if (
            this.currentUser.employee_type_id == 1 ||
            this.currentUser.employee_type_id == 2 ||
            this.currentUser.employee_type_id == 3
        ) {
            this.permission_full = 1;
        } else {
            this.permission_full = 0;
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
    }

    readData(event: any) {
        this.loadDataPromotion(event);
    }

    readDataOOL(event: any) {
        this.loadDataOOL(event);
    }

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
