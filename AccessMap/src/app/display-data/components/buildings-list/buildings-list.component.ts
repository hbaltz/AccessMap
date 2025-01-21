import {
  Component,
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
import { BuildingService } from '../../services/building/building.service';
import { SpinnerComponent } from '../../../common/spinner/spinner.component';

@Component({
  selector: 'app-buildings-list',
  imports: [BuildingCardComponent, SpinnerComponent],
  templateUrl: './buildings-list.component.html',
  styleUrl: './buildings-list.component.css',
})
export class BuildingsListComponent implements OnInit, OnDestroy {
  @Input() public isLoading: boolean = false;
  @Output() public isLoadingChange = new EventEmitter<boolean>();

  @Output() public loadMoreData = new EventEmitter<boolean>();

  private buildingService: BuildingService = inject(BuildingService);

  public buildingArray: InputSignal<DATA.Buidling[]> =
    input.required<DATA.Buidling[]>();

  public areMoreBuildingAvailable: Signal<boolean> =
    this.buildingService.hasNextPage();

  private subscriptionArray: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptionArray.push(
      this.surveyOnScroll().subscribe((atBottom) => {
        if (atBottom && !this.isLoading && this.areMoreBuildingAvailable()) {
          this.isLoadingChange.emit(true);
          this.isLoading = true;
          this.loadMoreData.emit(true);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionArray.forEach((s) => s.unsubscribe());
  }

  public surveyOnScroll(): Observable<boolean> {
    return fromEvent(
      document.querySelector('#list-buildings-container')!,
      'scroll'
    ).pipe(
      debounceTime(200),
      map((event: any) => {
        const element = event.target;
        return (
          element.scrollHeight - element.scrollTop === element.clientHeight
        );
      })
    );
  }
}
