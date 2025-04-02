import { Component, Inject, signal } from '@angular/core';
import { ENVIRONMENT_TOKEN, IEnvironment } from '@client/environment-context';
import { IContact } from '@shared/contact-context';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  imports: [FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  mainContact = signal<IContact | undefined>(undefined);
  designContact = signal<IContact | undefined>(undefined);

  envelopIcon = faEnvelope;
  githubIcon = faGithub;
  instagramIcon = faInstagram;

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
