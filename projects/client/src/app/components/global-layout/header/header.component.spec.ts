import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { Component } from '@angular/core';

@Component({
  template: '',
  selector: 'app-navigation',
})
class NavigationStubComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, NavigationComponent],
    })
      .overrideComponent(HeaderComponent, {
        set: { imports: [NavigationStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
