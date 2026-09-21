import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
}