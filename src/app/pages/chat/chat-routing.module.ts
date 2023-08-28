// home-routing.module.ts
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ChatPageComponent } from "./chat.component"

const routes: Routes = [
  {
    path: "",
    component: ChatPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
