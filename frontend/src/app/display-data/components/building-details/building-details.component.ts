import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DATA } from '../../models/data.model';
import { SpinnerFieryComponent } from '../../../common/components/spinners/spinner-fiery/spinner-fiery.component';
import { BuildingData2Service } from '../../services/building-data/building-data.service';

@Component({
  selector: 'app-building-details',
  imports: [SpinnerFieryComponent],
  templateUrl: './building-details.component.html',
  styleUrl: './building-details.component.css',
})
export class BuildingDetailsComponent implements OnChanges {
  @Input({ required: true }) public building: DATA.Building | null = null;
  @Input() public isVisible: boolean = false;
  @Output() public isVisibleChange = new EventEmitter<boolean>();

  public buildingAccessbilityArray: DATA.BuildingAccessibility[] | null = null;

  public isLoading: boolean = false;

  private buildingDataService: BuildingData2Service =
    inject(BuildingData2Service);

  public ngOnChanges(changes: SimpleChanges): void {
    if ('building' in changes && this.building) {
      this.isLoading = true;
      this.buildingDataService
        .getBuildingAccessibilityById(this.building.id)
        .subscribe((buildingAccesibilityArray) => {
          this.buildingAccessbilityArray = buildingAccesibilityArray;
          this.isLoading = false;
        });
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeWindow();
    }
  }

  public closeWindow(): void {
    this.isVisibleChange.emit(false);
  }
}
