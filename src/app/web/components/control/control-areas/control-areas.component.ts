import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { MastersService } from 'src/app/web/service/masters.service';

@Component({
    selector: 'app-control-areas',
    templateUrl: './control-areas.component.html',
    styleUrls: ['./control-areas.component.scss'],
})
export class ControlAreasComponent {
    constructor(private _service: MastersService) {}
    isLoadForm = 1;
    selectedAreas: any;
    listAreas: any;
    @Output() outValue = new EventEmitter<string>();

    @Input() itemAreasId!: number;
    nameAreas: string = 'Select a Areas';

    ngOnInit() {
        try {
            // "area_id": 1,
            // "area_code": "NORTH",
            // "area_name": "NORTH",
            // "orders": 1
            this.isLoadForm = 1;
            this.listAreas = [];
            this._service.GetAreas().subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.isLoadForm = 0;
                    data.data.forEach((element: any) => {
                        this.listAreas.push({
                            name:
                                '[' +
                                element.area_id +
                                '] - ' +
                                element.area_code +
                                ' - ' +
                                element.area_name,

                            code: element.area_id,
                        });
                    });
                }
            });
        } catch (error) {}
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
