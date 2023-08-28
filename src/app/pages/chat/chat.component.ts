import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatPageComponent implements OnInit {
  id: string

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("id") || ""
    })
  }
}
