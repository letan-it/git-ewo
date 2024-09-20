import {
  Component,
  Input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';

import { EnumLocalStorage } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { PhotoService } from 'src/app/web/service/photo.service';
import { ReportsService } from 'src/app/web/service/reports.service';
import { FieldCoachingService } from 'src/app/web/service/field-coaching.service';

@Component({
  selector: 'app-works-coaching-details',
  templateUrl: './works-coaching-details.component.html',
  styleUrls: ['./works-coaching-details.component.scss'],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: WorksCoachingDetailsComponent,
      multi: true,
    },
  ],
})
export class WorksCoachingDetailsComponent {

  constructor(
    private _service: ReportsService,
    private photoService: PhotoService,
    private edService: EncryptDecryptService,
    private fieldCoachingService: FieldCoachingService
  ) { }
  items: any;
  project_id: any = Helper.ProjectID();

  is_ChangeNote = 0;
  is_ChangeReportStatus = 0;
  // leftTooltipItems: any;

  @Input() action: any = 'view';
  @Input() inValue: any;
  @Input() FilterSurvey: any = 0;

  language_report: any[] = [];
  GetLanguage(key: string) {
    const key_language = localStorage.getItem('key_language') ?? 'vn';
    const L =
      Helper.IsNull(this.language_report) != true
        ? this.language_report.filter((k: any) => k.key == key)
        : [];
    if (L.length > 0) {
      return key_language == 'vn' ? L[0].vn : L[0].en;
    } else {
      return key;
    }
  }


  permission_full = 0;
  is_loadForm: number = 1;

  loadDataCoaching(project_id: any, work_id: number) {
    this.fieldCoachingService.Works_Coaching_GetDetail(project_id, work_id)
  }

  dataloadDataFiledCoaching(report_id: any) {
    this.loadDataCoaching(this.project_id, report_id);
  }

  currentUser: any;
  project: any;
  projectName() {
    let _u = localStorage.getItem(EnumLocalStorage.user);
    this.project = JSON.parse(
      this.edService.decryptUsingAES256(_u)
    ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
  }
  images: any;
  isdelete_ATD: any;
  ngOnInit(): void {
    // this.checkRequest();
    // this.type_code = 'explanation_plan';
    // console.log(this.inValue.id);
    this.dataloadDataFiledCoaching(this.inValue.id)
    this._service.imageEmp = this.inValue.image;

    let _u = localStorage.getItem(EnumLocalStorage.user);
    this.currentUser = JSON.parse(
      this.edService.decryptUsingAES256(_u)
    ).employee[0];
    this.projectName();

    if (
      this.currentUser.employee_type_id == 1 ||
      this.currentUser.employee_type_id == 2 ||
      this.currentUser.employee_type_id == 3
    ) {
      this.permission_full = 1;
      this.isdelete_ATD = 1;
    } else {
      this.permission_full = 0;
      this.isdelete_ATD = 0;
    }

    this.photoService.getImages().then((images) => (this.images = images));
  }
}
