import { Component } from '@angular/core';
import { Wordmark } from '../wordmark/wordmark';

@Component({
  imports: [Wordmark],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {}
