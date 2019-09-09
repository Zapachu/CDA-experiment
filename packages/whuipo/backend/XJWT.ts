import aesJs from 'aes-js';
import crypto from 'crypto';
import {toBufferBE} from 'bigint-buffer';
import settings from './setting';

const {tokenSecret, tokenAesKey} = settings;
const HEADER_TIME_OFFSET = 0;
const HEADER_TYPE_OFFSET = HEADER_TIME_OFFSET + 8;
const PAYLOAD_OFFSET = 8;
const EXPIRE_SPAN = 1000 * 60;
const ISSUER_ID = settings.issuerId;

export default class XJWT {

  static encode(type: Type, payload?: object): string {
    if (type === Type.JSON && !payload) {
      console.error('must pass in payload when type is JSON');
      return null;
    }
    const headerStr = this.encodeHeaderToBase64(type);
    const payloadStr = this.encodePayloadToBase64(type, payload);
    return this.sign(headerStr, payloadStr);
  }

  static decode(token: string): DecodeRet {
    try {
      if (!token) {
        return {isValid: false};
      }
      token = this.repairToken(token);
      const [header, payload, signature] = token.split('.');
      if (!this.checkSignature(header, payload, signature)) {
        console.log('check signature failed');
        return {isValid: false};
      }
      if (!this.checkTimestamp(header)) {
        console.log('check timestamp failed');
        return {isValid: false};
      }
      const key = Uint8Array.from(Buffer.from(tokenAesKey, 'base64'));
      const iv = key.slice(0, 16);
      const decipher = new aesJs.ModeOfOperation.cbc(key, iv);
      const decryptedBytes = decipher.decrypt(
          Uint8Array.from(Buffer.from(payload, 'base64'))
      );
      const len = decryptedBytes.length;
      const padding = decryptedBytes[len - 1] + 1;
      const decryptedStr = aesJs.utils.utf8.fromBytes(
          decryptedBytes.slice(PAYLOAD_OFFSET, len - padding)
      );
      console.log('decryptedStr, ', decryptedStr);
      const type = this.extractType(header);
      switch (type) {
        case Type.JSON: {
          const payloadObj = JSON.parse(decryptedStr);
          return {isValid: true, payload: payloadObj};
        }
        case Type.RESERVED:
        case Type.SYS: {
          return {isValid: true};
        }
      }
    } catch (e) {
      console.error(e);
      return {isValid: false};
    }
  }

  static encodeHeaderToBase64(type: Type): string {
    const expiry = Date.now() + EXPIRE_SPAN;
    const expiryBuf = toBufferBE(BigInt(expiry), 8);
    const typeBuf = Buffer.alloc(1).fill(type);
    const issuerIdBuf = toBufferBE(BigInt(settings.issuerId), 8);
    const bufLength = expiryBuf.length + typeBuf.length + issuerIdBuf.length;
    const headerBuf = Buffer.concat(
        [expiryBuf, typeBuf, issuerIdBuf],
        bufLength
    );
    return headerBuf.toString('base64');
  }

  static encodePayloadToBase64(type: Type, payload: object): string {
    const randomBuf = Buffer.alloc(8).fill(this._randomInt8());
    let body: string;
    switch (type) {
      case Type.JSON: {
        body = JSON.stringify(payload as object);
        break;
      }
      case Type.RESERVED: {
        body = '';
        break;
      }
      case Type.SYS: {
        body = JSON.stringify(payload as object);
        break;
      }
    }
    const bodyBuf = Buffer.from(body);
    const padding = (16 - ((8 + bodyBuf.length + 1) & 0xf)) & 0xf;
    const paddingBuf = Buffer.alloc(padding + 1).fill(padding);
    const bufLength = randomBuf.length + bodyBuf.length + paddingBuf.length;
    const payloadBuf = Buffer.concat(
        [randomBuf, bodyBuf, paddingBuf],
        bufLength
    );
    const payloadBytes = Uint8Array.from(payloadBuf);
    const key = Uint8Array.from(Buffer.from(tokenAesKey, 'base64'));
    const iv = key.slice(0, 16);
    const cipher = new aesJs.ModeOfOperation.cbc(key, iv);
    const encryptedBytes = cipher.encrypt(payloadBytes);
    return Buffer.from(encryptedBytes.buffer).toString('base64');
  }

  static repairToken(token: string): string {
    return token.replace(/\s/g, '+');
  }

  static checkTimestamp(header: string): boolean {
    const buf = Buffer.from(header, 'base64');
    const expiry = this._readInt64BE(buf, HEADER_TIME_OFFSET);
    return Date.now() < expiry;
  }

  static extractType(header: string): Type {
    const buf = Buffer.from(header, 'base64');
    const type = buf.readInt8(HEADER_TYPE_OFFSET);
    const TYPES = {
      [Type.RESERVED]: true,
      [Type.JSON]: true,
      [Type.SYS]: true
    };
    if (TYPES.hasOwnProperty(type)) {
      return type;
    }
    throw new Error('invalid type in token');
  }

  static checkSignature(header: string, payload: string, signature: string): boolean {
    const _sig = this._hmacSha256(header + '.' + payload, tokenSecret);
    const _sigBytes = Uint8Array.from(Buffer.from(_sig, 'base64'));
    const sigBytes = Uint8Array.from(Buffer.from(signature, 'base64'));
    for (let i = 0; i < _sigBytes.length; i++) {
      if (_sigBytes[i] !== sigBytes[i]) {
        return false;
      }
    }
    return true;
  }

  static encryptPassword(
      password: string
  ): { nonce: string; cnonce: string; password: string } {
    const nonce = this.randomStr(), cnonce = this.randomStr(),
        pw = this._sha256(nonce + this._sha256(password).toUpperCase() + cnonce).toUpperCase();
    return {nonce, cnonce, password: pw};
  }

  static randomStr(len: number = 16): string {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
  }

  private static sign(header: string, payload: string): string {
    const signature = this._hmacSha256(header + '.' + payload, tokenSecret);
    return header + '.' + payload + '.' + signature;
  }

  private static _hmacSha256(text: string, secret: string): string {
    return crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest('base64');
  }

  private static _sha256(text: string): string {
    return crypto
        .createHash('sha256')
        .update(text)
        .digest('hex');
  }

  private static _readInt64BE(buf: Buffer, offset: number): bigint {
    const hex = buf.slice(offset, 8).toString('hex');
    return BigInt('0x' + hex);
  }

  private static _randomInt8(): number {
    return Math.floor(Math.random() * 256);
  }
}

interface DecodeRet {
  isValid: boolean;
  payload?: Payload;
}

interface Payload {
  id: number;
  un: string;
  dis: string
}

export enum Type {
  RESERVED = 0,
  JSON,
  SYS
}