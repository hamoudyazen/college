import { Component } from '@angular/core';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent {
  financialData: number = 0;
  isFirstSubmitDone: boolean = false;
  expensesInput: number = 0;
  incomeInput: number = 0;
  showAddComponent: boolean = false;
  showAnalysisComponent: boolean = true;

  toggleComponent(name: string) {
    this.showAddComponent = false;
    this.showAnalysisComponent = false;

    if (name === 'add') {
      this.showAddComponent = true;
      this.showAnalysisComponent = false;
    }
    else if (name === 'analysis') {
      this.showAddComponent = false;
      this.showAnalysisComponent = true;
    }
  }
}
