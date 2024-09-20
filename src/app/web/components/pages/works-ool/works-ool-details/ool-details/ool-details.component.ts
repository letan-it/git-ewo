import { DatePipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ScriptLoaderService } from 'src/app/web/service/ScriptLoaderService.service';
import { FileService } from 'src/app/web/service/file.service';
import { OolService } from 'src/app/web/service/ool.service';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { SurveyService } from 'src/app/web/service/survey.service';

interface City {
    name: string;
    code: string;
}
interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-ool-details',
    templateUrl: './ool-details.component.html',
    styleUrls: ['./ool-details.component.scss'],
    providers: [ConfirmationService, DatePipe, MessageService],
})
export class OolDetailsComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private _service: OolService,
        private messageService: MessageService,
        private taskService: TaskFileService,
        private _file: FileService,
        private datePipe: DatePipe,
        private confirmationService: ConfirmationService,
        private surveyService: SurveyService,
        private scriptLoaderService: ScriptLoaderService
    ) {}

    items: { label?: string; icon?: string; separator?: boolean }[] = [];

    cities!: any[];
    selectedCities!: any[];

    ngOnInit() {
        this.loadMaster();
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' },
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' },
        ];
    }

    loading: boolean = false;

    listItemMaster: any = [];
    loadMaster() {
        this._service
            .OOL_item_Master(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
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

    selectQuestionMaster(event: any) {
        console.log('event : ', event.value);
    }

    chooseSelectButton(event: any, item: any) {
        item.value_int = event.option.value_int;
    }
    chooseSelect(event: any, item: any) {
        item.value_int = event != null ? event?.value?.ool_answer_id : null;
        item.value_string = event != null ? event?.value?.value : null;

        console.log('chooseSelect : ', item.value_int, item.value_string);
    }

    chooseSelectProduct(event: any, item: any) {
        item.value_int = event != null ? event?.value?.ool_answer_id : null;
        item.value_string = event != null ? event?.value?.product_name : null;

        console.log(
            'chooseSelectProduct : ',
            item.value_int,
            item.value_string
        );
    }

    chooseMultiSelect(event: any, item: any) {
        this.actionListAnswer(event.value, item);
    }

    actionListAnswer(list: any, item: any) {
        item._listAnswer = '';
        item.value_string_info = '';
        list?.forEach((element: any) => {
            if (Helper.IsNull(element.ool_answer_id) != true) {
                item._listAnswer += `${element.ool_answer_id},`;
                item.value_string_info += `${element.value},`;
            }
        });
    }

    patternDecimal: RegExp = /^\d*\.?\d*$/;
    datetime: any;
    stateOptions: any = [];

    checkValue(support_data: any, question_type: any, typeOf: any): any {
        if (
            support_data == 'int' &&
            question_type == 'number' &&
            typeOf == 'int'
        ) {
            // int	number	int
            return 2;
        } else if (
            support_data == 'decimal' &&
            question_type == 'number' &&
            typeOf == 'decimal'
        ) {
            //decimal	number	decimal
            return 3;
        } else if (
            support_data == 'date' &&
            question_type == 'text' &&
            typeOf == 'string'
        ) {
            //date	text	string
            return 4;
        } else if (
            support_data == 'datetime' &&
            question_type == 'text' &&
            typeOf == 'string'
        ) {
            return 5;
        } else if (
            (support_data == 'Yes-No' || support_data == 'Right-Wrong') &&
            question_type == 'check' &&
            typeOf == 'int'
        ) {
            if (support_data == 'Yes-No') {
                this.stateOptions = [
                    { label: 'Có', value: 'Có', value_int: 1 },
                    { label: 'Không', value: 'Không', value_int: 0 },
                ];
            } else {
                this.stateOptions = [
                    { label: 'Đúng', value: 'Đúng', value_int: 1 },
                    { label: 'Sai', value: 'Sai', value_int: 0 },
                ];
            }
            return 6;
        } else if (
            support_data == null &&
            question_type == 'select' &&
            typeOf == 'int'
        ) {
            return 7;
        } else if (
            support_data == null &&
            question_type == 'multi-select' &&
            typeOf == 'int'
        ) {
            return 8;
        } else if (
            support_data == 'Provinces' &&
            question_type == 'text' &&
            typeOf == 'int'
        ) {
            return 9;
        } else if (
            support_data == 'Districts' &&
            question_type == 'text' &&
            typeOf == 'int'
        ) {
            return 10;
        } else if (
            support_data == 'Wards' &&
            question_type == 'text' &&
            typeOf == 'int'
        ) {
            return 11;
        } else if (
            support_data == null &&
            question_type == 'final' &&
            typeOf == 'int'
        ) {
            return 12;
        } else if (
            support_data == null &&
            question_type == 'image' &&
            typeOf == 'string'
        ) {
            return 13;
        } else if (
            support_data == 'string' &&
            question_type == 'qr' &&
            typeOf == 'string'
        ) {
            return 14;
        } else if (
            support_data == 'select-product' &&
            question_type == 'text' &&
            typeOf == 'int'
        ) {
            return 15;
        } else if (
            support_data == 'multi-select-product' &&
            question_type == 'text' &&
            typeOf == 'int'
        ) {
            return 16;
        } else {
            return 1;
        }
        /*
    text	select-product	int	Chọn sản phẩm
text	multi-select-product	int	Chọn nhiều sản phẩm 
    */
    }

    products!: any[];
    statuses!: any[];
    clonedProducts: { [s: string]: any } = {};

    onRowEditInit(item: any) {}

    onRowEditSave(tab: any, item: any) {
        const checkType = this.checkValue(
            item.support_data,
            item.question_type,
            item.typeOf
        );
        console.log(' Item : ', item);
        console.log('checkType : ', checkType);
        console.log(
            'checkType : ',
            Helper.ProjectID(),
            item.ool_item_id,
            item.value_string,
            item.value_int,
            item.value_decimal,
            'update'
        );

        if (checkType == 3) {
            item.value_string = item.value_decimal + '';
        } else if (checkType == 2) {
            item.value_string = item.value_int + '';
        }
        // 7 - 15
        // checkType != 8 && checkType != 16 &&
        if (
            this.NofiIsNull(item.value_string, 'value') == 1 ||
            (checkType == 3 &&
                this.NofiDecimal(item.value_string, 'Value') == 1) ||
            (checkType == 2 &&
                this.checkNumber(parseInt(item.value_string), 'Value') == 1)
        ) {
            return;
        } else {
            if (checkType == 8 || checkType == 16) {
                this.editMultiSelect(tab, item);
            } else {
                this._service
                    .OOL_Detail_items_Action(
                        Helper.ProjectID(),
                        item.id,
                        item.value_string,
                        item.value_int,
                        item.value_decimal,
                        'update'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.NofiResult(
                                `Page Works`,
                                `Edit question information`,
                                `Successfully editing information ( Question : ${item.ool_item_name} , Value : ${item.value_string} )`,
                                `success`,
                                `Successfull`
                            );
                        } else {
                            this.NofiResult(
                                `Page Works`,
                                `Edit question information`,
                                `Error editing information ( Question : ${item.ool_item_name} , Value : ${item.value_string} )`,
                                `error`,
                                `Error`
                            );
                        }
                        this.clearAction(tab);
                    });
            }
        }
        return;
    }
    clearAction(tab: any) {
        this.outValue.emit(tab.report_id);
    }

    listMultiSelect: any = [];
    editMultiSelect(tab: any, item: any) {
        const data = [] as any;
        if (Helper.IsNull(item.value_string) != true) {
            item.value_string.forEach((element: any) => {
                data.push({
                    value_string: element.value,
                    value_int: element.ool_answer_id,
                    value_decimal: null,
                });
            });
        }
        if (Helper.IsNull(data) != true) {
            this._service
                .OOL_Detail_items_MultiAction(
                    item.ool_detail_id,
                    item.layer,
                    item.ool_item_id,
                    item.ool_item_name,
                    item.question_type,
                    item.support_data,
                    item.typeOf,
                    data
                )
                .subscribe((result: any) => {
                    if (result.result == EnumStatus.ok) {
                        let value = '';
                        data.forEach((element: any, index: any) => {
                            if (index < data.length - 1) {
                                value += `${element.value_string}, `;
                            } else {
                                value += `${element.value_string}`;
                            }
                        });

                        this.NofiResult(
                            `Page Works`,
                            `Edit question information`,
                            `Successfully editing information ( Question : ${item.ool_item_name} , Value : ${value} )`,
                            `success`,
                            `Successfull`
                        );
                    } else {
                        this.NofiResult(
                            `Page Works`,
                            `Edit question information`,
                            `Error editing information ( Question : ${item.ool_item_name})`,
                            `error`,
                            `Error`
                        );
                    }
                    this.clearAction(tab);
                });
        }
    }
    onRowEditCancel(item: any, index: number) {}

    calculateItemTotal(list: any, name: string) {
        let total = 0;

        if (list) {
            for (let item of list) {
                if (item.layer === name) {
                    total++;
                }
            }
        }

        return total;
    }

    urlgallery: any;
    showImageProduct(url: any) {
        this.urlgallery = url;
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    Nofi(severity: any, summary: any, name: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
        });
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

    NofiDecimal(value: any, name: any): any {
        let check = 0;
        if (Pf.checkDecimal(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }

    checkNumber(value: any, name: any): any {
        if (Helper.number(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
    }

    NofiDecimal1(value: any, name: any): any {
        let check = 0;
        if (Pf.checkDecimal(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }

    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (value == 0) {
            value += '';
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
    IsNull(value: any): any {
        return Helper.IsNull(value);
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

    checkNotExists(list: any): any {
        return list && list.length == 0 ? true : false;
    }

    getDistinctObjects(dataList: any, property: any) {
        const uniqueValues = new Set();
        this.sortedArray(dataList);

        return dataList.filter((obj: any) => {
            const value = obj[property];
            if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                return true;
            }
            return false;
        });
    }

    sortedArray(list: any): any {
        list.sort((n1: any, n2: any) => {
            if (n1.value > n2.value) {
                return 1;
            }
            if (n1.value < n2.value) {
                return -1;
            }
            return 0;
        });
    }

    getSeverity(status: string): any {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    }

    getIconTag(value: any): any {
        switch (value) {
            case 1:
                return 'pi pi-check';
            case 0:
                return 'pi pi-times';
            default:
                return 'pi pi-exclamation-triangle';
        }
    }
}
