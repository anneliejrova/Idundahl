import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { TrustBadges } from './components/trust-badges/trust-badges';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, TrustBadges],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}