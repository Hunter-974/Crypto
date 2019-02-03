import { AES, enc, SHA256 } from 'crypto-js'

export class CryptoService {

  private static key: string;
  public static readonly encryptedTemplate: string
  = "<span class=\"bg-dark px-1 my-2 encrypted\">Encrypted text</span>";

  public static setKey(key: string) {
    CryptoService.key = key;
  }

  public static get hasKey(): boolean {
    if (CryptoService.key && CryptoService.key.length) {
      return true;
    }
    return false;
  }

  private static checkAes() {
    if (!AES) {
      throw Error("Failed to encrypt data.");
    }
    if (!CryptoService.key || !CryptoService.key.length) {
      throw Error("Encryption key not defined.")
    }
  }

  private static checkSha() {
    if (!SHA256) {
      throw Error("Failed to encrypt data.");
    }
  }

  public static encrypt(data: string): string {
    CryptoService.checkAes();
    return AES.encrypt(data, CryptoService.key).toString();
  }

  public static decrypt(data: string): string {
    CryptoService.checkAes();
    return AES.decrypt(data, CryptoService.key).toString(enc.Utf8);
  }

  public static hash(data: string): string {
    CryptoService.checkSha();
    return SHA256(data).toString();
  }
}

export let encrypt = (value: string) => {
  return CryptoService.encrypt(value);
};

export let decrypt = (value: string) => {
  return CryptoService.decrypt(value);
};

export let hash = (value: string) => {
  return CryptoService.hash(value);
};