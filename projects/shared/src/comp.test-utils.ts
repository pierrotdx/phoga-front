import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class CompTestUtils<T> {
  component!: T;
  fixture!: ComponentFixture<T>;

  protected testBed!: TestBed;

  constructor(
    private readonly comp: Type<T>,
    private readonly config?: {
      imports?: any[] | undefined;
      providers?: any[] | undefined;
    }
  ) {}

  protected async internalBeforeEach(): Promise<void> {
    const imports = this.config?.imports?.length
      ? [this.comp, ...this.config?.imports]
      : [this.comp];
    const providers = this.config?.providers?.length
      ? this.config?.providers
      : undefined;
    this.testBed = TestBed.configureTestingModule({
      imports,
      providers,
    });
    await this.testBed.compileComponents();
    this.fixture = TestBed.createComponent(this.comp);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  clickOn(debugElement: DebugElement) {
    debugElement.nativeElement.click();
    tick();
  }

  getElementById(id: string): DebugElement {
    const pageElement = this.fixture.debugElement;
    return pageElement.query(By.css(`#${id}`))!;
  }

  getComponent(): T {
    return this.fixture.componentInstance;
  }
}
