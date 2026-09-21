import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemedImage } from '../themed-image/themed-image';

interface Spot {
  categorySlug: string;
  title: string;
  imageSlug: string;
}

@Component({
  selector: 'app-spots',
  imports: [RouterLink, ThemedImage],
  templateUrl: './spots.html',
  styleUrl: './spots.css',
})
export class Spots {
  spots: Spot[] = [
    { categorySlug: 'vardag', title: 'Vardag', imageSlug: 'vardag' },
    { categorySlug: 'fest', title: 'Fest', imageSlug: 'fest' },
    { categorySlug: 'fika', title: 'Fika', imageSlug: 'fika' },
    { categorySlug: 'barn', title: 'Barn', imageSlug: 'barn' },
  ];

  imageUrl(slug: string): string {
  return `https://fnnyyflzqqvqwanjmnht.supabase.co/storage/v1/object/public/images/category/${slug}.webp`;
}
}