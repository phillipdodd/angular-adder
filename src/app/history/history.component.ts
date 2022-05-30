import { Component, OnInit } from '@angular/core';
import { Calculation } from '../calculation';
import { CalculationService } from '../calculation.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  calculations: Calculation[]= [];

  constructor(private calculationService: CalculationService) { }

  ngOnInit(): void {
    //* Load existing calculations
    this.getCalculations();

    //* Add any new calculations
    this.calculationService.getUpdateHistorySubject()
      .subscribe(_ => {
        this.getCalculations();
      });
  }

  getCalculations(): void {
    this.calculationService.getCalculations()
      .subscribe(response => {
        this.calculations = response.resources as Calculation[]
      });
  }

}
