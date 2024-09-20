import {
    AfterViewInit,
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
import { PrcsService } from '../../service/prcs.service';
import { Representative } from 'src/app/web/models/customer';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-prc-working-plan',
    templateUrl: './working-plan.component.html',
    styleUrls: ['./working-plan.component.scss'],
})
export class WorkingPlanComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();
    @Input() type: any;

    constructor(
        private messageService: MessageService,
        private _service: PrcsService
    ) {}
    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;
    data: any = [];
    ngOnChanges(changes: SimpleChanges): void {
        if (this.type == 1) {
            this.type = 'WORKING_PLAN';
        } else if (this.type == 2) {
            this.type = 'REMOVE_PLAN';
        } else if (this.type == 3) {
            this.type = 'ADD_RESULT_PLAN';
        } else if (this.type == 4) {
            this.type = 'PLAN_OFF';
        } else if (this.type == 5) {
            this.type = 'OT_PLAN';
        } else if (this.type == 6) {
            this.type = 'CHANGE_PLAN';
        }
        if (changes['inValue']) {
            if (!Helper.IsNull(this.inValue)) {
                this._service
                    .Prc_ProjectGetRequestDetail(
                        Helper.ProjectID(),
                        this.inValue.request_id
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.data = data.data;
                            if (this.type == 'WORKING_PLAN') {
                                this.data.detail.forEach((e: any) => {
                                    e.date =
                                        Helper.convertDateStr1(e.plan_date) ||
                                        '';
                                    let from = '';
                                    if (!Helper.IsNull(e.from_time)) {
                                        from = e.from_time.split(' ')[1];
                                        // e.date = e.from_time.split(' ')[0];
                                    }

                                    let to = '';
                                    if (!Helper.IsNull(e.to_time)) {
                                        to = e.to_time.split(' ')[1];
                                    }
                                    e.shift_code =
                                        e.shift_code +
                                        (from != ''
                                            ? '(' +
                                                  from.slice(0, 5) +
                                                  '-' +
                                                  to.slice(0, 5) +
                                                  ')' || ''
                                            : '');
                                    const isDay =
                                        new Date(e.from_time).getDate() <
                                        new Date(e.to_time).getDate();
                                    e.isDay = isDay == true ? '(Qua ngày)' : '';
                                });
                            } else if (this.type == 'REMOVE_PLAN') {
                                this.data.detail.forEach((e: any) => {
                                    e.date = Helper.convertDateStr(e.plan_date);
                                });
                            } else if (this.type == 'ADD_RESULT_PLAN') {
                                this.data.detail = data.data.add_atd_result;
                                this.data.detail.forEach((e: any) => {
                                    e.atd_time = e.atd_time.replace('T', ' ');
                                });
                            } else if (this.type == 'PLAN_OFF') {
                                this.data.detail = data.data.leave_detail;
                                this.data.detail.forEach((e: any) => {
                                    e.leave_date = Helper.convertDateStr(
                                        e.leave_date
                                    );
                                    e.leave_date_to = Helper.convertDateStr(
                                        e.leave_date_to
                                    );
                                    e.leave_value =
                                        e.leave_value > 1
                                            ? e.leave_value + ' ngày'
                                            : 'Nữa ngày';
                                });
                            } else if (this.type == 'OT_PLAN') {
                                this.data.detail = data.data.ot_detail;
                                this.data.detail.forEach((e: any) => {
                                    e.from_time = e.from_time
                                        ? e.from_time.replace('T', ' ')
                                        : '';
                                    e.to_time = e.to_time
                                        ? e.to_time.replace('T', ' ')
                                        : '';
                                });
                            } else if (this.type == 'CHANGE_PLAN') {
                                this.data.detail = data.data.change_plan_detail;
                                this.data.detail.forEach((e: any) => {
                                    e.shop =
                                        e.shop_code + ' --> ' + e.new_shop_code;
                                    e.shift =
                                        e.shift_code +
                                        ' --> ' +
                                        e.new_shift_code;
                                    e.date =
                                        e.plan_date + ' --> ' + e.new_plan_date;
                                    e.time =
                                        '(' +
                                        e.from_time +
                                        '-' +
                                        e.to_time +
                                        ')' +
                                        ' --> ' +
                                        '(' +
                                        e.new_from_time +
                                        '-' +
                                        e.new_to_time +
                                        ')';
                                });
                            }

                            this.loading = false;
                        } else {
                            this.data = [];
                        }
                    });
            }
        }
    }
    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }
}
