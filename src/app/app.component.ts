import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'life';

  start: boolean = true;
  sizeX: number = 150;
  sizeY: number = 150;


  startLife(){
    this.start= !this.start;
  }


}


