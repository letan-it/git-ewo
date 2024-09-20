import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { log } from 'console';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { MastersService } from 'src/app/web/service/masters.service';
import { ShopsService } from 'src/app/web/service/shops.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-control-shop-type',
    templateUrl: './control-shop-type.component.html',
    styleUrls: ['./control-shop-type.component.scss'],
})
export class ControlShopTypeComponent {
    constructor(private _service: ShopsService,
        private _serviceMaster: MastersService
    ) { }
    isLoadForm = 1;
    selectedShopType: any;
    listShopType: any;
    @Output() outValue = new EventEmitter<string>();
    @Output() outClear = new EventEmitter<boolean>();
    // placeholder="Select a ShopType"

    @Input() itemShopType!: number;
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
    @Input() multiSelect: boolean = false;
    nameShopType: string = 'Select a ShopType';
  
    LoadData() {
        this.isLoadForm = 1;
        this._service.ewo_ShopTypes_List(Helper.ProjectID()).subscribe((data: any) => {
            this.isLoadForm = 0;
            if (data.result == EnumStatus.ok) {
                this.listShopType = [];
                data.data.forEach((element: any) => {
                    if (element.status == 1) { 
                        this.listShopType.push({
                            name:
                                '[' +
                                element.shop_type_id +
                                '] - ' +
                                element.shop_type_code +
                                ' - ' +
                                element.shop_type_name,
                            code: element.shop_type_id,
                        });
                    }
                }); 

                if (this.itemShopType > 0) {
                    this.selectedShopType = this.listShopType.filter(
                        (item: any) => item.code == this.itemShopType
                    )[0];
                } else {
                    this.selectedShopType = '';
                }
            }
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemShopType']) {
            this.LoadData();
        }
    }
    ngOnInit() { 
        this.LoadData();
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }

    resetSelection() {
        this.selectedShopType = [];
        this.outClear.emit(true);
    }
     
}
