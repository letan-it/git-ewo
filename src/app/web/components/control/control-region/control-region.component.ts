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
    selector: 'app-control-region',
    templateUrl: './control-region.component.html',
    styleUrls: ['./control-region.component.scss'],
})
export class ControlRegionComponent {
    constructor(private _service: MastersService) {}
    isLoadForm = 1;
    selectedRegion: any;
    listRegion: any;
    @Output() outValue = new EventEmitter<string>();

    @Input() itemRegionId!: number;
    nameRegion: string = 'Select a Region';

    ngOnInit() {
        try {
            this.isLoadForm = 1;
            this.listRegion = [];
            this._service.GetRegion().subscribe((data: any) => {
                this.isLoadForm = 0;
                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        this.listRegion.push({
                            name: element.full_name,

                            code: element.Region_id,
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
