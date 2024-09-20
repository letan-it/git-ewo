import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Helper } from 'src/app/Core/_helper';
import { ShopsService } from 'src/app/web/service/shops.service';
import { SupplierService } from 'src/app/web/service/supplier.service';

@Component({
  selector: 'app-control-shop-suppliers',
  templateUrl: './control-shop-suppliers.component.html',
  styleUrls: ['./control-shop-suppliers.component.scss']
})
export class ControlShopSuppliersComponent {
  constructor(
    private _service: SupplierService
  ) { }
  isLoadForm = 1;
  @Output() outValue = new EventEmitter<string>();
  @Input() itemSupplier: any = undefined;

  selectSupplier: any;
  listSupplier: any = [];
  listData: any;

  loadData() {
    this.isLoadForm = 1;
    this._service
      .Supplier_GetList(Helper.ProjectID())
      .subscribe((data: any) => {

        this.isLoadForm = 0;
        this.listSupplier = [];
        data.data.forEach((element: any) => {
          // if (
          //   element.status == 1
          // ) {

          this.listSupplier.push({
            code: element.supplier_id,
            name: '[' + element.supplier_id + ']' + ' - ' + element.supplier_code + ' - ' + element.supplier_name,
          });

          // }
        });

        if (this.itemSupplier != undefined) {
          this.selectSupplier = this.listSupplier.filter(
            (item: any) => item.code == this.itemSupplier
          )[0];
        } else {
          this.selectSupplier = '';
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
    if (changes['itemSupplier']) {
      this.loadData();
    }
  }
  returnValue(value: any) {
    this.outValue.emit(value);
  }
}
