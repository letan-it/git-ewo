import { Component, EventEmitter, Output } from '@angular/core';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { ShiftsService } from 'src/app/web/service/shifts.service';
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/Core/_helper';
@Component({
    selector: 'app-control-shifts',
    templateUrl: './control-shifts.component.html',
    styleUrls: ['./control-shifts.component.scss'],
})
export class ControlShiftsComponent {
    listShifts: any = [];
    selectedShift: any;
    constructor(private _service: ShiftsService) {}

    @Output() outValue = new EventEmitter<string>();
    returnValue(value: any) {
        this.outValue.emit(value);
    }
    ngOnInit(): void {
        this.listShifts = [];
        this._service
            .ewo_GetShifts(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        this.listShifts.push({
                            name: element.shift_code + ' - ' + element.note,

                            code: element.shift_id,
                        });
                    });
                }
            });
    }
}
