import { Component, OnInit } from '@angular/core';
import { DataService } from  '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: User[];
  response: Response;

  constructor(private dataService:DataService, private router:Router) {
    
  }

  ngOnInit() {
    var token = localStorage.getItem('token');
    this.dataService.getUsers(token).subscribe(users => {
      if (users.success){
        this.users = users.data;
        console.log(users.data);
      }
      else{
        // error handling
        this.router.navigate(['']);
        console.log(users.msg);
      }
    })
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