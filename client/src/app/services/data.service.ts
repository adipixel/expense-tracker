import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http) {
    console.log('Data Service Connected');
  }

  getUsers(){
    return this.http.get('http://localhost:3000/api/users')
    .map(res => res.json());
  }

  addUser(user){
    console.log(user);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers:headers});
    return this.http.post('http://localhost:3000/api/user', user, options)
    .map(res => res.json());
  }
}
