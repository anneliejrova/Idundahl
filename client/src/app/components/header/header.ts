import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Wordmark } from '../wordmark/wordmark';
import { ThemedImage } from '../themed-image/themed-image';

@Component({
  imports: [RouterLink, Wordmark, ThemedImage],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  logoUrl = 'https://fnnyyflzqqvqwanjmnht.supabase.co/storage/v1/object/public/images/brand/logo';

  constructor(private router: Router) {}

  onSearch(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const query = (form.elements.namedItem('q') as HTMLInputElement).value;
    if (query.trim().length < 2) return;
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }
}
