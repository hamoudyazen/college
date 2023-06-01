import { Component, OnInit } from '@angular/core';
import { ExpensesAndIncome, User } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-financial-add',
  templateUrl: './financial-add.component.html',
  styleUrls: ['./financial-add.component.css']
})
export class FinancialAddComponent implements OnInit {
  userDetails: User[] = [];
  userID: any;
  income: ExpensesAndIncome = {
    type: 'income',
    amount: 0,
    category: '',
    description: '',
    date: new Date(),
    userId: ''
  };
  expenses: ExpensesAndIncome = {
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
    date: new Date(),
    userId: ''
  };
  constructor(private sharedService: SharedService, private authService: AuthService) { }
  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails();
      this.userID = this.userDetails[0].id;
      this.income.userId = this.userID;
      this.expenses.userId = this.userID;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  onSubmitIncome() {
    this.authService.createExpensesAndIncome(this.income).subscribe(response => {
      alert("Added income successfully");
      location.reload();
    });
  }
  onSubmitExpenses() {
    this.authService.createExpensesAndIncome(this.expenses).subscribe(response => {
      location.reload();
    });
  }
}
