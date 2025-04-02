import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { Component, Input } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '@client/environment-context';

@Component({
  template: '',
  selector: 'lib-contact',
})
class ContactStubComponent {
  @Input() contact: unknown;
}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    })
      .overrideComponent(FooterComponent, {
        set: {
          imports: [ContactStubComponent],
          providers: [
            {
              provide: ENVIRONMENT_TOKEN,
              useValue: {},
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
