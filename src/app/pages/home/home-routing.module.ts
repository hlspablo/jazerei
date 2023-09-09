import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { HomePageComponent } from "./home.component"

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
  },
  {
    path: "console/:console",
    component: HomePageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
