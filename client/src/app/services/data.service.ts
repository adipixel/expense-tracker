import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http) {
    console.log('Data Service Connected');
  }

  getUsers(token){
    let headers = new Headers({'token': token});
    let options = new RequestOptions({headers:headers});
    return this.http.get('http://localhost:3000/api/users', options)
    .map(res => res.json());
  }

  getProfile(user_id){
    return this.http.get('http://localhost:3000/api/user/'+user_id)
    .map(res => res.json());
  }

  addUser(user){
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers:headers});
    return this.http.post('http://localhost:3000/api/user/add', user, options)
    .map(res => res.json());
  }

  verifyUser(user){
    let headers = new Headers({'contentType': 'application/json'});
    let options = new RequestOptions({headers:headers});
    return this.http.post('http://localhost:3000/api/user/verify', user, options)
    .map(res => res.json());
  }

}
