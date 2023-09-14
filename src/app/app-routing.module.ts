import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "game/:id",
    loadChildren: () =>
      import("./pages/game-detail/game-detail.module").then((m) => m.GameDetailPageModule),
  },
  {
    path: "chat",
    loadChildren: () => import("./pages/chat/chat.module").then((m) => m.ChatPageModule),
  },
  {
    path: "publish",
    loadChildren: () => import("./pages/publish/publish.module").then((m) => m.PublishPageModule),
  },
  {
    path: "my-games",
    loadChildren: () => import("./pages/my-games/my-games.module").then((m) => m.MyGamesPageModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
