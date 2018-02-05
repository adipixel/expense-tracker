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

  total_exp: number = 0;
  amount: number;
  description: string;

  constructor(private dataService:DataService, private router:Router) { }

  ngOnInit() {
    this.updateTotal();
    
  }

  updateTotal(){
    var add: number = 0;
    for (let ex of this.user.expenses){
      add += ex.amount;
    }
    this.total_exp = add;
    console.log("Total Updated: "+ this.total_exp);
  }


  addExpense(){
    var exp = {
      description: this.description,
      amount: this.amount
    }
    this.dataService.addExpense(exp).subscribe(response => {
      if(response.success){
        console.log(response.msg);
        this.total_exp = this.total_exp + this.amount;
        this.myEvent.emit(null);

      }
    }, (err)=> console.log(err),
    ()=>{
      //this.updateTotal();
    });
    
    

  }



  // ngOnChanges(changes: SimpleChanges) {
  //   // only run when property "data" changed
  //   if (changes['user']) {
  //       this.user = this.groupByCategory(this.data);
  //   }
}


// interface Expense{
//   description: string;
//   amount: number
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
