import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-author-date',
  templateUrl: './author-date.component.html',
  styleUrls: ['./author-date.component.css']
})
export class AuthorDateComponent {
  @Input() model: any;
}
