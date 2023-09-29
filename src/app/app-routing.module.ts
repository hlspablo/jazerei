import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { authGuard } from "./guards/auth.guard"

const routes: Routes = [
  {
    path: "",
    data: { title: "Home" },
    loadChildren: () => import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "game/:id",
    data: { title: "Detalhes" },
    loadChildren: () =>
      import("./pages/game-detail/game-detail.module").then((m) => m.GameDetailPageModule),
  },
  {
    path: "chat",
    data: { title: "Chat" },
    loadChildren: () => import("./pages/chat/chat.module").then((m) => m.ChatPageModule),
    canActivate: [authGuard],
  },
  {
    path: "publish",
    data: { title: "Publicar" },
    loadChildren: () => import("./pages/publish/publish.module").then((m) => m.PublishPageModule),
    canActivate: [authGuard],
  },
  {
    path: "my-games",
    data: { title: "Meus Jogos" },
    loadChildren: () => import("./pages/my-games/my-games.module").then((m) => m.MyGamesPageModule),
  },
  {
    path: "my-games/:id",
    data: { title: "Jogos" },
    loadChildren: () => import("./pages/my-games/my-games.module").then((m) => m.MyGamesPageModule),
  },
  {
    path: "profile/:id",
    data: { title: "Perfil" },
    loadChildren: () => import("./pages/profile/profile.module").then((m) => m.ProfilePageModule),
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
