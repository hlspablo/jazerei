import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { authGuard } from "./guards/auth.guard"

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
    canActivate: [authGuard],
  },
  {
    path: "publish",
    loadChildren: () => import("./pages/publish/publish.module").then((m) => m.PublishPageModule),
    canActivate: [authGuard],
  },
  {
    path: "my-games",
    loadChildren: () => import("./pages/my-games/my-games.module").then((m) => m.MyGamesPageModule),
    canActivate: [authGuard],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
