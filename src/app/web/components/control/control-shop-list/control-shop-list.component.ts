import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { ProductService } from 'src/app/web/service/product.service';
import { ShopsService } from 'src/app/web/service/shops.service';

@Component({
  selector: 'app-control-shop-list',
  templateUrl: './control-shop-list.component.html',
  styleUrls: ['./control-shop-list.component.scss']
})
export class ControlShopListComponent {

  constructor(
    private _service: ShopsService
  ) { }
  isLoadForm = 1;
  selectedShop: any;
  listShop: any;

  @Input() placeholder: any = '-- Choose -- ';

  @Output() outValue = new EventEmitter<string>();
  @Input() itemShop!: number;
  @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
  @Input() selectMulti: any = false;

  cities!: any[];
  selectedCities!: any[];

  returnValue(value: any) {
    this.outValue.emit(value);
  }

  loadData() {
    this.isLoadForm = 1;

    this._service.ewoGetShopList(100000, 1, Helper.ProjectID(), '', '', '', 0, 0, 0, 0, 0, 0, -1, 0, '', 0)
      .subscribe((data: any) => {
        this.isLoadForm = 0;
        this.listShop = [];
        if (data.result == EnumStatus.ok) {
          data.data.forEach((element: any) => {

            this.listShop.push({
              name: `[${element.shop_id}] - ${element.shop_code} - ${element.shop_name}`,
              id: element.shop_id
            });

          });
        }

        if (this.itemShop > 0) {
          this.selectedShop = this.listShop.filter(
            (item: any) => item.id == this.itemShop
          )[0];
        } else {
          this.selectedShop = '';
        }

      })


  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];

    this.loadData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemShop']) {
      this.loadData();
    }
  }
}
