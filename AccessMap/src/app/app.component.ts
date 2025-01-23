import { Component } from '@angular/core';
import { DisplayDataComponent } from './display-data/display-data.component';

@Component({
  selector: 'app-root',
  imports: [DisplayDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public title = 'AccessMap';
}
