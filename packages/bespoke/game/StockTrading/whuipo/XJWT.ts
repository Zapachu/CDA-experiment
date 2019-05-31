import aesjs from "aes-js";
import crypto from "crypto";
import { toBufferBE } from "bigint-buffer";
import settings from "./settings";
const { tokenSecret, tokenAesKey } = settings;

const HEADER_TIME_OFFSET = 0;
const HEADER_TYPE_OFFSET = HEADER_TIME_OFFSET + 8;
const PAYLOAD_OFFSET = 8;
const EXPIRE_SPAN = 1000 * 60 * 1;
const ISSUER_ID = 3000; // should be less than 65536

class XJWT {
  private secret: string;
  private aesKey: string;

  constructor(secret: string, aesKey: string) {
    this.secret = secret;
    this.aesKey = aesKey;
  }

  private sign(header: string, payload: string): string {
    const signature = _hmacsha256(header + "." + payload, this.secret);
    return header + "." + payload + "." + signature;
  }

  encode(type: Type, payload?: object): string {
    try {
      if (type === Type.JSON && !payload) {
        throw new Error("must pass in payload when type is JSON");
      }
      const headerStr = this.encodeHeaderToBase64(type);
      const payloadStr = this.encodePayloadToBase64(type, payload);
      return this.sign(headerStr, payloadStr);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  decode(token: string): DecodeRet {
    try {
      if (!token) {
        return { isValid: false };
      }
      token = this.repairToken(token);
      const [header, payload, signature] = token.split(".");
      if (!this.checkSignature(header, payload, signature)) {
        console.log("check signature failed");
        return { isValid: false };
      }
      if (!this.checkTimestamp(header)) {
        console.log("check timestamp failed");
        return { isValid: false };
      }
      const key = Uint8Array.from(Buffer.from(this.aesKey, "base64"));
      const iv = key.slice(0, 16);
      const decipher = new aesjs.ModeOfOperation.cbc(key, iv);
      const decryptedBytes = decipher.decrypt(
        Uint8Array.from(Buffer.from(payload, "base64"))
      );
      const len = decryptedBytes.length;
      const padding = decryptedBytes[len - 1] + 1;
      const decryptedStr = aesjs.utils.utf8.fromBytes(
        decryptedBytes.slice(PAYLOAD_OFFSET, len - padding)
      );
      // console.log("decryptedStr, ", decryptedStr);
      const type = this.extractType(header);
      switch (type) {
        case Type.JSON: {
          const payloadObj = JSON.parse(decryptedStr);
          return { isValid: true, payload: payloadObj };
        }
        case Type.RESERVED:
        case Type.SYS: {
          return { isValid: true };
        }
      }
    } catch (e) {
      console.error(e);
      return { isValid: false };
    }
  }

  encodeHeaderToBase64(type: Type): string {
    const expiry = Date.now() + EXPIRE_SPAN;
    const expiryBuf = toBufferBE(BigInt(expiry), 8);
    const typeBuf = Buffer.alloc(1).fill(type);
    const issuerIdArray = new Uint16Array(1);
    issuerIdArray[0] = ISSUER_ID;
    const issuerIdBuf = Buffer.from(issuerIdArray.buffer);
    issuerIdBuf.swap16();
    const bufLength = expiryBuf.length + typeBuf.length + issuerIdBuf.length;
    const headerBuf = Buffer.concat(
      [expiryBuf, typeBuf, issuerIdBuf],
      bufLength
    );
    return headerBuf.toString("base64");
  }

  encodePayloadToBase64(type: Type, payload: object): string {
    const randomBuf = Buffer.alloc(8).fill(_randomInt8());
    let body: string;
    switch (type) {
      case Type.JSON: {
        body = JSON.stringify(payload);
        break;
      }
      case Type.RESERVED: {
        body = "";
        break;
      }
      case Type.SYS: {
        body = "sys";
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
    const key = Uint8Array.from(Buffer.from(tokenAesKey, "base64"));
    const iv = key.slice(0, 16);
    const cipher = new aesjs.ModeOfOperation.cbc(key, iv);
    const encryptedBytes = cipher.encrypt(payloadBytes);
    return Buffer.from(encryptedBytes.buffer).toString("base64");
  }

  repairToken(token: string): string {
    const repairedToken = token.replace(/\s/g, "+");
    return repairedToken;
  }

  checkTimestamp(header: string): boolean {
    const buf = Buffer.from(header, "base64");
    const expiry = _readInt64BE(buf, HEADER_TIME_OFFSET);
    return Date.now() < expiry;
  }

  extractType(header: string): Type {
    const buf = Buffer.from(header, "base64");
    const type = buf.readInt8(HEADER_TYPE_OFFSET);
    const TYPES = {
      [Type.RESERVED]: true,
      [Type.JSON]: true,
      [Type.SYS]: true
    };
    if (TYPES.hasOwnProperty(type)) {
      return type;
    }
    throw new Error("invalid type in token");
  }

  checkSignature(header: string, payload: string, signature: string): boolean {
    const _sig = _hmacsha256(header + "." + payload, this.secret);
    const _sigBytes = Uint8Array.from(Buffer.from(_sig, "base64"));
    const sigBytes = Uint8Array.from(Buffer.from(signature, "base64"));
    for (let i = 0; i < _sigBytes.length; i++) {
      if (_sigBytes[i] !== sigBytes[i]) {
        return false;
      }
    }
    return true;
  }
}

function _hmacsha256(text: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(text)
    .digest("base64");
}

function _sha256(text: string): string {
  return crypto
    .createHash("sha256")
    .update(text)
    .digest()
    .toString();
}

// only node 10.4.0+ supported, while negative number not supported yet
function _readInt64BE(buf: Buffer, offset: number): bigint {
  const hex = buf.slice(offset, 8).toString("hex");
  const bn = BigInt("0x" + hex);
  return bn;
  // const low = buf.readUInt32BE(offset + 4);
  // const high = buf.readInt32BE(offset) * Math.pow(2, 32);
  // return high + low;
}

function _randomInt8(): number {
  return Math.floor(Math.random() * 256);
}

interface DecodeRet {
  isValid: boolean;
  payload?: Payload;
}

interface Payload {
  ti: number;
  id: number;
}

export default new XJWT(tokenSecret, tokenAesKey);

export enum Type {
  RESERVED = 0,
  JSON,
  SYS
}

export function encryptPassword(
  password: string
): { nonce: string; cnonce: string; password: string } {
  const nonce = _randomDigit();
  const cnonce = _randomDigit();
  const pw = _sha256(nonce + _sha256(password) + cnonce);
  return { nonce, cnonce, password: pw };
  function _randomDigit() {
    const RANDOMS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ];
    return RANDOMS[Math.floor(Math.random() * RANDOMS.length)];
  }
}
