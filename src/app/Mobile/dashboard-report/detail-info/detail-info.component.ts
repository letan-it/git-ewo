import { Component } from '@angular/core';
import { Helper } from 'src/app/Core/_helper';
import { DatePipe } from '@angular/common';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { MastersService } from 'src/app/web/service/masters.service';

@Component({
  selector: 'app-detail-info',
  templateUrl: './detail-info.component.html',
  styleUrls: ['./detail-info.component.scss']
})
export class DetailInfoComponent {
  constructor(
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService
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
  currentDate: any;
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    this.currDate = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day}`;
    this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
    this.currentDate = Helper.convertDateStr1(this.currDate);
  }

  employee_info: any;
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
      this.employee_info = this.currentUser.employee[0];
    }
  }
  ngOnInit() {
    this.project_id = Helper.ProjectID();
    this.getDate();
    this.loadUser();
    // this.loadData();
    // this.loadDataEmployee();
  }

  menuItem: any = [
    {
      backGround: '#D0E1FD',
      color: '#0000AE',
      icon: 'pi pi-file-edit',
      name: 'Thông tin cá nhân'
    },
    {
      backGround: '#D0E1FD',
      color: '#0000AE',
      icon: 'pi pi-lock',
      name: 'Mật khẩu'
    },
    {
      backGround: '#D0E1FD',
      color: '#0000AE',
      icon: 'pi pi-mobile',
      name: 'Thông tin thiết bị'
    },
    {
      backGround: '#D0E1FD',
      color: '#0000AE',
      icon: 'pi pi-map-marker',
      name: 'Vị trí'
    },
    {
      backGround: '#D0E1FD',
      color: '#0000AE',
      icon: 'pi pi-user-edit',
      name: 'Quản lý'
    },
    {
      backGround: '#FFD0CE',
      color: '#D9342B',
      icon: 'pi pi-sign-out',
      name: 'Đăng xuất'
    }
  ]

  dialogEditProfile: any = false;
  dialogPassword: any = false;
  dialogDeviceInfo: any = false;
  // dialogLocation: any = false;
  dialogManager: any = false;
  openDialog(rawData: any) {
    if (rawData === 'Thông tin cá nhân') {
      this.dialogEditProfile = true;
    } else if (rawData === 'Mật khẩu') {
      this.dialogPassword = true;
    } else if (rawData === 'Thông tin thiết bị') {
      this.dialogDeviceInfo = true;
    } else if (rawData === 'Vị trí') {
      // this.dialogLocation = true;
    } else if (rawData === 'Quản lý') {
      this.dialogManager = true;
    }
  }

  closeEditProfile() {
    this.dialogEditProfile = false;
  }
  closePassword() {
    this.dialogPassword = false;
  }
  closeDeviceInfo() {
    this.dialogDeviceInfo = false;
  }
  // closeLocation() {
  //   this.dialogLocation = false;
  // }
  closeManager() {
    this.dialogManager = false;
  }
}
