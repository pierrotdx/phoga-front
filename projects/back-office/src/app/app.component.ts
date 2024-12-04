import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth-context';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'back-office';

  constructor(private readonly authService: AuthService) {}

  async getAccessToken() {
    const accessToken = await this.authService.getAccessToken();
    console.log('access token: ', accessToken);
  }
}
