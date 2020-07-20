import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.css']
})
export class SessionExpiredComponent implements OnInit {

  constructor(private cRouter: Router) { }

  ngOnInit() {
  }
  onGoLogin(): void{
    this.cRouter.navigateByUrl("");
  }

}
