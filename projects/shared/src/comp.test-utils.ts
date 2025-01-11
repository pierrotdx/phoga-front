import { DebugElement, Type } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  TestModuleMetadata,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class CompTestUtils<T> {
  component!: T;
  fixture!: ComponentFixture<T>;

  protected testBed!: TestBed;

  constructor(
    private readonly comp: Type<T>,
    private readonly config: TestModuleMetadata
  ) {}

  protected async internalBeforeEach(): Promise<void> {
    const config = this.getConfig();
    this.testBed = TestBed.configureTestingModule(config);
    if (this.config.imports) {
      this.testBed = this.testBed.overrideComponent(this.comp, {
        set: {
          imports: this.config.imports.filter((imp) => imp !== this.comp),
        },
      });
    }
    await this.testBed.compileComponents();
    this.fixture = TestBed.createComponent(this.comp);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  private getConfig(): TestModuleMetadata {
    const imports = this.config?.imports
      ? [this.comp, ...this.config?.imports]
      : [this.comp];
    const config: TestModuleMetadata = Object.assign({}, this.config, {
      imports,
    });
    return config;
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
