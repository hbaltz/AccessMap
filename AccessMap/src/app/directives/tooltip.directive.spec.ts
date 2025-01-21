import { TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('TooltipDirective', () => {
  let directive: TooltipDirective;
  let mockElementRef: jasmine.SpyObj<ElementRef>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  beforeEach(() => {
    // Mock ElementRef
    mockElementRef = jasmine.createSpyObj('ElementRef', ['nativeElement']);
    mockElementRef.nativeElement = document.createElement('div');

    // Mock Renderer2
    mockRenderer = jasmine.createSpyObj('Renderer2', [
      'setAttribute',
      'addClass',
      'removeAttribute',
      'removeClass',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TooltipDirective,
        { provide: ElementRef, useValue: mockElementRef },
        { provide: Renderer2, useValue: mockRenderer },
      ],
    });

    directive = TestBed.inject(TooltipDirective);
  });

  describe('onMouseEnter', () => {
    it('should set the data-tooltip attribute with the tooltip text', () => {
      directive.tooltipText = 'Test Tooltip';
      directive.onMouseEnter();

      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'data-tooltip',
        'Test Tooltip'
      );
    });

    it('should add the tooltip-container class to the element', () => {
      directive.onMouseEnter();

      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'tooltip-container'
      );
    });
  });

  describe('onMouseLeave', () => {
    it('should remove the data-tooltip attribute from the element', () => {
      directive.onMouseLeave();

      expect(mockRenderer.removeAttribute).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'data-tooltip'
      );
    });

    it('should remove the tooltip-container class from the element', () => {
      directive.onMouseLeave();

      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'tooltip-container'
      );
    });
  });
});
