import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  Output,
  Signal,
} from '@angular/core';
import { BuildingCardComponent } from './building-card/building-card.component';
import { DATA } from '../../models/data.model';
import { debounceTime, fromEvent, map, Observable, Subscription } from 'rxjs';
import { SpinnerFieryComponent } from '../../../common/components/spinners/spinner-fiery/spinner-fiery.component';
import { BuildingSelectionService } from '../../services/building-selection/building-selection.service';
import { BuildingData2Service } from '../../services/building-data/building-data.service';

@Component({
  selector: 'app-buildings-list',
  imports: [BuildingCardComponent, SpinnerFieryComponent],
  templateUrl: './buildings-list.component.html',
  styleUrl: './buildings-list.component.css',
})
export class BuildingsListComponent implements OnInit, OnDestroy {
  @Input() public isLoading = false;
  @Output() public isLoadingChange = new EventEmitter<boolean>();

  @Output() public loadMoreData = new EventEmitter<boolean>();

  private buildingDataService: BuildingData2Service =
    inject(BuildingData2Service);
  private buildingSelectionService: BuildingSelectionService = inject(
    BuildingSelectionService,
  );

  public buildingArray: InputSignal<DATA.Building[]> =
    input.required<DATA.Building[]>();

  public areMoreBuildingAvailable: Signal<boolean> =
    this.buildingDataService.hasNextPage();
  public selectedBuildingId: Signal<string | null> =
    this.buildingSelectionService.getSelectedBuildingId();

  private subscriptionArray: Subscription[] = [];

  public constructor() {
    effect(() => {
      const selectedBuildingId: string | null = this.selectedBuildingId();
      if (selectedBuildingId) {
        this.scrollToBuildingItem(selectedBuildingId);
      }
    });
  }

  public ngOnInit(): void {
    this.subscriptionArray.push(
      this.surveyOnScroll().subscribe((atBottom) => {
        if (atBottom && !this.isLoading && this.areMoreBuildingAvailable()) {
          this.isLoadingChange.emit(true);
          this.isLoading = true;
          this.loadMoreData.emit(true);
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionArray.forEach((s) => s.unsubscribe());
  }

  public selectBuilding(building: DATA.Building): void {
    this.buildingSelectionService.setSelectedBuilding(building);
  }

  private scrollToBuildingItem(buildingId: string): void {
    const element: HTMLElement | null = document.getElementById(
      `building-${buildingId}`,
    );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private surveyOnScroll(): Observable<boolean> {
    return fromEvent(
      document.querySelector('#list-buildings-container')!,
      'scroll',
    ).pipe(
      debounceTime(200),
      map((event: Event) => {
        const element: Element = event.target as Element;
        return element
          ? element.scrollHeight - element.scrollTop === element.clientHeight
          : false;
      }),
    );
  }
}
