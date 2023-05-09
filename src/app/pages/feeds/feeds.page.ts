import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit {
  count = 0;
  constructor() { }

  ngOnInit() {
  }

  

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

}
