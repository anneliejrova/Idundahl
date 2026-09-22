import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Search } from './pages/search/search';
import { ProductDetail } from './pages/product-detail/product-detail';
import { SeriesDetail } from './pages/series-detail/series-detail';
import { AdminProductList } from './pages/admin-product-list/admin-product-list';
import { AdminProductForm } from './pages/admin-product-form/admin-product-form';
import { Basket } from './pages/basket/basket';
import { Series } from './pages/series/series';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'search', component: Search },
  { path: 'series/:slug', component: SeriesDetail },
  { path: 'series/:slug/:variantSlug', component: SeriesDetail },
  { path: 'products/:slug', component: ProductDetail },
  { path: 'admin/products', component: AdminProductList },
  { path: 'admin/products/new', component: AdminProductForm },
  { path: 'basket', component: Basket },
  { path: 'series', component: Series}
];
