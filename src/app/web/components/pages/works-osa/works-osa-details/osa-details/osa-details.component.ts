import { Component, Input, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { OsaService } from 'src/app/web/service/osa.service';

@Component({
  selector: 'app-osa-details',
  templateUrl: './osa-details.component.html',
  styleUrls: ['./osa-details.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class OsaDetailsComponent {
  @Input() inValue: any;
  constructor(
    private _service: OsaService,
    private messageService: MessageService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class. 

  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['inValue']) {

    }


  }

  item_OSAReason: any = null;
  selectOSAReason(event: any) {
    this.item_OSAReason = event != null ? event.id : null;
  }

  messages: any = []

  onRowEditInit(item: any) {
    this.messages = []
    this.item_OSAReason = item.oos_reason_id;
  }
  CallFormular(item: any) {
    this._service.Call_FormularReport(Helper.ProjectID(), item.report_id, item.id, item.year_month
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        item.resultNameVN = data.data.data_result
        item.result = data.data.data_formular


      }
    })

  }

  onRowEditSave(item: any, his: any) {
    if (
      this.checkOOS_Reason(item._oos, this.item_OSAReason, 'reason') == 1 ||
      this.checkNumber(item.quantity, 'Quantity') == 1 ||
      this.checkNumber(item.price, 'Price') == 1 ||
      this.checkNumber(item.facing, 'Facing') == 1) {
      return;

    } else {

      this._service
        .OSA_Detail_Action(
          Helper.ProjectID(),
          item.id,
          item._oos == true ? 1 : 0,
          this.item_OSAReason,
          item._ooc == true ? 1 : 0,
          item.quantity,
          item.price,
          item.facing,
          item.note,
          'update'
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            if (data.data.detail.length > 0) {

              data.data.detail = data.data.detail.map((element: any) => ({
                ...element,
                _oos: element.oos == 1 ? true : false,
                _ooc: element.ooc == 1 ? true : false
              }))[0]
              // item = data.data
              item.oos = data.data.detail.oos
              item.oos_reason_id = data.data.detail.oos_reason_id
              item.reason_name = data.data.detail.reason_name
              item.ooc = data.data.detail.ooc
              item.quantity = data.data.detail.quantity
              item.price = data.data.detail.price
              item.facing = data.data.detail.facing
              item.note = data.data.detail.note
              item._oos = data.data.detail._oos
              item._ooc = data.data.detail._ooc
              item.updateBy_date = data.data.detail.updateBy_date

              data.data.history.forEach((his: any) => {
                his._oos = his.oos == 1 ? true : false,
                  his._ooc = his.ooc == 1 ? true : false
              });

              his = data.data.history

              this.inValue.data_osa.osA_Results.filter((x: any) => x.Guid == item.Guid)[0].detail.forEach((y: any) => {
                if (y.id == item.id) {
                  y.his = data.data.history
                }
              });

              this.NofiResult('Page Works', 'Update OSA Details', 'Update OSA Details Successfull', 'success', 'Successfull');
            }
          }
        })
    }
  }

  addValue(item: any, value: any) {
    item = value
  }

  categoryDialog: boolean = false;
  category!: any;
  selectedCategory!: any;
  submitted: boolean = false;
  statuses!: any[];
  action: any = 'create';

  editCategory(category: any) {

    this.category = { ...category };
    this.categoryDialog = true;
    this.action = 'update';
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  // clearCategory(data: any) {
  //   this.ListCategory = [...data];
  //   this.categoryDialog = false;
  //   this.category = {};
  // }


  onRowEditCancel(item: any, index: number) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cancelled',
      detail: 'You have cancelled',
    });
  }


  calculateCustomerTotal(name: string, data: any) {
    let total = 0;

    if (data) {
      for (let product of data) {
        if (product.representative?.name === name) {
          total++;
        }
      }
    }

    return total;
  }

  NofiIsNull(value: any, name: any): any {
    let check = 0;
    if (value == 0) {
      value += '';
    }
    if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a ' + name,
      });
      check = 1;
    }
    return check;
  }

  // Price
  checkNumber(value: any, name: any): any {
    let check = 0;
    if (Helper.number(value) != true && Helper.IsNull(value) != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name + ' wrong format',
      });
      check = 1;
    }
    return check;
  }

  checkDecimal(value: any, name: any): any {
    let check = 0;
    if (
      Helper.checkDecimal(value) != true &&
      Helper.IsNull(value) != true
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name + ' wrong format',
      });
      check = 1;
    }
    return check;
  }

  checkOOS_Reason(_oos: any, reason_id: any, name: any): any {
    let check = 0;

    if (_oos == true && reason_id == null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a ' + name,
      });
      check = 1;
    }
    return check;
  }

  NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: name,
      life: 3000,
    });

    AppComponent.pushMsg(
      page,
      action,
      name,
      severity == 'success' ? EnumStatus.ok : EnumStatus.error,
      0
    );

  }


  urlgallery: any;
  showImageProduct(url: any) {

    this.urlgallery = url;
    document.open(
      <string>this.urlgallery,
      'windowName',
      'height=700,width=900,top=100,left= 539.647'
    );
  }

}

