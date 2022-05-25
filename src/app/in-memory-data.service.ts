import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Calculation } from './calculation';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const calculations = [
    { id: 1, firstAddend: "2", secondAddend: "2", sum: 4, timestamp: new Date() },
    { id: 2, firstAddend: "1", secondAddend: "2", sum: 3, timestamp: new Date() },
    { id: 3, firstAddend: "14", secondAddend: "14", sum: 28, timestamp: new Date() }
  ];
    return { calculations };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(calculations: Calculation[]): number {
    return calculations.length > 0 ? Math.max(...calculations.map(calculation => calculation.id)) + 1 : 11;
  }
}