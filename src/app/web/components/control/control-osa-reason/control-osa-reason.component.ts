import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { OsaService } from 'src/app/web/service/osa.service';

@Component({
  selector: 'app-control-osa-reason',
  templateUrl: './control-osa-reason.component.html',
  styleUrls: ['./control-osa-reason.component.scss']
})
export class ControlOsaReasonComponent {

  constructor(
    private _service: OsaService
  ) { }
  isLoadForm = 1;
  selectedReason: any;
  listReason: any;

  @Input() placeholder: any = '-- Choose -- ';

  @Output() outValue = new EventEmitter<string>();
  @Input() itemReason!: number;

  returnValue(value: any) {
    this.outValue.emit(value);
  }
  loadData() {
    this.isLoadForm = 1;

    this._service
      .GetOSA_Reason(Helper.ProjectID()
      ).subscribe((data: any) => {
        this.isLoadForm = 0;
        this.listReason = [];

        if (data.result == EnumStatus.ok) {


          data.data.forEach((element: any) => {

            this.listReason.push({
              name: element.reason_name,
              id: element.reason_id,
            });
          });

        }

        if (this.itemReason > 0) {

          this.selectedReason = this.listReason.filter(
            (item: any) => item.id == this.itemReason
          )[0];

        }
        else {
          this.selectedReason = '';
        }

      });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemReason']) {

      this.loadData();
    }
  }
}

