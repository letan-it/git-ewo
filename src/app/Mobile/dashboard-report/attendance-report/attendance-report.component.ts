import { Component } from '@angular/core';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { DatePipe } from '@angular/common';
import { Pf } from 'src/app/_helpers/pf';
import { DashboardReportService } from '../service/dashboard-report.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent {
  constructor(
    private _service: DashboardReportService,
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService,
    public acti_service: ActivationService,
  ) { }

  GetLanguage(key: string) {
    return Helper.GetLanguage(key)
  }
  getLanguage() {
    this.masterService.ewo_GetLanguage(this.project_id).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        localStorage.setItem('key_language', 'vn')
        localStorage.setItem('language', JSON.stringify(data.data))
      }
    })
  }

  start_time: any = null;
  currDate?: any;
  firstDateOfMonth: any;
  lastDateOfMonth: any;
  currentDate: any;
  dateStart: any | undefined;
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  month: any;
  getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;

    if (month < 10) {
      let x = '0' + month.toString();
      month = +x;
      +month;
    }
    let day = date.getDate();

    this.currDate = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day}`;
    if (this.month === null || this.month === undefined) {
      this.month = month;
      this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
      this.lastDateOfMonth = `${year}${month > 9 ? month : "0" + month}${Pf.lastDayMonth('', month)}`;
    } else {
      this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
      this.lastDateOfMonth = `${year}${month > 9 ? month : "0" + month}${Pf.lastDayMonth('', +this.month)}`;
    }

    this.currentDate = Helper.convertDateStr1(this.currDate);
  }

  selectMonth: any;
  ListMonth: any = [];
  getMonth(date: Date, format: string) {
    const today = new Date();
    const monthToday = today.getMonth() + 1;
    const year = today.getFullYear();

    const datePipe = new DatePipe('en-US');
    let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
    if (monthNow < 12) {
      monthNow++;
    }
    const dataMonth = Helper.getMonth();
    this.ListMonth = dataMonth.ListMonth;

    const monthString = monthToday.toString().padStart(2, '0');
    const currentDate = parseInt(year + monthString);
    if (Helper.IsNull(this.selectMonth) == true) {
      this.selectMonth = this.ListMonth?.find(
        (i: any) => i?.code == currentDate
      );
    }
  }

  listRawDataManager: any = [];
  listRawDataEmployee: any = [];
  previousTotalEmployees: any;
  nowTotalEmployees: any;
  differenceCount: any = 0;
  loadData() {
    this._service.Mobile_Summary_ATD(this.selectMonth.code - 1, this.project_id)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          let previousTotalEmployees = 0;
          data.data.summary.forEach((item: any) => {
            if (item.label === 'Số lượng NV đang quản lý') {
              previousTotalEmployees = item.values;
            }
          });
          this.previousTotalEmployees = previousTotalEmployees;
        }
      })

    this._service.Mobile_Summary_ATD(this.selectMonth.code, this.project_id)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          if (this.userProfile.employee_type_id === 8) {
            let totalEmployees = 0;
            data.data.summary.forEach((item: any) => {
              if (item.label === 'Số lượng NV đang quản lý') {
                totalEmployees = totalEmployees + item.values;
              }
            });
            this.nowTotalEmployees = totalEmployees;

            data.data.summary.forEach((element: any) => {
              var item = {
                "_key": element.code,
                "name_vn": element.label,
                "icon": element.icon,
                "color_title": `rgb(34, 240, 82)`,
                "color": "black",
                "background": "white",
                "Values": element.values
              }
              this.listRawDataManager.push(item);
            });
          } else if (this.userProfile.employee_type_id === 7) {

          }
        }
      }
      )

    if (this.nowTotalEmployees > this.previousTotalEmployees) {
      this.differenceCount = this.nowTotalEmployees - this.previousTotalEmployees;
    } else if (this.nowTotalEmployees < this.previousTotalEmployees) {
      this.differenceCount = this.previousTotalEmployees - this.nowTotalEmployees;
    } else if (this.nowTotalEmployees === this.previousTotalEmployees) {
      this.differenceCount = 0;
    }
  }

  project_id: any;
  project: any;
  token: any;
  user_profile: string = 'current';
  currentUser: any;
  userProfile: any;
  loadUser() {
    if (this.user_profile == EnumSystem.current) {
      let _u = localStorage.getItem(EnumLocalStorage.user);

      this.currentUser = JSON.parse(
        this._edCrypt.decryptUsingAES256(_u)
      );
      this.currentUser.employee[0]._status =
        this.currentUser.employee[0].status == 1 ? true : false;
      this.userProfile = this.currentUser.employee[0];

      const project = this.currentUser.projects.filter(
        (p: any) => p.project_id == Helper.ProjectID()
      );
      this.project = project[0];
    }
  }

  ngOnInit() {
    this.project_id = Helper.ProjectID();
    this.getDate();
    let newDate = new Date();
    this.getMonth(newDate, 'MM');
    this.loadUser();
    this.listRawDataManager = [];
    this.loadData();
  }

  chooseMonthYear() {
    this.month = this.selectMonth?.code.toString().slice(4, 6);
    this.getDate();
    // this.loadData();
  }

  dialogAllEmployees: any = false;
  dialogEmployeeWorking: any = false;
  dialogEmployeeQuit: any = false;
  openDetail(rawData: any) {
    if (rawData === 'Số lượng NV đang quản lý') {
      this.dialogAllEmployees = true;
    } else if (rawData === 'NV có lịch làm việc hôm nay') {
      this.dialogEmployeeWorking = true;
    } else if (rawData === 'NV chưa chấm công hôm nay') {
      this.dialogEmployeeQuit = true;
    }
  }
  closeAllEmployees() {
    this.dialogAllEmployees = false;
  }
  closeEmployeeWorking() {
    this.dialogEmployeeWorking = false;
  }
  closeEmployeeQuit() {
    this.dialogEmployeeQuit = false;
  }


  openEmployeesList() {

  }
}
