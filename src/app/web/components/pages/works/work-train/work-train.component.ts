import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EnumLocalStorage, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
  selector: 'app-work-train',
  templateUrl: './work-train.component.html',
  styleUrls: ['./work-train.component.scss'],
})
export class WorkTrainComponent {
  url:any
  constructor(private edService: EncryptDecryptService, private domSanitizer: DomSanitizer) {
    this.loadUser();
    console.log(  this.userProfile );
    
    const jsonObject = {
      RefLoginType: 1,
      AccountId: Helper.ProjectID(),
      user_id: this.userProfile.user_id
    };
    
    // Step 1: Convert the object to a JSON string
    const jsonString = JSON.stringify(jsonObject);
    
    // Step 2: Encode the JSON string to Base64
    const encodedString = btoa(jsonString);
    console.log(encodedString);
    this.link += encodedString
    this.url = domSanitizer.bypassSecurityTrustResourceUrl(this.link );
  }
   
  link: any = "https://customer.acacy.com.vn/login?appShare="
  
  user_profile: string = 'current';
  currentUser: any;
  userProfile: any;
   
  loadUser() {
      if (this.user_profile == EnumSystem.current) {
          let _u = localStorage.getItem(EnumLocalStorage.user);

          this.currentUser = JSON.parse(
              this.edService.decryptUsingAES256(_u)
          );
          this.currentUser.employee[0]._status =
              this.currentUser.employee[0].status == 1 ? true : false;
          this.userProfile = this.currentUser.employee[0];
      }
  }
}
