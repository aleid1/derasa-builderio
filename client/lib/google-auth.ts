interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
    handleGoogleSignIn: (response: GoogleAuthResponse) => void;
  }
}

export class GoogleAuthService {
  private clientId: string;
  private isInitialized = false;

  constructor() {
    // You'll need to add this to your environment variables
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''; 
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load Google Identity Services script
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-identity-script')) {
        this.isInitialized = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isInitialized = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };

      document.head.appendChild(script);
    });
  }

  initializeGoogleSignIn(onSuccess: (user: GoogleUser) => void, onError: (error: string) => void): void {
    if (!this.clientId) {
      onError('Google Client ID not configured');
      return;
    }

    window.handleGoogleSignIn = (response: GoogleAuthResponse) => {
      try {
        // Decode the JWT token to get user info
        const token = response.credential;
        const payload = this.parseJwt(token);
        
        const user: GoogleUser = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        };

        onSuccess(user);
      } catch (error) {
        onError('Failed to process Google sign-in');
      }
    };

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: window.handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }

  renderSignInButton(element: HTMLElement, theme: 'outline' | 'filled_blue' = 'filled_blue'): void {
    if (!window.google?.accounts?.id) {
      console.error('Google Identity Services not loaded');
      return;
    }

    window.google.accounts.id.renderButton(element, {
      theme,
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      logo_alignment: 'left',
      width: '100%',
      locale: 'ar',
    });
  }

  prompt(): void {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }
}

export const googleAuth = new GoogleAuthService();
