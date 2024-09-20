import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { FieldCoachingService } from 'src/app/web/service/field-coaching.service';

@Component({
  selector: 'app-kpi-field-coaching',
  templateUrl: './kpi-field-coaching.component.html',
  styleUrls: ['./kpi-field-coaching.component.scss']
})
export class KpiFieldCoachingComponent {
  @Input() inValue: any;
  @Output() outValue = new EventEmitter<any>();

  constructor(
    private _service: FieldCoachingService
  ) { }

  activeIndex: number = 0;
  scrollableTabs: any[] = Array.from({ length: 5 }, (_, i) => ({
    title: 'Title',
    content: 'Content',
  }));

  ngOnInit(): void {
    if (this.inValue !== null && this.inValue !== undefined) {
      this.processData(this.inValue);
    }
  }

  GetLanguage(key: string) {
    return Helper.GetLanguage(key);
  }
  ListWorkDetail: any = [];
  ListWorkFile: any = [];
  fullData: any = [];
  processData(result: any) {
    if (!Helper.IsNull(result)) {
      this._service.Works_Coaching_GetDetail(Helper.ProjectID(), result.id)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) { 
          data.data.detail.forEach((item: any) => {
            this.ListWorkDetail.push({
              ...item,
              report_id: this.inValue.report_id,
              representative: {
                id: item.question_id,
                name: item.question_group
              }
            })
          })

          data.data.file.forEach((item: any) => {
            this.ListWorkFile.push({
              ...item,
              report_id: this.inValue.report_id
            })
          })

          data.data.report_id = this.inValue.report_id;
          this.fullData = data.data;
          console.log(this.fullData);
        }
      })
    }
  }
}
