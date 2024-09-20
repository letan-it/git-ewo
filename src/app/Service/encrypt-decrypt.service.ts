import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { NgxImageCompressService } from 'ngx-image-compress';
import { environment } from 'src/environments/environment';
import { Helper } from '../Core/_helper';

@Injectable({
    providedIn: 'root',
})
export class EncryptDecryptService {
    encryptKey = '1203199320052021';
    encryptIV = '1203199320052021';
    private key = CryptoJS.enc.Utf8.parse(this.encryptKey);
    private iv = CryptoJS.enc.Utf8.parse(this.encryptIV);
    constructor(private imageCompress: NgxImageCompressService) {}
    // Methods for the encrypt and decrypt Using AES
    encryptUsingAES256(text: any): any {
        var encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(text),
            this.key,
            {
                keySize: 128 / 8,
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );
        return encrypted.toString();
    }
    decryptUsingAES256(decString: any) {
        var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    public static  PUBLIC_decryptUsingAES256(decString: any) {
        var decrypted = CryptoJS.AES.decrypt(decString, CryptoJS.enc.Utf8.parse('1203199320052021'), {
            keySize: 128 / 8,
            iv: CryptoJS.enc.Utf8.parse('1203199320052021'),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    imgResultAfterCompression: any;
    ImageReder(image: any, fileName: string) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            this.imageCompress
                .compressFile(img.src, -1, 50, 50)
                .then((compressedImage) => {
                    this.imgResultAfterCompression = Helper.dataURLtoFile(
                        compressedImage,
                        fileName
                    );
                    return this.imgResultAfterCompression;
                });
        };
    }
}
