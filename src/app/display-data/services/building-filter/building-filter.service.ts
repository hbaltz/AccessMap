import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuildingFilterService {
  private postlaCodeFilter: BehaviorSubject<number | null> =
    new BehaviorSubject<number | null>(null);

  public getPostalCodeFilter(): Observable<number | null> {
    return this.postlaCodeFilter.asObservable();
  }

  public updatePostalCodeFilter(postalCode: number): void {
    if (/^\d{5}$/.test(postalCode.toString())) {
      this.postlaCodeFilter.next(postalCode);
    } else {
      console.error(
        'Invalid postal code: must be 5 digits. Current value: ',
        postalCode,
      );
    }
  }

  public clearPostalCodeFilter(): void {
    this.postlaCodeFilter.next(null);
  }
}
