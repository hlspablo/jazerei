import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { MyGamesPageComponent } from "./my-games.component"

const routes: Routes = [
  {
    path: "",
    component: MyGamesPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyGamesRoutingModule {}
