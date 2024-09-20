import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { ActivationService } from 'src/app/web/service/activation.service';
import { PromotionService } from 'src/app/web/service/promotion.service';

@Component({
  selector: 'app-control-activation-promotion',
  templateUrl: './control-activation-promotion.component.html',
  styleUrls: ['./control-activation-promotion.component.scss']
})
export class ControlActivationPromotionComponent implements OnChanges {

  @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
  @Input() dateCode!: any
  @Output() outValue = new EventEmitter<any>


  constructor(private _service: ActivationService) { }


  promotion_id!: any
  selectedProduct: any
  listPromotion: any[] = []
  isLoadForm: number = 0
  rowPerPage: number = 100000
  pageNumber: number = 1

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateCode']) {
      this.getData()
    }
  }


  getData() {

    this._service.Promotion_GetList(Helper.ProjectID(), '', '', '', -1, 0, 0,
      this.rowPerPage, this.pageNumber).subscribe((res: any) => {
        if (res.result = EnumStatus.ok) {
          res.data?.forEach((i: any) => {
            if (i.status == 1) {
              this.listPromotion.push({
                code: i.promotion_id,
                name: i.promotion_code + "-" + i.promotion_name,
                promotion_code: i.promotion_code
              })
            }

          })
        }
      })
  }

  returnValue(e: any) {
    if (e == null) {
      this.outValue.emit(null)
    } else { this.outValue.emit(e) }
  }
}

