import { Component, OnInit } from '@angular/core';
import { DataService } from  '../../services/data.service';
import { Router } from '@angular/router';
import { DashSidebarComponent } from '../dash-sidebar/dash-sidebar.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})



export class DashboardComponent implements OnInit {
  user: User;
  response: Response;
  master = 'Master';

  constructor(private dataService:DataService, private router:Router) {
    
  }

  ngOnInit() {
    var token = localStorage.getItem('token');
    this.dataService.getProfile(token).subscribe(user => {
      if (user.success){
        this.user = user.data[0];
        console.log(user.data[0]);
      }
      else{
        // error handling
        console.log(user.msg);
        localStorage.removeItem('token');
        this.router.navigate(['']);
      }
    })
  }

  updateExpenses(){
    var token = localStorage.getItem('token');
    this.dataService.getProfile(token).subscribe(user => {
      if (user.success){
        this.user = user.data[0];
        console.log(user.data[0]);
      }
      else{
        // error handling
        console.log(user.msg);
        localStorage.removeItem('token');
        this.router.navigate(['']);
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