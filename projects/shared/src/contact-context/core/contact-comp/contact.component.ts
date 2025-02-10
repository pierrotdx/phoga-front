import { Component, Input } from '@angular/core';
import { IContact } from '../models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
  faBehance,
  faGithub,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'lib-contact',
  imports: [FontAwesomeModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  @Input() contact: IContact | undefined;
  envelopIcon = faEnvelope;
  githubIcon = faGithub;
  behanceIcon = faBehance;
  instagramIcon = faInstagram;
}
