import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"

@Component({
  selector: "app-game-detail",
  templateUrl: "./game-detail.component.html",
  styleUrls: ["./game-detail.component.scss"],
})
export class GameDetailPageComponent implements OnInit {
  id: string

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("id") || ""
    })
  }
}
