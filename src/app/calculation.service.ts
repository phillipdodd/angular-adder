import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { from, Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Calculation } from './calculation';

import { MessageService } from './message.service';

import { CosmosClient, FeedResponse, ItemDefinition } from "@azure/cosmos";

@Injectable({
  providedIn: 'root'
})
  
export class CalculationService {

  private updateCalculationHistorySubject = new Subject<any>();

  private cosmosKey = "FMJ7VDezxY2YS6NpG5AqqLXhkK36sWsOVS3xK4YH9xW2xylpaMA6CkAfp507eZ1n1e5oIejU0tvkt81ZeyKDGQ==";
  private cosmosEndpoint = "https://angularadderadmin.documents.azure.com:443/";
  private cosmosDatabaseId = "angular-adder";
  private cosmosContainerId = "calculations";
  private client = new CosmosClient({ endpoint: this.cosmosEndpoint, key: this.cosmosKey });

  private azureFunctionDict = {
    'add': 'https://angularadder.azurewebsites.net/api/Add'
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getCalculations(): Observable<FeedResponse<ItemDefinition>> {
    return from(this.client.database(this.cosmosDatabaseId).container(this.cosmosContainerId).items.readAll().fetchAll()).pipe(
      tap(_ => this.messageService.add('CalculationService: fetched calculations')),
      catchError(this.handleError<FeedResponse<ItemDefinition>>('getCalculations'))
    );
  }

  createCalculation(calculation: Calculation): Observable<Calculation> {
    let urlWithParams = `${this.azureFunctionDict.add}?firstAddend=${calculation.firstAddend}&secondAddend=${calculation.secondAddend}`;

    return this.http.post<Calculation>(urlWithParams, this.httpOptions).pipe(
      tap((newCalculation: Calculation) => this.log(`added new calculation with id ${newCalculation.id}`)),
      catchError(this.handleError<Calculation>('createCalculation')) 
    );
  }

  add(calculation: Calculation): Observable<Calculation>|undefined {
    let numFirstAddend = tryConvertToNumberOrZero(calculation.firstAddend);
    let numSecondAddend = tryConvertToNumberOrZero(calculation.secondAddend);

    if (numFirstAddend === undefined || numSecondAddend === undefined) {
      this.log(`CalculationComponent: Unable to add "${calculation.firstAddend}" and "${calculation.secondAddend}"`);
      return undefined;
    }

    calculation.sum = numFirstAddend + numSecondAddend;
    
    let creationObservable = this.createCalculation(calculation);
    creationObservable.subscribe(calculation => {
      if (calculation) {
        this.updateCalculationHistory();
      }
    });

    return creationObservable;
  }

  getUpdateHistorySubject(): Observable<any> {
    return this.updateCalculationHistorySubject.asObservable();
  }

  updateCalculationHistory(): void {
    this.updateCalculationHistorySubject.next({});
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

function tryConvertToNumberOrZero(str: string): number | undefined {
  let result = undefined;
  if (str === "") {
    result = 0;
  } else if (!isNaN(+str)) {
    result = +str;
  }
  return result;
}