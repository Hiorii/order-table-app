import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../../shared/services/session.service';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public userExist = false;
  public passwordsDoNotMatch = false;
  public isFormCorrect = false;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.listenFormChanges();
  }

  createForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        passwordRepeat: ['', [Validators.required]]
      },
      { validator: this.checkPasswords }
    );
  }

  listenFormChanges(): void {
    this.registerForm?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((control) => {
      this.passwordsDoNotMatch = control?.password === control?.passwordRepeat;
      this.isFormCorrect = this.registerForm.valid && this.passwordsDoNotMatch;
    });
  }

  register(): void {
    this.passwordsDoNotMatch = false;

    if (this.registerForm.errors?.['notMatching']) {
      this.passwordsDoNotMatch = true;
      return;
    }

    const users = JSON.parse(this.sessionService.get('users') as string) || [];
    const userExists = users.some((user: UserModel) => user.username === this.registerForm.value.username);

    if (userExists) {
      this.userExist = true;
      return;
    }

    const newUser = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    users.push(newUser);
    this.sessionService.set('users', JSON.stringify(users));
    this.router.navigate(['authentication/login']);
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const passwordRepeat = group.get('passwordRepeat')?.value;
    return password === passwordRepeat ? null : { notMatching: true };
  }
}
