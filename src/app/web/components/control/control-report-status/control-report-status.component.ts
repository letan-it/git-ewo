import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { MastersService } from 'src/app/web/service/masters.service';
import { Helper } from 'src/app/Core/_helper';
@Component({
    selector: 'app-control-report-status',
    templateUrl: './control-report-status.component.html',
    styleUrls: ['./control-report-status.component.scss'],
})
export class ControlReportStatusComponent {
    constructor(private _service: MastersService) { }
    isLoadForm = 1;
    selectedReportStatus: any;
    listReportStatus: any;
    @Output() outValue = new EventEmitter<string>();

    // placeholder="Select a ReportStatus"
    @Input() itemReportStatus!: number;
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
    nameReportStatus: string = 'Select a ReportStatus';

    ngOnInit() {
        try {
            this.isLoadForm = 1;
            this.listReportStatus = [];
            this._service
                .ewo_GetReportStatus(Helper.ProjectID())
                .subscribe((data: any) => {
                    this.isLoadForm = 0;
                    if (data.result == EnumStatus.ok) {
                        data.data.forEach((element: any) => {
                            if (element.status == 1) {
                                this.listReportStatus.push({
                                    name:
                                        element.report_status_type +
                                        ' - ' +
                                        element.report_status_name +
                                        (element.report_desc != null
                                            ? ' - ' + element.report_desc
                                            : ''),

                                    code: element.report_status_id,
                                });
                            }

                        });

                    }
                });
        } catch (error) { }
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
