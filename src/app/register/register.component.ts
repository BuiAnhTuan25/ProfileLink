import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm!: FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

}
