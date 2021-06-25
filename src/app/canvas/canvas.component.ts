import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  constructor() { }

  @Input() sizeX = 300;
  @Input() sizeY = 300;
  gridStep=6;

  matrix: number[][] | undefined;

  matrixPrevs1: string | undefined;
  matrixPrevs2: string | undefined;
  matrixPrevs3: string | undefined;

  stepNumber = 0;
  timer: any;

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.renderGrid();
    this.CreateMatrix();

    this.timer = setInterval(this.refresh.bind(this),50);
  }

  canvas:HTMLCanvasElement | undefined;

  checkEndGame(){

    let m = JSON.stringify(this.matrix);

    if(this.stepNumber>10 &&
      (m == this.matrixPrevs1 ||
      m == this.matrixPrevs2 ||
      m == this.matrixPrevs3)){
      clearInterval(this.timer);
      alert("Game Over: You score "+ this.stepNumber);
    }
    else{
      this.matrixPrevs3 = this.matrixPrevs2;
      this.matrixPrevs2 = this.matrixPrevs1;
      this.matrixPrevs1 = m;
    }
  }

  renderGrid(){

    if (this.canvas) {
      let ctx = this.canvas.getContext('2d');

      for(let x=0; x<=this.gridStep*this.sizeX; x+=this.gridStep){
        ctx?.beginPath();
        ctx?.moveTo(x,0);
        ctx?.lineTo(x,this.sizeY*this.gridStep);
        ctx!.strokeStyle = "#666666";
        ctx!.globalAlpha = 0.2;
        ctx?.stroke();
      }

      for(let y=0; y<=this.gridStep*this.sizeY; y+=this.gridStep){
        ctx?.beginPath();
        ctx?.moveTo(0,y);
        ctx?.lineTo(this.sizeX*this.gridStep,y);

        ctx!.strokeStyle = "#666666";
        ctx!.globalAlpha = 0.2;
        ctx?.stroke();
      }
    }
  }

  CreateMatrix(){

    this.matrix = [];

    for(let x=0;x<this.sizeX;x++){
      let row:number[] = [];

      for(let y =0;y<this.sizeY;y++){
        let cell = Math.floor(Math.random()*1.5);
        row.push(cell);
      }

      this.matrix.push(row);
    }

    // this.matrix[2][2]=1;
    // this.matrix[2][3]=1;
    // this.matrix[2][4]=1;


    this.renderMatrix();

  }

  refresh(){
    this.calculateMatrix();
    this.renderMatrix();
    this.endUpdate();
    this.stepNumber++;
    this.checkEndGame();

   // console.log(this.stepNumber);
  }

  renderMatrix(){
    if (this.canvas) {
      let ctx = this.canvas.getContext('2d');
      ctx!.globalAlpha = 1;

      for(let x=0;x<this.sizeX;x++){
        for(let y =0;y<this.sizeY;y++){
          let item = this.matrix![x][y];
          if(item == -1){
            ctx?.fillRect(x*this.gridStep+1,y*this.gridStep+1,3,3);
          }
          if(item == 3){
            ctx?.clearRect(x*this.gridStep+1,y*this.gridStep+1,3,3);
          }
        }
      }

    }
  }

  endUpdate(){
    for(let x=0;x<this.sizeX;x++){
      for(let y =0;y<this.sizeY;y++){
        if(this.matrix![x][y]==2){
          this.matrix![x][y] = 1;
        }
        if(this.matrix![x][y]==-2){
          this.matrix![x][y] = 0;
        }
        if(this.matrix![x][y] == -1){
          this.matrix![x][y] = 1;
        }
        if(this.matrix![x][y] == 3){
          this.matrix![x][y] = 0;
        }
      }
    }
  }

  GetState(x:number, y:number){
    if(x<0){
      x=this.sizeX-1;
    }
    if(x==this.sizeX){
      x=0;
    }
    if(y<0){
      y=this.sizeY-1;
    }
    if(y==this.sizeY){
      y=0;
    }
    return this.matrix![x][y] > 0 ? 1 : 0;
  }

  calculateMatrix(){
    for(let x=0;x<this.sizeX;x++){
      for(let y =0;y<this.sizeY;y++){

        let item = this.matrix![x][y];

        let state = [];



        state.push(this.GetState(x-1,y-1));
        state.push(this.GetState(x-1,y));
        state.push(this.GetState(x-1,y+1));

        state.push(this.GetState(x,y-1));
        state.push(this.GetState(x+1,y-1));

        state.push(this.GetState(x,y+1));
        state.push(this.GetState(x+1,y+1));
        state.push(this.GetState(x+1,y));

        let s = state.filter(i=>i === 1).length;

        if(s<2){
          this.matrix![x][y]==0 ? this.matrix![x][y]=0 : this.matrix![x][y]=3;
        }


        if(s>3){
          this.matrix![x][y]==0 ? this.matrix![x][y]=0 : this.matrix![x][y]=3;
        }

        if((s==3) && item != 1){
          this.matrix![x][y]=-1;
        }

      }
    }
  }


}
