import { Component } from '@angular/core';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { UserService } from 'src/app/web/service/user.service';
import { SupervisionService } from '../service/supervision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Pf } from 'src/app/_helpers/pf';

@Component({
  selector: 'app-workday-detail',
  templateUrl: './workday-detail.component.html',
  styleUrls: ['./workday-detail.component.scss']
})
export class WorkdayDetailComponent {
  constructor(
    private router: Router,
    private activate: ActivatedRoute,
    private userService: UserService,
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService,
    public acti_service: ActivationService,
    private _service: SupervisionService,
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

  firstDateOfMonth: any;
  lastDayMonth: any;
  lastDateOfMonth: any;
  getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;

    // this.currDate = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day}`;
    this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
    this.lastDayMonth = Pf.lastDayCurrMonth('');
    this.lastDateOfMonth = `${year}${month > 9 ? month : "0" + month}${this.lastDayMonth}`;
    // this.currentDate = Helper.convertDateStr1(this.currDate);
  }

  employee_id: any;
  employee_id_route: any;
  shop_id: any;
  date: any;
  userDecrypt: any
  loginByToken(token: string) {
    localStorage.setItem('theme-config', '{"config":{"ripple":false,"inputStyle":"outlined","menuMode":"overlay","colorScheme":"light","theme":"bootstrap4-light-blue","scale":9},"state":{"staticMenuDesktopInactive":false,"overlayMenuActive":false,"profileSidebarVisible":false,"configSidebarVisible":false,"staticMenuMobileActive":false,"menuHoverActive":false,"theme":false}}')
    this.userService.loginByToken(token)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          let user_current = data.data;
          const project = user_current.projects.filter(
            (p: any) => p.project_id == Helper.ProjectID()
          );

          if (project.length > 0) {
            const userEncrypt = this._edCrypt.encryptUsingAES256(
              JSON.stringify(user_current.employee[0])
            );
            this.employee_id = user_current.employee[0].employee_id;
            localStorage.setItem(
              EnumLocalStorage.user_profile,
              userEncrypt
            );
            this.userDecrypt = user_current.employee[0];

            const dataEncrypt = this._edCrypt.encryptUsingAES256(
              JSON.stringify(user_current)
            );

            localStorage.setItem(
              EnumLocalStorage.user,
              dataEncrypt
            );
            this.getLanguage()
            this.loadData()
          } else {
            alert('No project decentralization');
          }
        } else {
          alert('Wrong login information');
        }
      }
      );
  }

  totalHourTime: any;
  timeSheetDetailLate: any = [];
  countLate: any;
  minuteLate: number = 0;
  timeSheetDetailEarly: any = [];
  countEarly: any;
  minuteEarly: number = 0;
  timeSheetDetail: any;
  loadData() {
    // console.log(this.employee_id_route);

    this._service.Mobile_Timekeeping_TimesheetDetails(
      this.project_id,
      this.employee_id_route,
      // 19508,
      this.firstDateOfMonth,
      this.lastDateOfMonth
      // 20240801,
      // 20240815
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        let test: any[] = [];

        data.data.data_time.forEach((item: any) => {
          test.push({
            ...item,
            hourTotal: +(item.total_time.split(':')[0] * 60) + +(item.total_time.split(':')[1] * 60) + +(item.total_time.split(':')[2]),
            order: Helper.transformDateInt(item.atd_time_ci.slice(0, 10))
          })
        })
        data.data.data_time = test.sort(Helper.compareValuesArrObjAsc('order'));
        let totalTime = 0;
        let timeSheetDetailLate: any[] = [];
        let countLate = 0;
        let minuteLate = 0;
        let timeSheetDetailEarly: any[] = [];
        let countEarly = 0;
        let minuteEarly = 0;
        data.data.data_time.map((item: any) => {
          totalTime = totalTime + item.hourTotal;
          if (item.typeci !== null) {
            timeSheetDetailLate.push({
              ...item
            })
            countLate++;
            minuteLate = minuteLate + item.duration_ci;
          } else if (item.typeco === 'CHECKOUT' && item.alertco === 'Thời gian check-out của bạn chưa đến') {
            timeSheetDetailEarly.push({
              ...item
            })
            countEarly++;
            minuteEarly = minuteEarly + item.duration_co * (-1);
          } 
        })
        this.totalHourTime = (totalTime/3600).toFixed(2);
        this.timeSheetDetailLate = timeSheetDetailLate;
        this.countLate = countLate;
        this.minuteLate = minuteLate;
        this.timeSheetDetailEarly = timeSheetDetailEarly;
        this.countEarly = countEarly;
        this.minuteEarly = minuteEarly;
        this.timeSheetDetail = data.data.data_time;
      }
    })
  }

  project_id: number = 0
  token: any;
  link: any;
  ngOnInit(): void {
    this.project_id = Helper.ProjectID();
    this.getDate();
    localStorage.removeItem('_u');
    localStorage.removeItem('user_profile');

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (Helper.getPrams('token', this.activate)) {
      this.token = this.activate.snapshot.queryParamMap.get('token');
      this.loginByToken(Helper.getPrams('token', this.activate));
      this.employee_id_route = this.activate.snapshot.queryParamMap.get('employee_id'); 
      this.link = `/supervision/monthly-timesheet?employee_id=${this.employee_id_route}&token=${this.token}`
    }
  }

  openDetailLate: boolean = false;
  detailLate() {
    if (this.countLate === 0) {
      this.openDetailLate = false;
    } else {
      this.openDetailLate = true;
    }
  }
  openDetailEarly: boolean = false;
  detailEarly() {
    if (this.countEarly === 0) {
      this.openDetailEarly = false;
    } else {
      this.openDetailEarly = true;
    }
  }
}
