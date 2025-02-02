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
import { BuildingDataService } from '../../services/building-data/building-data.service';
import { SpinnerFieryComponent } from '../../../common/components/spinners/spinner-fiery/spinner-fiery.component';

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

  public buildingDetailSectionArray: DATA.BuildingDetailsSection[] | null =
    null;

  public isLoading: boolean = false;

  private buildingDataService: BuildingDataService =
    inject(BuildingDataService);

  public ngOnChanges(changes: SimpleChanges): void {
    if ('building' in changes && this.building) {
      this.isLoading = true;
      this.buildingDataService
        .getBuildingDetails(this.building.slug)
        .subscribe((buildingDetails) => {
          this.buildingDetailSectionArray = buildingDetails;
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
