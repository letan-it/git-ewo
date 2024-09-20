import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Pf } from 'src/app/_helpers/pf';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { UserService } from 'src/app/web/service/user.service';
import { DashboardReportService } from './service/dashboard-report.service';

@Component({
  selector: 'app-dashboard-report',
  templateUrl: './dashboard-report.component.html',
  styleUrls: ['./dashboard-report.component.scss']
})
export class DashboardReportComponent {
  constructor(
    private _service: DashboardReportService,
    private activate: ActivatedRoute,
    private userService: UserService,
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService,
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
      '0' + month.toString();
      +month;
    }
    let day = date.getDate();

    this.currDate = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day}`;
    if (this.month === null || this.month === undefined) {
      this.month = month;
      this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
      this.lastDateOfMonth = `${year}${month > 9 ? month : "0" + month}${Pf.lastDayMonth('', month)}`;
    } else {
      this.firstDateOfMonth = `${year}${this.month}01`;
      this.lastDateOfMonth = `${year}${this.month}${Pf.lastDayMonth('', +this.month)}`;
    }

    this.currentDate = Helper.convertDateStr1(this.currDate);
  }

  userProfile: any;
  project_id: any;
  employee_id: any;
  employee_type: any;
  shop_id: any;
  date: any;
  userDecrypt: any
  project: any;
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
            this.project = project[0];
            const userEncrypt = this._edCrypt.encryptUsingAES256(
              JSON.stringify(user_current.employee[0])
            );
            this.userProfile = user_current.employee[0];
            this.employee_id = user_current.employee[0].employee_id;
            this.employee_type = user_current.employee[0].employee_type_id;
            // console.log(this.userProfile);
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
            this.getLanguage();
            this.loadData();
          } else {
            alert('No project decentralization');
          }          
        } else {
          alert('Wrong login information');
        }
      }
      );
  }

  items: any | undefined;
  activeItem: any | undefined;
  token: any;   
  ngOnInit(): void {
    this.getDate();
    // this.getMonth(newDate, 'MM');
    this.project_id = Helper.ProjectID();
    localStorage.removeItem('_u');
    localStorage.removeItem('user_profile');

    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    if (Helper.getPrams('token', this.activate)) {
      this.token = this.activate.snapshot.queryParamMap.get('token');
      this.loginByToken(Helper.getPrams('token', this.activate));
    }
    this.items = [
      { 
        label: 'Dashboard', 
        icon: 'pi pi-home' 
      },
      {
        label: 'Programmatic',
        icon: 'pi pi-palette'
      }
    ];

    this.activeItem = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  menuItem: any = undefined;
  loadData() {
    this._service.WebApp_EmployeeGetFunction(this.project_id)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.menuItem = data.data.functions;
          // console.log(this.menuItem);
        }
      })
  }

  dialogEmployee: any = false;
  dialogAttendanceReport: any = false;
  dialogSelloutReport: any = false;
  showDialog(rawData: any) {
    if (rawData === 'Employees') {
      this.dialogEmployee = true;
    } else if (rawData === 'Attendance') {
      this.dialogAttendanceReport = true;
    } else if (rawData === 'Sell Out') {
      this.dialogSelloutReport = true;
    } else if (rawData === 'POSM') {
      
    } else if (rawData === 'Process') {
      
    } else if (rawData === 'Contact') {
      
    } else if (rawData === 'Document') {
      
    }
  }
  closeDialogEmployee() {
    this.dialogEmployee = false;
  }
  closeDialogAttendanceReport() {
    this.dialogAttendanceReport = false;
  }
  closeDialogSellOutReport() {
    this.dialogSelloutReport = false;
  }

  dialogInfo: any = false;
  showInfo() {
    this.dialogInfo = true;
  }
  closeInfo() {
    this.dialogInfo = false;
  }

  return_layout_home() {
    // window.history.back();
    console.log("return_layout_home");
  }
}
