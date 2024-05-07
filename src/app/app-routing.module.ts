import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { PlacesComponent } from './pages/places/places.component';
import { CreateAdminComponent } from './pages/create-admin/create-admin.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { CitiesComponent } from './pages/cities/cities.component';
import {AuthGuard} from './core/_guards/auth.guard';
import { ReadyPlansComponent } from './pages/ready-plans/ready-plans.component';
import { PlaceDetailsComponent } from './pages/place-details/place-details.component';
export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'cities',
        component: CitiesComponent,
      },
      {
        path: 'places',
        component: PlacesComponent,
      },
      {
        path: 'create-admin',
        component: CreateAdminComponent,
      },
      {
        path: 'ready-plans',
        component: ReadyPlansComponent
      },
      {
        path: 'places-details',
        component: PlaceDetailsComponent
      }
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'error',
        component: ErrorComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
