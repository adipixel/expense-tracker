import { Component, OnInit } from '@angular/core';
import { DataService } from  '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: User[];
  response: Response;

  constructor(private dataService:DataService) {
    
   }

  ngOnInit() {
    this.dataService.getUsers().subscribe(users => {
      if (users.success){
        this.users = users.data;
        console.log(this.users);
      }
      else{
        // error handling
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