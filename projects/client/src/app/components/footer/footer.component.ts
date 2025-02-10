import { Component, Inject, signal } from '@angular/core';
import { ENVIRONMENT_TOKEN, IEnvironment } from '@client/environment-context';
import { ContactComponent, IContact } from '@shared/contact-context';

@Component({
  selector: 'app-footer',
  imports: [ContactComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  mainContact = signal<IContact | undefined>(undefined);
  designContact = signal<IContact | undefined>(undefined);

  constructor(@Inject(ENVIRONMENT_TOKEN) private readonly env: IEnvironment) {
    const mainContact = this.env?.mainContact;
    if (mainContact) {
      this.mainContact.set(mainContact);
    }
    const designContact = this.env?.designContact;
    if (designContact) {
      this.designContact.set(designContact);
    }
  }
}
