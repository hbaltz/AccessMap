import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BuildingFilterService } from '../../../services/building-filter/building-filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-building-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './building-filter.component.html',
  styleUrl: './building-filter.component.css',
})
export class BuildingFilterComponent implements OnInit, OnDestroy {
  private nonNullableFormBuilder: NonNullableFormBuilder = inject(
    NonNullableFormBuilder,
  );
  private buildingFilterService: BuildingFilterService = inject(
    BuildingFilterService,
  );

  public postalCodeForm = this.nonNullableFormBuilder.group({
    postalCode: [null, [Validators.required, Validators.pattern(/^\d{5}$/)]],
  });
  public isFiltersActive: boolean = false;

  private subscriptionArray: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptionArray.push(
      this.buildingFilterService
        .isFiltersActive()
        .subscribe(
          (isFiltersActive) => (this.isFiltersActive = isFiltersActive),
        ),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionArray.forEach((subscription) =>
      subscription.unsubscribe(),
    );
  }

  public onSubmit(): void {
    if (this.postalCodeForm.valid) {
      this.buildingFilterService.updatePostalCodeFilter(this.postalCode?.value);
    } else {
      console.error(
        'Invalid postal code. Current value: ',
        this.postalCode?.value,
      );
    }
  }

  public reinitFilters(): void {
    this.buildingFilterService.clearPostalCodeFilter();
    this.postalCodeForm.reset();
  }

  private get postalCode(): AbstractControl | null {
    return this.postalCodeForm.get('postalCode');
  }
}
