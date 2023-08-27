// home-routing.module.ts
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { GameDetailPageComponent } from "./game-detail.component"

const routes: Routes = [
  {
    path: "",
    component: GameDetailPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameDetailRoutingModule {}
