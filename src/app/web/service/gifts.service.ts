import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GiftsService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.api_EWO_Activation + 'Gifts/';

  gifts_GetList(rowPerPage: number, pageNumber: number, project_id: number, gift_code: string,
    gift_name: string, gift_type: string, status: number) {
    return this.httpClient.post(this.apiUrl + 'gifts_GetList', {
      rowPerPage, pageNumber, project_id, gift_code, gift_name, gift_type, status
    })
  }
// , GOTIT_productId : number,GOTIT_productPriceId : number
  gifts_Action(project_id: number, id: number, gift_code: string, gift_name: string, gift_type: string, configuration: string,
    gift_image: string, amount: number, gotiT_productId:number, gotiT_productPriceId: number, status: number, action: string) {
    return this.httpClient.post(this.apiUrl + 'gifts_Action', {
      project_id, id, gift_code, gift_name, gift_type, configuration, gift_image, amount, status, action
    })
  }
 

  gifts_GetTemplate() {
    const url = this.apiUrl + 'gifts_GetTemplate';
    const options = {
      responseType: 'blob' as 'json',
    };

    return this.httpClient
      .get(url, options)
      .subscribe((response) => {
        this.saveFile(response, '_TemplateImportDataGifts');
      });
  }

  gifts_ImportData(formDataUpload: FormData, project_id: number) {
    formDataUpload.append('project_id', project_id.toString());
    return this.httpClient.post(
      this.apiUrl + 'gifts_ImportData',
      formDataUpload
    );
  }

  gifts_RawData(rowPerPage: number, pageNumber: number, project_id: number, gift_code: string,
    gift_name: string, gift_type: string, status: number) {

    const url = this.apiUrl + 'gifts_RawData';
    const options = {
      responseType: 'blob' as 'json',
    };
    const requestBody = {
      rowPerPage, pageNumber, project_id, gift_code, gift_name, gift_type, status

    };

    return this.httpClient
      .post(url, requestBody, options)
      .subscribe((response) => {
        // this.saveFile(response, 'gifts')
        this.saveFile(response, '.xlsx', 'gifts');
      });
  }

  saveFile(response: any, title: any = '.xlsx', file_name: string = '') {
    const currentTime = new Date();
    const filename =
      'download_' +
      file_name +
      '_' +
      currentTime.getFullYear().toString() +
      (currentTime.getMonth() + 1) +
      currentTime.getDate() +
      currentTime
        .toLocaleTimeString()
        .replace(/[ ]|[,]|[:]/g, '')
        .trim() +
      title;

    saveAs(response, filename);
  }


}
