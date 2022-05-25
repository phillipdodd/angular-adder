import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Calculation } from './calculation';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
  
export class CalculationService {

  private updateCalculationHistorySubject = new Subject<any>();
  private calculationsUrl = 'api/calculations';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getCalculations(): Observable<Calculation[]> {
    return this.http.get<Calculation[]>(this.calculationsUrl)
      .pipe(
        tap(_ => this.messageService.add('CalculationService: fetched calculations')),
        catchError(this.handleError<Calculation[]>('getCalculations', []))
      );
  }

  addCalculation(calculation: Calculation): Observable<Calculation> {
    return this.http.post<Calculation>(this.calculationsUrl, calculation, this.httpOptions).pipe(
      tap((newCalculation: Calculation) => this.log(`added new calculation with id ${newCalculation.id}`)),
      catchError(this.handleError<Calculation>('addCalculation')) 
    );
  }

  getUpdateHistorySubject(): Observable<any> {
    return this.updateCalculationHistorySubject.asObservable();
  }

  updateCalculationHistory(calculation: Calculation): void {
    this.updateCalculationHistorySubject.next({ calculation });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add(`CalculationService: ${message}`)
  }
}