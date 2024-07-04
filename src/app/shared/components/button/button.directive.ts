import {
  ComponentRef,
  createComponent,
  Directive,
  ElementRef,
  EnvironmentInjector,
  HostBinding,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IconComponent } from '../icon/icon.component';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective implements OnChanges {
  @Input() appButtonText: string | null;
  @Input() appButtonIcon: IconDefinition | undefined | null;

  @HostBinding('class') get classes(): string {
    return 'rounded-2xl w-full h-full font-semibold pl-12 pr-12 bg-background text-text p-4 text-xl flex justify-center items-center';
  }

  private iconComponentRef: ComponentRef<IconComponent>;
  private textNode: Text;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private injector: EnvironmentInjector
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appButtonIcon'] && this.appButtonIcon) {
      this.updateIcon();
    }

    if (changes['appButtonText'] && this.appButtonText) {
      this.updateText();
    }
  }

  private updateIcon(): void {
    if (!this.appButtonIcon) return;
    if (this.iconComponentRef) {
      this.renderer.removeChild(this.el.nativeElement, this.iconComponentRef.location.nativeElement);
      this.iconComponentRef.destroy();
    }
    const iconComponentRef = this.createIconComponent();
    this.renderer.addClass(iconComponentRef.location.nativeElement, 'mr-4');
    this.renderer.insertBefore(this.el.nativeElement, iconComponentRef.location.nativeElement, this.el.nativeElement.firstChild);
    this.iconComponentRef = iconComponentRef;
  }

  private updateText(): void {
    if (!this.appButtonText) return;
    if (this.textNode) {
      this.renderer.removeChild(this.el.nativeElement, this.textNode);
    }
    this.textNode = this.renderer.createText(this.appButtonText);
    this.renderer.appendChild(this.el.nativeElement, this.textNode);
  }

  private createIconComponent(): ComponentRef<IconComponent> {
    const componentRef = createComponent(IconComponent, {
      environmentInjector: this.injector
    });
    componentRef.instance.name = this.appButtonIcon;
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }
}
