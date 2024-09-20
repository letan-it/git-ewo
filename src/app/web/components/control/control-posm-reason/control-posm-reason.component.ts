import {
    Component,
    Output,
    Input,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { PosmService } from 'src/app/web/service/posm.service';

@Component({
    selector: 'app-control-posm-reason',
    templateUrl: './control-posm-reason.component.html',
    styleUrls: ['./control-posm-reason.component.scss'],
})
export class ControlPosmReasonComponent {
    constructor(private _service: PosmService) {}
    @Output() outValue = new EventEmitter<string>();
    @Input() itemPosmReason: number = 0;
    isLoadForm = 1;
    listReason: any = [];
    selectedReason: any = '';

    loadData() {
        this.isLoadForm = 1;
        this._service
            .GetPOSM_Reason(Helper.ProjectID())
            .subscribe((data: any) => {
                this.isLoadForm = 0;
                this.listReason = [];
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        //    {
                        //     "reason_id": 13,
                        //     "reason_name": "Lý do 1",

                        //     "status": 1
                        // },
                        data.data.forEach((element: any) => {
                            if (element.status == 1) {
                                this.listReason.push({
                                    code: element.reason_id,
                                    name:
                                        element.reason_id +
                                        ' - ' +
                                        element.reason_name,
                                });
                            }
                        });

                        if (this.itemPosmReason != 0) {
                            this.selectedReason = this.listReason.filter(
                                (data: any) => data.code == this.itemPosmReason
                            )[0];
                        } else {
                            this.selectedReason = '';
                        }
                    }
                }
            });
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['itemPosmReason']) {
            this.loadData();
        }
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
