import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: '',
})
class AppStubComponent {}

@Component({
  selector: 'app-navigation',
  template: '',
})
class NavigationStubComponent {}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [],
    })
      .overrideComponent(SidebarComponent, {
        set: {
          imports: [NavigationStubComponent, AppStubComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
