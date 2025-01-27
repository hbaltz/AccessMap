import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DATA } from '../../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class BuildingSelectionService {
  private selectedBuilding: WritableSignal<DATA.Building | null> =
    signal<DATA.Building | null>(null, {
      // We want to triger the signal even if the building is the same (to reopen the information card for example)
      equal: () => false,
    });

  public getSelectedBuildingId(): Signal<string | null> {
    return computed(() => {
      return this.selectedBuilding()?.id || null;
    });
  }

  public getSelectedBuilding(): Signal<DATA.Building | null> {
    return this.selectedBuilding;
  }

  public setSelectedBuilding(building: DATA.Building): void {
    this.selectedBuilding.set(building);
  }

  public clearSelectedBuilding(): void {
    this.selectedBuilding.set(null);
  }
}
