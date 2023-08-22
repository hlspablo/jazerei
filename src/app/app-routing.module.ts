import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { HomeComponent as HomePageComponent } from "./pages/home/home.component"

const routes: Routes = [
  //{ path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to HomeComponent on initial load
  { path: "", component: HomePageComponent },
  // ... other routes
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
