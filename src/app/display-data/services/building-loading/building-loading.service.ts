import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BuildingLoadingService {
  private isBuildingDataLoading: WritableSignal<boolean> =
    signal<boolean>(false);

  public getIsBuildingDataLoading(): Signal<boolean> {
    return this.isBuildingDataLoading;
  }

  public hasStartLoadingBuildingData(): void {
    this.isBuildingDataLoading.set(true);
  }

  public hasStopLoadingBuildingData(): void {
    this.isBuildingDataLoading.set(false);
  }
}
