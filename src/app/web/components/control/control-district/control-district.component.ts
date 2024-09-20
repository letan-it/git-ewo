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
    selector: 'app-control-district',
    templateUrl: './control-district.component.html',
    styleUrls: ['./control-district.component.scss'],
})
export class ControlDistrictComponent {
    constructor(private _service: MastersService) {}
    isLoadForm = 1;
    selectedDistrict: any;
    listDistrict: any;
    @Output() outValue = new EventEmitter<string>();
    @Input() inValue: any;

    @Input() itemDistrictId!: any;
    @Input() itemProvinceId!: any;
    nameDistrict: string = 'Select a district';
    @Input() inValueProvince: any = undefined;
    province_input: number = 0;

    LoadData() {}
    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges): void {
        this.isLoadForm = 1;
        this.listDistrict = [];
        if (changes['inValue'] || changes['itemDistrictId']) {
            try {
                const province_id = this.inValue.code;

                if (province_id != undefined) {
                    this.province_input = this.inValue.code;
                } else {
                    this.province_input = this.inValue;
                }
                if (this.province_input != 0)
                    this._service
                        .GetDistricts(this.province_input)
                        .subscribe((data: any) => {
                            this.isLoadForm = 0;
                            if (data.result == EnumStatus.ok) {
                                data.data.forEach((element: any) => {
                                    this.listDistrict.push({
                                        name: element.full_name,

                                        code: element.district_id,
                                    });
                                });

                                if (this.itemDistrictId > 0) {
                                    this.selectedDistrict =
                                        this.listDistrict.filter(
                                            (item: any) =>
                                                item.code == this.itemDistrictId
                                        )[0];
                                } else if (this.itemDistrictId != undefined) {
                                    this.selectedDistrict =
                                        this.listDistrict.filter(
                                            (item: any) =>
                                                item.code ==
                                                this.itemDistrictId.code
                                        )[0];
                                } else {
                                    this.selectedDistrict = '';
                                }
                            }
                        });
            } catch (error) {}

            if (changes['inValueProvince'] || changes['inValue']) {
                this.selectedDistrict = '';
                this.listDistrict = [];
            }
        }
    }
    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
