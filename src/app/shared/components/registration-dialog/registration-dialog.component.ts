import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from "@angular/core"
import { NonNullableFormBuilder, Validators } from "@angular/forms"
import { AuthService } from "src/app/services/auth.service"
import { cpfValidator } from "./cpf.validator"
import { registerErrorTranslate } from "src/app/utils/firebase.translate"
import { MatDialog } from "@angular/material/dialog"
import { sleepFor } from "src/app/utils/time.utils"
import { debounceTime, switchMap } from "rxjs"
import { MyLocation } from "../../interfaces/app.interface"
import { removeDiacritics } from "src/app/utils/string.utils"
import { RxActionFactory } from "@rx-angular/state/actions"
import { RxState } from "@rx-angular/state"
import { where } from "@angular/fire/firestore"
import { LocationRepository } from "src/app/repositories/location.repository"

interface UIActions {
  searchCity: string
}
interface State {
  locations: MyLocation[]
}

interface registrationForm {
  stepOne: {
    email: string
    password: string
  }
  stepTwo: {
    name: string
    cpf: string
    selectedLocationId: string | null
  }
}
@Component({
  selector: "app-registration-dialog",
  templateUrl: "./registration-dialog.component.html",
  styleUrls: ["./registration-dialog.component.scss"],
  providers: [RxActionFactory, RxState],
})
export class RegistrationDialogComponent implements OnInit, AfterViewInit {
  private _fb = inject(NonNullableFormBuilder)
  private _authService = inject(AuthService)
  private _matDialogService = inject(MatDialog)
  private _locationRepository = inject(LocationRepository)

  protected uiActions = new RxActionFactory<UIActions>().create()
  protected locations$ = this._state.select("locations")
  protected registerErrorMessage = ""
  protected isLoading = false
  protected registrationForm = this._fb.group({
    stepOne: this._fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    }),
    stepTwo: this._fb.group({
      name: ["", Validators.required],
      cpf: ["", [Validators.required, cpfValidator]],
      selectedLocationId: [null, Validators.required],
    }),
  })

  @ViewChild("emailInput") emailInput: ElementRef

  constructor(private _state: RxState<State>) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.emailInput.nativeElement.focus()
    }, 300)
  }

  onSearch(event: { term: string }) {
    this.uiActions.searchCity(removeDiacritics(event.term.trim().toLowerCase()))
  }

  async submit() {
    if (this.registrationForm.valid) {
      const values = this.registrationForm.value as registrationForm
      if (values) {
        try {
          this.registerErrorMessage = ""
          this.isLoading = true
          await this._authService.register({
            email: values.stepOne.email,
            password: values.stepOne.password,
            name: values.stepTwo.name,
            cpf: values.stepTwo.cpf,
            location: values.stepTwo.selectedLocationId || "",
          })
          await sleepFor(500)
          this._matDialogService.closeAll()
        } catch (error) {
          this.registerErrorMessage = registerErrorTranslate(error)
        } finally {
          this.isLoading = false
        }
      }
    }
  }

  ngOnInit(): void {
    this._state.connect(
      "locations",
      this.uiActions.searchCity$.pipe(
        debounceTime(300),
        switchMap((term) => {
          const queryConstraints = [
            where("name_lowercase", ">=", term),
            where("name_lowercase", "<=", term + "\uf8ff"),
          ]
          return this._locationRepository.getLocationsFilter(queryConstraints)
        }),
      ),
    )
  }
}
