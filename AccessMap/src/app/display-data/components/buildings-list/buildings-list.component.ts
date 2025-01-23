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
import { BuildingCardComponent } from '../building-card/building-card.component';
import { DATA } from '../../models/map.model';
import { debounceTime, fromEvent, map, Observable, Subscription } from 'rxjs';
import { BuildingDataService } from '../../services/building-data/building-data.service';
import { SpinnerComponent } from '../../../common/components/spinner/spinner.component';
import { BuildingSelectionService } from '../../services/building-selection/building-selection.service';

@Component({
  selector: 'app-buildings-list',
  imports: [BuildingCardComponent, SpinnerComponent],
  templateUrl: './buildings-list.component.html',
  styleUrl: './buildings-list.component.css',
})
export class BuildingsListComponent implements OnInit, OnDestroy {
  @Input() public isLoading = false;
  @Output() public isLoadingChange = new EventEmitter<boolean>();

  @Output() public loadMoreData = new EventEmitter<boolean>();

  private buildingDataService: BuildingDataService =
    inject(BuildingDataService);
  private buildingSelectionService: BuildingSelectionService = inject(
    BuildingSelectionService,
  );

  public buildingArray: InputSignal<DATA.Buidling[]> =
    input.required<DATA.Buidling[]>();

  public areMoreBuildingAvailable: Signal<boolean> =
    this.buildingDataService.hasNextPage();
  public selectedBuildingId: Signal<string | null> =
    this.buildingSelectionService.getSelectedBuildingId();

  private subscriptionArray: Subscription[] = [];

  constructor() {
    effect(() => {
      const selectedBuildingId = this.selectedBuildingId();
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

  public selectBuilding(buildingId: string): void {
    this.buildingSelectionService.setSelectedBuildingId(buildingId);
  }

  private scrollToBuildingItem(buildingId: string): void {
    const element = document.getElementById(`building-${buildingId}`);
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
        const element = event.target as Element;
        return element
          ? element.scrollHeight - element.scrollTop === element.clientHeight
          : false;
      }),
    );
  }
}
