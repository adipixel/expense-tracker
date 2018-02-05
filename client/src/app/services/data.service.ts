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

  getProfile(token){
    let headers = new Headers({'token': token});
    let options = new RequestOptions({headers:headers});
    return this.http.get('http://localhost:3000/api/user', options)
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

  addExpense(exp){
    var token = localStorage.getItem('token');
    let headers = new Headers({'token': token, 'Content-Type': 'application/json'});
    let options = new RequestOptions({headers:headers});
    return this.http.post('http://localhost:3000/api//expense/add', exp, options)
    .map(res => res.json());
  }

  deleteExpense(id){
    var token = localStorage.getItem('token');
    let headers = new Headers({'token': token, 'Content-Type': 'application/json'});
    let options = new RequestOptions({headers:headers});
    return this.http.delete('http://localhost:3000/api/expense/delete/'+id, options)
    .map(res => res.json());
  }

  updateExpense(exp){
    var token = localStorage.getItem('token');
    let headers = new Headers({'token': token, 'Content-Type': 'application/json'});
    let options = new RequestOptions({headers:headers});
    return this.http.put('http://localhost:3000/api/expense/update/', exp, options)
    .map(res => res.json());
  }
}
