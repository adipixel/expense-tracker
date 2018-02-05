import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NgModule } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CustomMaterialModule } from '../../modules/custom-material/custom-material.module';

@NgModule({
  imports: [CustomMaterialModule],
})

@Component({
  selector: 'app-dash-body',
  templateUrl: './dash-body.component.html',
  styleUrls: ['./dash-body.component.css']
})
export class DashBodyComponent implements OnInit {

  @Input() user: User;
  @Output() myEvent = new EventEmitter();

  disableUpdateBtn:boolean = true;

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
      console.log(response.msg);
      if(response.success){
        this.total_exp = this.total_exp + this.amount;
        this.myEvent.emit(null);
      }
    }, (err)=> console.log(err),
    ()=>{
      //this.updateTotal();
    });
  }

  deleteExpense(ex){
    this.dataService.deleteExpense(ex._id).subscribe(response => {
      console.log(response.msg);
      if(response.success){
        this.total_exp = this.total_exp - ex.amount;
        this.myEvent.emit(null);
      }
    });
  }

  updateExpense(expIn){
    var exp = {
      _id: expIn._id,
      description: expIn.description,
      amount: expIn.amount
    }
    this.dataService.updateExpense(exp).subscribe(response => {
      console.log(response.msg);
      if(response.success){
        this.myEvent.emit(null);
      }
    }, (err)=> console.log(err),
    ()=>{
      this.updateTotal();
    });
  }

  enableUpdateBtn(event){
    console.log(event);
  }
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
