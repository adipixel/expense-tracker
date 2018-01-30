import { Component, OnInit } from '@angular/core';
import { DataService } from  '../../services/data.service';

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

  constructor(private dataService:DataService) { 
    console.log();
  }

  ngOnInit() {
    this.dataService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  loginSubmit(){
    const newUser = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password
    }
    this.dataService.addUser(newUser)
    .subscribe(user => {
      this.users.push(user);
    });
  }

}

interface User{
  first_name: string,
  last_name: string,
  email: string,
  password: string
}