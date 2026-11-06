import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { RouteProvider } from './routeprovider';

@NgModule({
  imports: [RouterModule.forRoot([])],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private routeProvider: RouteProvider, private router: Router) {
    this.loadRoutes();
  }

  loadRoutes() {
      console.log("// Dynamically add routes to the router configuration")
      this.router.resetConfig(this.routeProvider.getRoutes());
  }
}
