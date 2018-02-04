import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dash-body',
  templateUrl: './dash-body.component.html',
  styleUrls: ['./dash-body.component.css']
})
export class DashBodyComponent implements OnInit {

  @Input() user: User;
  @Output() myEvent = new EventEmitter();

  total_exp: Number = 0;
  amount: Number;
  description: string;

  constructor(private dataService:DataService, private router:Router) { }

  ngOnInit() {
    var add: Number;
    for (let ex of this.user.expenses){
      this.total_exp += ex.amount;
    }
  }

  addExpense(){
    var exp = {
      description: this.description,
      amount: this.amount
    }
    this.dataService.addExpense(exp).subscribe(response => {
      if(response.success){
        console.log(response.result);
        this.myEvent.emit(null)
        this.ngOnInit();

      }
    });
    
    

  }



  // ngOnChanges(changes: SimpleChanges) {
  //   // only run when property "data" changed
  //   if (changes['user']) {
  //       this.user = this.groupByCategory(this.data);
  //   }
}


}

// interface Expense{
//   description: string;
//   amount: Number
// }
interface User{
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  expenses: any,
  role: string,
  total_expense: number
}
