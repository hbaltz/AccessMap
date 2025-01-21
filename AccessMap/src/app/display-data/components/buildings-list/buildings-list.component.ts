import {
  Component,
  EventEmitter,
  inject,
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

@Component({
  selector: 'app-buildings-list',
  imports: [BuildingCardComponent],
  templateUrl: './buildings-list.component.html',
  styleUrl: './buildings-list.component.css',
})
export class BuildingsListComponent implements OnInit, OnDestroy {
  public buildingArray: InputSignal<DATA.Buidling[]> =
    input.required<DATA.Buidling[]>();

  @Output() loadMoreData = new EventEmitter<boolean>();

  private subscriptionArray: Subscription[] = [];
  private buildingService: BuildingService = inject(BuildingService);

  private areMoreBuildingAvailable: Signal<boolean> =
    this.buildingService.hasNextPage();

  public ngOnInit(): void {
    this.subscriptionArray.push(
      this.surveyOnScroll().subscribe((atBottom) => {
        if (atBottom && this.areMoreBuildingAvailable()) {
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
