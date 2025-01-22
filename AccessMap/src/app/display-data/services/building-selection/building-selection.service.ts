import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BuildingSelectionService {
  private selectedBuildingId: WritableSignal<string | null> = signal<
    string | null
  >(null);

  public getSelectedBuildingId(): Signal<string | null> {
    return this.selectedBuildingId;
  }

  public setSelectedBuildingId(buildingId: string): void {
    this.selectedBuildingId.set(buildingId);
  }

  public clearSelectedBuildingId(): void {
    this.selectedBuildingId.set(null);
  }
}
