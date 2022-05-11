// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TwitterMlService {

//   constructor(private http: HttpClient) { }

//   getRelatedWords(word: string){

//     var frm = new FormData();
//     const headers = {'Content-Type':'multipart/form-data'};
//     //headers.append("Content-Type", "multipart/form-data");

//     frm.append('word', word);

//     this.http.post('http://app.itongue.cn:8085/word', frm, {headers}).subscribe({
//       next: (d) => {
//       console.log(d);
//     },
//     error: (e) => console.log(e)
//   });
//   }
// }
