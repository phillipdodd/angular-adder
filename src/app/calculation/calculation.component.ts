import { Component, OnInit } from '@angular/core';
import { Calculation } from '../calculation';
import { CalculationService } from '../calculation.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.css']
})
export class CalculationComponent implements OnInit {

  calculation: Calculation = {
    firstAddend: "",
    secondAddend: "",
    sum: 0,
    timestamp: new Date()
  }

  constructor(
    private calculationService: CalculationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  handleCalculate(): void {

    this.calculation.sum = +this.calculation.firstAddend + +this.calculation.secondAddend;

    if (isNaN(this.calculation.sum)) {
      this.messageService.add(`CalculationComponent: Unable to add "${this.calculation.firstAddend}" and "${this.calculation.secondAddend}"`);
      this.calculation.firstAddend = "";
      this.calculation.secondAddend = "";
      return;
    }

    this.calculation.timestamp = new Date();

    console.dir(this.calculation);

    this.calculationService.addCalculation(this.calculation)
      .subscribe(calculation => {
        this.calculationService.updateCalculationHistory(calculation);
      });
  }
}
