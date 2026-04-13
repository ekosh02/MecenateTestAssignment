import { makeAutoObservable } from "mobx";

class AuthStore {
  token = "";

  constructor() {
    makeAutoObservable(this);
  }

  setToken(value: string) {
    this.token = value;
  }
}

export const authStore = new AuthStore();
