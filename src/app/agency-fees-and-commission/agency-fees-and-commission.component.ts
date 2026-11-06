import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { FeesOrCommissionControllerService } from "../product/openapi";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-agency-fees-and-commission",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./agency-fees-and-commission.component.html",
  styleUrl: "./agency-fees-and-commission.component.css",
})
export class AgencyFeesAndCommissionComponent {
  materProductId: any;
  constructor(
    private feesAndCommission: FeesOrCommissionControllerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["data"]) {
        // Parse the combo parameter back to a JSON object
        let combo = JSON.parse(params["data"]);
        this.form.controls["name"].setValue(combo?.name);
        this.form.controls["currency"].setValue(combo?.currency);
        this.form.controls["Type"].setValue(combo?.type);
        this.form.controls["amount"].setValue(combo?.amount);
        this.materProductId = combo.id;
        console.log(combo, "aaa");
      }
    });
  }

  ngOnInit(): void {}

  form = new FormGroup({
    name: new FormControl("", Validators.required),
    Type: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required),
    parentHead: new FormControl("", Validators.required),
    amount: new FormControl("", Validators.required),
    // percentage: new FormControl("", Validators.required),
    // CommissionType: new FormControl("", Validators.required),
    currency: new FormControl("", Validators.required),
  });

  submit() {
    if (this.materProductId) {
      let body: any = {
        id: this.materProductId,
        name: this.form.controls["name"].value,
        commissionCategory: "AFC",
        currency: "AFN",
        amount: this.form.controls["amount"].value,
        type: this.form.controls["Type"].value,
        slabWiseCommissions: [],
        // percentage: this.form.controls["percentage"].value,
        // commissionType: this.form.controls["CommissionType"].value,
        subAgentCommission: null,
        active: false,
        merchantCommission: null,
      };

      this.feesAndCommission
        .updateFeesAndCommission(this.materProductId, body)
        .subscribe((res) => {
          console.log(res);
          if (res) {
            this.router.navigateByUrl("/AgencyFeesAndCommission");
          }
        });
    } else {
      let body: any = {
        name: this.form.controls["name"].value,
        commissionCategory: 4,
        currency: "AFN",
        amount: Number(this.form.controls["amount"].value),
        type: this.form.controls["Type"].value,
        slabwiseCommisions: [],
        // percentage: this.form.controls["percentage"].value,
        // commissionType: this.form.controls["CommissionType"].value,
        // subAgentCommission: 12,
        // merchantCommission: 12,
      };

      this.feesAndCommission
        .createAFCFeesOrCommission(body)
        .subscribe((res) => {
          console.log(res);
          if (res) {
            this.router.navigateByUrl("/AgencyFeesAndCommission");
          }
        });
    }
  }
}
