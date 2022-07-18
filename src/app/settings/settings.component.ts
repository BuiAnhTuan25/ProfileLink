import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  isVisible: boolean = false;
  modalForm!: FormGroup;
  settingForm!: FormGroup;
  user:any;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.settingForm = this.fb.group({
      username: [null],
      mail: [null],
      role: [null],
    });
    this.modalForm = this.fb.group({
      newPassword: [null, Validators.required],
      confirPassword: [null, Validators.required],
    });
    this.user=JSON.parse(localStorage.getItem('auth-user')!);
    this.settingForm.patchValue(this.user);
    this.settingForm.disable();
  }
  openModal() {
    this.isVisible = true;
  }
  handleCancel() {
    this.modalForm.reset();
    this.isVisible = false;
  }
  handleOk() {
    this.isVisible = false;
  }
}
