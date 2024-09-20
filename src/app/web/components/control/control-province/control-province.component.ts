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
    selector: 'app-control-province',
    templateUrl: './control-province.component.html',
    styleUrls: ['./control-province.component.scss'],
})
export class ControlProvinceComponent {
    constructor(private _service: MastersService) { }
    isLoadForm = 1;
    selectedProvince: any;
    listProvince: any;
    @Output() outValue = new EventEmitter<string>();

    @Input() itemProvinceId!: any;
    nameProvince: string = 'Select a province';

    LoadData() {
        try {
            this.isLoadForm = 1;
            this.listProvince = [];
            this._service.GetProvince().subscribe((data: any) => {
                this.isLoadForm = 0;
                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        if (this.listProvince.length < 66) {
                            this.listProvince.push({
                                name: element.full_name,

                                code: element.province_id,
                            });
                        }
                    });

                    if (this.itemProvinceId > 0) {
                        this.selectedProvince = this.listProvince.filter(
                            (item: any) => item.code == this.itemProvinceId
                        )[0];
                    } else if (this.itemProvinceId != undefined) {
                        this.selectedProvince = this.listProvince.filter(
                            (item: any) => item.code == this.itemProvinceId.code
                        )[0];
                    } else {
                        this.selectedProvince = '';
                    }
                }
            });
        } catch (error) { }
    }
    ngOnInit() {
        this.LoadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemProvinceId']) {
            this.LoadData();
        }
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
