import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { UserModel } from '../models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  @Input() public isRegister: boolean = false;
  @Input() public registerForm: FormGroup;

  @Input() set userExist(value: boolean) {
    this._userExist = value;
  }

  @Input() set isFormCorrect(value: boolean) {
    this._isFormCorrect = value;
  }

  @Output() registerHandler: EventEmitter<void> = new EventEmitter();
  public form: FormGroup;
  public _userExist: boolean = false;
  public wrongUser: boolean = false;
  public _isFormCorrect: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private destroyRef: DestroyRef,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.listenFormChanges();
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  listenFormChanges(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this._isFormCorrect = this.form.valid;
    });
  }

  login(): void {
    const users = JSON.parse(this.sessionService.get('users') as string) || [];
    const user = users.find((u: UserModel) => u.username === this.form.value.username && u.password === this.form.value.password);

    if (!user) {
      this.wrongUser = true;
      return;
    }
    localStorage.setItem('currentUser', JSON.stringify({ username: user.username }));
    this.router.navigate(['/']);
  }

  register(): void {
    this.registerHandler.emit();
  }
}
