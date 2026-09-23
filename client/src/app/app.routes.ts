import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Series } from './pages/series/series';
import { Search } from './pages/search/search';
import { ProductDetail } from './pages/product-detail/product-detail';
import { SeriesDetail } from './pages/series-detail/series-detail';
import { AdminProductForm } from './pages/admin-product-form/admin-product-form';
import { AdminProductList } from './pages/admin-product-list/admin-product-list';
import { Basket } from './pages/basket/basket';
import { Checkout } from './pages/checkout/checkout';
import { Category } from './pages/category/category';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'series', component: Series},
  { path: 'search', component: Search },
  { path: 'series/:slug', component: SeriesDetail },
  { path: 'series/:slug/:variantSlug', component: SeriesDetail },
  { path: 'products/:slug', component: ProductDetail },
  { path: 'category/:slug', component: Category },
  { path: 'admin/products/new', component: AdminProductForm },
  { path: 'admin/products', component: AdminProductList },
  { path: 'basket', component: Basket },
  { path: 'checkout', component: Checkout }
];
