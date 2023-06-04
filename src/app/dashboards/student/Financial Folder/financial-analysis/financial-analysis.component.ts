import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/SharedService';
import { User, ExpensesAndIncome } from 'src/app/models/allModels';
import { expensesData, detailedExpensesData, detailedCategoryExpensesData } from './chart-data';
import { Color } from '@swimlane/ngx-charts';
import { sum } from 'd3';

@Component({
  selector: 'app-financial-analysis',
  templateUrl: './financial-analysis.component.html',
  styleUrls: ['./financial-analysis.component.css']
})
export class FinancialAnalysisComponent implements OnInit {
  categorySpentTable: boolean = false;
  detailedCategoryExpensesData: any = [];
  selectedCategory: any;
  userDetails: User[] = [];
  expensesData: any = [];
  detailedExpensesData: any = [];

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
    Object.assign(this, { expensesData, detailedExpensesData, detailedCategoryExpensesData });
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
          const currentDate = new Date();
          const date = new Date(this.userExpensesAndIncome[i].date);
          if (currentDate.getMonth() == date.getMonth()) {
            for (let j = 0; j < expensesData.length; j++) {
              if (expensesData[j].name === 'expense') {
                expensesData[j].value += this.userExpensesAndIncome[i].amount;
                this.addFunc(this.userExpensesAndIncome[i].category, this.userExpensesAndIncome[i].amount);
              }
            }
          }
        }
        else {
          for (let j = 0; j < expensesData.length; j++) {
            if (expensesData[j].name === 'income') {
              expensesData[j].value += this.userExpensesAndIncome[i].amount;
              this.addFunc(this.userExpensesAndIncome[i].category, this.userExpensesAndIncome[i].amount);
            }
          }
        }
      }
    }
  }

  addFunc(name: string, value: number) {
    detailedExpensesData.push({
      "name": name,
      "value": value
    });
  }

  showMonthlySpentCategory(selectedCategory: any) {
    this.detailedCategoryExpensesData = [];
    for (let i = 0; i < this.userExpensesAndIncome.length; i++) {
      if (this.userExpensesAndIncome[i].userId === this.userDetails[0].id) {
        if (this.userExpensesAndIncome[i].type === 'expense') {
          if (this.userExpensesAndIncome[i].category === selectedCategory) {
            this.detailedCategoryExpensesData.push(this.userExpensesAndIncome[i]);
          }
        }
      }
    }
    this.categorySpentTable = true;
  }


  predictNextMonthExpenses(): void {
    //Filter (add) for the past 3 months out of the userExpensesAndIncome array and add them accordingly to 1st month,2st,3st
    const currentDate = new Date();
    const firstMonthExpenses = this.userExpensesAndIncome.filter((i) => {
      const date = new Date(i.date);
      return date.getMonth() + 1 === currentDate.getMonth() && i.type === "expense";
    })

    const secondMonthExpenses = this.userExpensesAndIncome.filter((i) => {
      const date = new Date(i.date);
      return date.getMonth() + 2 === currentDate.getMonth() && i.type === "expense";
    })

    const thirdMonthExpenses = this.userExpensesAndIncome.filter((i) => {
      const date = new Date(i.date);
      return date.getMonth() + 3 === currentDate.getMonth() && i.type === "expense";
    })
    //end

    //concat all of the 3 months expenses together 
    const repeatedPayments = firstMonthExpenses.concat(secondMonthExpenses, thirdMonthExpenses);
    //end

    //find the sum amount of each category and add it to a new array
    let sumArray: any[] = [];
    for (let i = 0; i < repeatedPayments.length; i++) {
      const existingItem = sumArray.find((item) => item.category === repeatedPayments[i].category);
      if (existingItem) {
        existingItem.amount += repeatedPayments[i].amount;
      } else {
        sumArray.push({ category: repeatedPayments[i].category, amount: repeatedPayments[i].amount });
      }
    }
    //end

    //final array , get the average for each payment by getting the amount of repeated category name in the 
    //"repeatedPayments" and divide their sum from "sumArray" and add them to the final arrray
    let finalArray: any[] = [];
    for (let i = 0; i < sumArray.length; i++) {
      let count = 0;
      for (let j = 0; j < repeatedPayments.length; j++) {
        if (repeatedPayments[j].category === sumArray[i].category) {
          count++;
        }
      }
      finalArray.push({ category: sumArray[i].category, amunt: sumArray[i].amount / count });
    }
    //end

    //get the next month from the database if it had any and add  them to "returnArray" and concat with what used to have for the predcatoin array.
    const nextMonthFromDatabase = this.userExpensesAndIncome.filter((i) => {
      const date = new Date(i.date);
      return date.getMonth() === currentDate.getMonth() + 1;
    })
    const returnArray = finalArray.concat(nextMonthFromDatabase);
    //end

    console.log(returnArray);
  }
}
