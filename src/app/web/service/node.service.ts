import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable()
export class NodeService {

    constructor(private http: HttpClient) { }


    PostMessage(timestamp: string, from: string, to: string, message: string) {
        return this.http.post( 'https://signalrhub.acacy.vn/api/Tasks/PostMessage', {timestamp,from,to,message}
        );
    }

    PushNoti( token_client: string,
        type_code: string,
        clickAction: string,
        title: string,
        desc: string,
        content: string,
        platform: string,
        project_id: number,) {
        return this.http.post( 'https://audit.acacy.vn/api/Tasks/PushNoti', {token_client,type_code,clickAction,title,desc,content,platform,project_id}
        );
    }
    getFiles() {
        return this.http.get<any>('assets/demo/data/files.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);
    }

    getLazyFiles() {
        return this.http.get<any>('assets/demo/data/files-lazy.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);
    }

    getFilesystem() {
        return this.http.get<any>('assets/demo/data/filesystem.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);
    }

    getLazyFilesystem() {
        return this.http.get<any>('assets/demo/data/filesystem-lazy.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);
    }
}
 