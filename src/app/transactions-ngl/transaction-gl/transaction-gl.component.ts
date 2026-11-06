import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-transaction-gl",
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: "./transaction-gl.component.html",
  styleUrl: "./transaction-gl.component.css",
})
export class TransactionGlComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  form = new FormGroup({
    glAccNumber: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required),
    parentHead: new FormControl("", Validators.required),
  });
}
