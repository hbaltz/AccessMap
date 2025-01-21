import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  private elementRef: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  @Input('appTooltip') public tooltipText: string = '';

  @HostListener('mouseenter') public onMouseEnter(): void {
    // Set a custom attribute to hold the tooltip text
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'data-tooltip',
      this.tooltipText
    );

    // Add the tooltip CSS class
    this.renderer.addClass(this.elementRef.nativeElement, 'tooltip-container');
  }

  @HostListener('mouseleave') public onMouseLeave(): void {
    // Remove the custom attribute and CSS class when the mouse leaves
    this.renderer.removeAttribute(
      this.elementRef.nativeElement,
      'data-tooltip'
    );
    this.renderer.removeClass(
      this.elementRef.nativeElement,
      'tooltip-container'
    );
  }
}
