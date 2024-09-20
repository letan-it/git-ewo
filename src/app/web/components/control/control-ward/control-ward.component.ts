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
    selector: 'app-control-ward',
    templateUrl: './control-ward.component.html',
    styleUrls: ['./control-ward.component.scss'],
})
export class ControlWardComponent {
    constructor(private _service: MastersService) {}
    isLoadForm = 1;
    selectedWard: any;
    listWard: any;
    @Output() outValue = new EventEmitter<string>();
    @Input() inValue: any;
    @Input() inValueProvince: any = undefined;
    @Input() inValueDistrict: any = undefined;

    @Input() itemDistrictId!: any;
    @Input() itemWardId!: any;
    nameWard: string = 'Select a ward';
    district_input: number = 0;

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue'] || changes['itemWardId']) {
            this.isLoadForm = 1;
            try {
                this.listWard = [];
                const district_id = this.inValue.code;

                if (district_id != undefined) {
                    this.district_input = this.inValue.code;
                } else {
                    this.district_input = this.inValue;
                }

                this._service
                    .GetWards(this.district_input)
                    .subscribe((data: any) => {
                        this.isLoadForm = 0;
                        if (data.result == EnumStatus.ok) {
                            data.data.forEach((element: any) => {
                                this.listWard.push({
                                    name: element.full_name,

                                    code: element.ward_id,
                                });
                            });
                            // this.selectedWard = undefined;

                            if (this.itemWardId > 0) {
                                this.selectedWard = this.listWard.filter(
                                    (item: any) => item.code == this.itemWardId
                                )[0];
                            } else if (this.itemWardId != undefined) {
                                this.selectedWard = this.listWard.filter(
                                    (item: any) =>
                                        item.code == this.itemWardId.code
                                )[0];
                            } else {
                                this.selectedWard = '';
                            }
                        }
                    });
            } catch (error) {}
        }

        if (changes['inValueProvince'] || changes['inValueDistrict']) {
            this.selectedWard = undefined;
            this.listWard = [];
        }
    }
    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
