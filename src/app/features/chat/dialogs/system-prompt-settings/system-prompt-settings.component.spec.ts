import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPromptSettingsComponent } from './system-prompt-settings.component';

describe('SystemPromptSettingsComponent', () => {
  let component: SystemPromptSettingsComponent;
  let fixture: ComponentFixture<SystemPromptSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemPromptSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemPromptSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
