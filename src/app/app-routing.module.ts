import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" }, // Redirect to HomeComponent on initial load
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "game/:id",
    loadChildren: () =>
      import("./pages/game-detail/game-detail.module").then(
        (m) => m.GameDetailPageModule,
      ),
  },
  {
    path: "chat",
    loadChildren: () =>
      import("./pages/chat/chat.module").then((m) => m.ChatPageModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
