import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    constructor(private httpClient: HttpClient) { }

    private api_file = environment.api_file + 'Files/';

    // https://files.ewoapi.acacy.com.vn/api/Files/UploadImage

    // UploadImage(formDataUpload: FormData) {
    //     return this.httpClient.post(
    //         this.api_file + 'UploadImage',
    //         formDataUpload
    //     );
    // }

    // UploadFile(formDataUpload: FormData) {
    //     return this.httpClient.post(this.api_file + 'UploadFile', formDataUpload)
    // }

    private api_file_acacy = 'https://files.acacy.com.vn/upload'
    private secret_key = '1LE/VyHivhRLnpri6VQIJqtNcXmT1qMAGagCVoymU6Y='
    private project = 'files'

    FileUpload(file: File, project_code: string, modun: string, draw_text: string) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('vertical-align', 'top');
        formData.append('horizontal-align', 'left');
        formData.append('draw-text', draw_text);

        const headers = new HttpHeaders({
            'secret-key': this.secret_key,
            'project': this.project,
            'folder': `Web/${project_code}/${modun}`,
        });

        return this.httpClient.post(this.api_file_acacy, formData, { headers });
    }



}
