import { Component } from '@angular/core';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent {
  financialData: number = 0;
  isFirstSubmitDone: boolean = false;
  firstCard: boolean = true;
  expensesInput: number = 0;
  incomeInput: number = 0;
  showAddComponent: boolean = false;
  showAnalysisComponent: boolean = true;
  showCalendarComponent: boolean = false;

  toggleComponent(name: string) {
    this.showAddComponent = false;
    this.showAnalysisComponent = false;
    this.showCalendarComponent = false;

    if (name === 'add') {
      this.showAddComponent = true;
      this.showAnalysisComponent = false;
      this.showCalendarComponent = false;
    }
    else if (name === 'analysis') {
      this.showAddComponent = false;
      this.showAnalysisComponent = true;
      this.showCalendarComponent = false;
    }
    else if (name === 'calendar') {
      this.showAddComponent = false;
      this.showAnalysisComponent = false;
      this.showCalendarComponent = true;
    }
  }
}
