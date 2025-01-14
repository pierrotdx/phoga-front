import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenUtilsService {
  private tokenKey = 'token';

  setStoredToken(accessToken: string | undefined): void {
    if (!accessToken) {
      return;
    }
    const currentStoredToken = localStorage.getItem(this.tokenKey);
    if (accessToken !== currentStoredToken) {
      localStorage.setItem(this.tokenKey, accessToken);
    }
  }

  getTokenFromStorage(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isTokenValid(accessToken: string | undefined): boolean {
    if (!accessToken) {
      return false;
    }
    const decodedToken = this.decodeToken(accessToken);
    const expDate = new Date(decodedToken.exp! * 1000);
    const now = new Date();
    return expDate.getTime() > now.getTime();
  }

  decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }

  clearStoredToken() {
    localStorage.removeItem(this.tokenKey);
  }
}
