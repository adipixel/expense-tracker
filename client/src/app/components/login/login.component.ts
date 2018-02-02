import { Component, OnInit } from '@angular/core';
import { DataService } from  '../../services/data.service';
import { BootstrapOptions } from '@angular/core/src/application_ref';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users: User[];
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  expenses: any[];
  role: string;
  total_expense: number;
  login_email: string;
  login_password: string;
  loggedIn: boolean;
  response: Response;
  user_id: string;
  token:string;

  constructor(private dataService:DataService, private router:Router) { 
    console.log();
  }

  ngOnInit() {
    var token = localStorage.getItem('token');
    if(token){
      this.router.navigate(['dashboard']);
    }
    else{
      //
    }
  }

  signupSubmit(){
    var newUser = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      expenses: [],
      role: "user1",
      total_expense: 0.00
    }
    this.dataService.addUser(newUser)
    .subscribe(user => {
      if(user.success){
        this.users.push(user.data);
      }
    });
  }

  loginSubmit(){
    var user = {
      email: this.login_email,
      password: this.login_password
    }
    this.dataService.verifyUser(user)
    .subscribe(user => {
      if(user.success){
        this.token = user.token;
        localStorage.setItem('token', user.token);
      }
    },
    (err)=> console.log("error callback"),
    ()=> {return this.callDashboard()}
    )
  }

  callDashboard(){
    console.log(this.token);
    this.router.navigate(['dashboard']);
  }


}

interface User{
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  expenses: any,
  role: string,
  total_expense: number
}
interface Response {
  success: boolean,
  msg: string,
  data: any[]
}