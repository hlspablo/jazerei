import { Component, OnInit, inject } from "@angular/core"
import { ActivatedRoute } from "@angular/router"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomePageComponent implements OnInit {
  private routes = inject(ActivatedRoute)

  ngOnInit(): void {
    this.routes.paramMap.subscribe((params) => {
      console.log(params)
    })
  }
}
