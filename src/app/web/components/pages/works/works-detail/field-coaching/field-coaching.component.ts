import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivationService } from 'src/app/web/service/activation.service';
import { SosService } from '../../../sos/services/sos.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';
import { FieldCoachingService } from 'src/app/web/service/field-coaching.service';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
@Component({
    selector: 'app-field-coaching',
    templateUrl: './field-coaching.component.html',
    styleUrls: ['./field-coaching.component.scss'],
})
export class FieldCoachingComponent implements OnInit {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private _service: FieldCoachingService,
        private messageService: MessageService
    ) {}

    activeIndex: number = 0;
    scrollableTabs: any[] = Array.from({ length: 5 }, (_, i) => ({
        title: 'Title',
        content: 'Content',
    }));

    ngOnInit(): void {
        console.log(this.inValue);
        if (this.inValue !== null && this.inValue !== undefined) {
            this.processData(this.inValue);
        }
    }

    //listInValue: any = []
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue']) {
            if (Helper.IsNull(this.inValue) != true) {
                this.processData(this.inValue);
            }
        }
    }

    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }
    customers: any = [];
    processData(result: any) {
        if (!Helper.IsNull(result) && !Helper.IsNull(result.work))
            result.listData = [];
        const listEmp = [] as any;
        result.work.forEach((element: any) => {
            listEmp.push({
                employee_id: element.employee_id,
                employee_code: element.employee_code,
                employee_name: element.employee_name,
                employee_mobile: element.employee_mobile,
                employee_image: element.employee_image,
            });
        });
        result.listData = this.getDistinctObjects(listEmp, 'employee_id');
        if (!Helper.IsNull(result.listData) && !Helper.IsNull(result.work)) {
            result.listData.forEach((element: any) => {
                element.work = !Helper.IsNull(element)
                    ? result.work.filter(
                          (w: any) => w.employee_id == element.employee_id
                      )
                    : [];

                if (!Helper.IsNull(element.work) && element.work.length > 0) {
                    element.work.forEach((ew: any) => {
                        ew.textCheck = this.textCheck(ew.confirm_result);
                        ew.pTooltip_confirm_result = `[${ew.confirm_result}] - ${ew.confirm_result_name} - ${ew.confirm_note}`;
                        ew.detail =
                            Helper.IsNull(result.detail) != true
                                ? result.detail.filter(
                                      (w: any) => w.work_id == ew.work_id
                                  )
                                : [];
                        ew.files =
                            Helper.IsNull(result.file) != true
                                ? result.file.filter((w: any) => {
                                      return w.work_id == ew.work_id;
                                  })
                                : [];
                    });
                }
            });
        }
    }
    searchValue: string | undefined;
    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    textCheck(result: any): any {
        switch (result) {
            case 1:
                return true;
            default:
                return false;
        }
    }

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

    getDistinct(items: any): any {
        return items.filter(
            (item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => t === item)
        );
    }
    getSeverityResult(reuslt: any): any {
        switch (reuslt) {
            case 1:
                return 'success';
            case 2:
                return 'info';

            default:
                return 'warning';
        }
    }

    urlgallery: any;
    showImage(url: any) {
        this.urlgallery = url;
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }
}
