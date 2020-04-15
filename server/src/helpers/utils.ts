import * as Crypto from "crypto";

export class Utils {

  key: string = '06f3gk1185gzc70f6ucee1jua1714t7d78gplufaxz4ff0qw';
  algorithm: string = 'aes-256-ctr';

  constructor() { }

  generateUUID(length = 16, options = { numericOnly: false }) {
    let text = '';
    const possible =
      options && options.numericOnly ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  encrypt(text: any) {
    const cipher = Crypto.createCipher(this.algorithm, this.key);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  };

  decrypt(text: any) {
    const decipher = Crypto.createCipher(this.algorithm, this.key);
    let dec = decipher.update(text, 'utf8', 'hex',);
    dec += decipher.final('utf8');
    return dec;
  };

}