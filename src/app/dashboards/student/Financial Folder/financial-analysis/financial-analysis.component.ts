import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/SharedService';
import { User, ExpensesAndIncome } from 'src/app/models/allModels';
import { expensesData } from './chart-data';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-financial-analysis',
  templateUrl: './financial-analysis.component.html',
  styleUrls: ['./financial-analysis.component.css']
})
export class FinancialAnalysisComponent implements OnInit {
  userDetails: User[] = [];
  expensesData: any = [];
  userExpensesAndIncome: ExpensesAndIncome[] = [];
  x = 350;
  y = 350;
  // options for pie 1
  showLabels: boolean = true;
  gradient: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme = {
    domain: ['#704FC4', '#4B852C', '#B67A3D', '#5B6FC8', '#25706F']
  };
  //end
  // options for  charts bar
  legendTitle: string = 'Details:';
  legend: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  //end


  dataLoaded: boolean = false; // Flag to track if data is loaded
  constructor(private sharedService: SharedService) {
    Object.assign(this, { expensesData });
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails();
      this.userExpensesAndIncome = await this.sharedService.getUserExpensesAndIncome(this.userDetails[0].id!);
      this.update();
      this.dataLoaded = true;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  update(): void {
    for (let i = 0; i < this.userExpensesAndIncome.length; i++) {
      if (this.userExpensesAndIncome[i].userId === this.userDetails[0].id) {
        if (this.userExpensesAndIncome[i].type === 'expense') {
          for (let j = 0; j < expensesData.length; j++) {
            if (expensesData[j].name === 'expense') {
              expensesData[j].value += this.userExpensesAndIncome[i].amount;
            }
          }
        }
        else {
          for (let j = 0; j < expensesData.length; j++) {
            if (expensesData[j].name === 'income') {
              expensesData[j].value += this.userExpensesAndIncome[i].amount;
            }
          }
        }
      }
    }
  }
}
