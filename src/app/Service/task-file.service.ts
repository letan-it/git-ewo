import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Helper } from '../Core/_helper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TaskFileService {
    constructor(
        private imageCompress: NgxImageCompressService,
        private httpClient: HttpClient
    ) { }
    // Methods for the encrypt and decrypt Using AES
    private apiUrl = environment.apiUrl + 'Tasks/';

    ImageRender(image: any, fileName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                this.imageCompress
                    .compressFile(img.src, -1, 80, 80)
                    .then((compressedImage) => {
                        const imgResultAfterCompression = Helper.dataURLtoFile(
                            compressedImage,
                            fileName
                        );
                        resolve(imgResultAfterCompression);
                    })
                    .catch(reject);
            };

            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    UploadImage(fileImport: any) {
        const formData = new FormData();
        formData.append('files', fileImport);
        return this.httpClient.post(this.apiUrl + 'UploadImage', formData);
    }
    UploadFile(fileImport: any) {
        const formData = new FormData();
        formData.append('files', fileImport);
        return this.httpClient.post(this.apiUrl + 'UploadFile', formData);
    }
}
