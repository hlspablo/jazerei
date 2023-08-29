// home-routing.module.ts
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { PublishPageComponent } from "./publish.component"

const routes: Routes = [
  {
    path: "",
    component: PublishPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishRoutingModule {}
