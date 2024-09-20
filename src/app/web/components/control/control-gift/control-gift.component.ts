import {
    Component,
    Input,
    Output,
    SimpleChanges,
    EventEmitter,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { GiftsService } from 'src/app/web/service/gifts.service';

@Component({
    selector: 'app-control-gift',
    templateUrl: './control-gift.component.html',
    styleUrls: ['./control-gift.component.scss'],
})
export class ControlGiftComponent {
    constructor(private _service: GiftsService) {}
    isLoadForm = 1;
    selectedGift: any;
    listGift: any;

    functionToClear(multiselect: any): void {
        multiselect.value = [];
    }
    test(event: any) {}
    @Input() placeholder: any = '-- Choose -- ';

    @Output() outValue = new EventEmitter<string>();
    @Output() outClear = new EventEmitter<boolean>();

    @Input() itemGift!: number;
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
    @Input() selectMulti: any = false;
    @Input() itemDisPlay: boolean = false;

    returnValue(value: any) {
        this.outValue.emit(value);
    }

    loadData() {
        this.isLoadForm = 1;

        this._service
            .gifts_GetList(10000000, 1, Helper.ProjectID(), '', '', '', -1)
            .subscribe((data: any) => {
                this.isLoadForm = 0;
                this.listGift = [];

                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        this.listGift.push({
                            name: `[${element.id}] - ${element.gift_code} - ${element.gift_name}`,
                            id: element.id,
                            gift_code: element.gift_code,
                            item_code: element.gift_code,
                            item_name: element.gift_name,
                            gift_image: element.gift_image,
                        });
                    });
                }

                if (this.itemGift > 0) {
                    this.selectedGift = this.listGift.filter(
                        (item: any) => item.id == this.itemGift
                    )[0];
                } else {
                    this.selectedGift = '';
                }
            });
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.loadData();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemGift'] && Helper.IsNull(this.listGift) != true) {
            this.loadData();
        }
    }
    resetSelection() {
        this.selectedGift = [];
        this.outClear.emit(true);
    }
}
