import { Component, OnInit } from '@angular/core';
import { Calculation } from '../calculation';
import { CalculationService } from '../calculation.service';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.css']
})
export class CalculationComponent implements OnInit {

  calculation: Calculation = {
    firstAddend: "",
    secondAddend: "",
    sum: 0
  }

  constructor(
    private calculationService: CalculationService
  ) { }

  ngOnInit(): void {
  }

  handleCalculate(): void {
    if (this.calculation.firstAddend === "") {
      this.calculation.firstAddend = "0";
    }

    if (this.calculation.secondAddend === "") {
      this.calculation.secondAddend = "0";
    }

    let observable = this.calculationService.add(this.calculation);
    if (observable) {
      observable.subscribe(_ => this.resetCalculationValues());
    }
  }

  private resetCalculationValues(): void {
    this.calculation.firstAddend = "";
    this.calculation.secondAddend = "";
    this.calculation.sum = 0;
  }
}