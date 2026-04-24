import { makeAutoObservable } from "mobx";

class AuthStore {
  token = "";

  skipTabLogoIntroAfterAuth = false;

  constructor() {
    makeAutoObservable(this);
  }

  setToken(value: string) {
    if (value.length === 0) {
      this.skipTabLogoIntroAfterAuth = false;
    }
    this.token = value;
  }

  setTokenAfterAuthScreen(value: string) {
    this.skipTabLogoIntroAfterAuth = true;
    this.token = value;
  }
}

export const authStore = new AuthStore();
