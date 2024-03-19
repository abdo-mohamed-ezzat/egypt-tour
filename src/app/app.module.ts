import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { CitiesComponent } from './pages/cities/cities.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlacesComponent } from './pages/places/places.component';
import { CreateAdminComponent } from './pages/create-admin/create-admin.component';
import { RouterModule } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
// import { PasswordModule } from 'primeng/password';
// import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from './prime.module';
// add jwt interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/_interceptors/jwt.interceptor';
@NgModule({
  declarations: [
    FullComponent,
    AppComponent,
    BlankComponent,
    CitiesComponent,
    CategoriesComponent,
    LoginComponent,
    ErrorComponent,
    DashboardComponent,
    PlacesComponent,
    CreateAdminComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    // PasswordModule,
    // CheckboxModule,
    PrimeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
