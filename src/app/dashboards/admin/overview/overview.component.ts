import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/SharedService';
import { User, ExpensesAndIncome, Grade, Course } from 'src/app/models/allModels';
import { gradesData, incomeAndExpensesData } from './charts-data';
import { Color } from '@swimlane/ngx-charts';
import { sum } from 'd3';
import { AuthService } from 'src/app/services/AuthService';
import { error } from 'jquery';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  userDetails: User[] = [];
  gradesData: any = [];
  incomeAndExpensesData: any = [];

  allGrades: Grade[] = [];
  allUsers: User[] = [];
  allCourses: Course[] = []
  allIncomeAndExpenses: ExpensesAndIncome[] = [];
  x = 200;
  y = 200;

  dataLoaded: boolean = false;
  totalStudents: number = 0;
  passPercentage: number = 0;
  failPercentage: number = 0;

  totalIncomeAndExpenses: number = 0;
  incomePercentage: number = 0;
  expensePercentage: number = 0;

  constructor(private sharedService: SharedService, private AuthService: AuthService) {
    Object.assign(this, { gradesData, incomeAndExpensesData });
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails();
      this.allGrades = await this.sharedService.getAllGrades();
      this.allUsers = await this.sharedService.getAllUsers();
      this.allCourses = await this.sharedService.getAllCoursesAdmin();
      this.updateGradesStatistics();
      this.updateIncomeAndExpensesStatistics();

      this.dataLoaded = true;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  updateGradesStatistics() {
    let passCount = 0;
    let failCount = 0;

    for (let i = 0; i < this.allGrades.length; i++) {
      if (this.allGrades[i].grade >= 55) {
        passCount++;
      } else {
        failCount++;
      }
    }

    this.totalStudents = passCount + failCount;
    this.passPercentage = (passCount / this.totalStudents) * 100;
    this.failPercentage = (failCount / this.totalStudents) * 100;

    this.gradesData[0].value = passCount;
    this.gradesData[0].percent = this.passPercentage;
    this.gradesData[1].value = failCount;
    this.gradesData[1].percent = this.failPercentage;
  }



  updateIncomeAndExpensesStatistics() {
    for (let i = 0; i < this.allUsers.length; i++) {

      this.AuthService.getExpensesAndIncome(this.allUsers[i].id!).subscribe(response => {
        this.allIncomeAndExpenses = response;
        if (response) {
          let incomeCount = 0;
          let expenseCount = 0;

          for (let i = 0; i < this.allIncomeAndExpenses.length; i++) {
            if (this.allIncomeAndExpenses[i].type === 'income') {
              incomeCount++;
            } else {
              expenseCount++;
            }
          }
          this.totalIncomeAndExpenses = incomeCount + expenseCount;
          this.incomePercentage = (incomeCount / this.totalIncomeAndExpenses) * 100;
          this.expensePercentage = (expenseCount / this.totalIncomeAndExpenses) * 100;

          this.incomeAndExpensesData[0].value = incomeCount;
          this.incomeAndExpensesData[1].value = expenseCount;
        }
      }, error => {
        this.totalIncomeAndExpenses = 0;
        this.incomePercentage = 0;
        this.expensePercentage = 0;
      });
    }
  }

}
