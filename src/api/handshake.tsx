import CryptoJS from 'crypto-js';

export const createHmacSignature = (
  secretKey: string,
  data: string,
): string => {
  return CryptoJS.HmacSHA256(data, secretKey).toString(CryptoJS.enc.Hex);
};

export const createHandShakeHmacSignature = (
  secretKey: string,
  data: string,
): string => {
  return CryptoJS.HmacSHA256(JSON.stringify(data), secretKey).toString(
    CryptoJS.enc.Hex,
  );
};

export const createBodyHash = (rawBody: object): string => {
  return CryptoJS.SHA256(rawBody ? JSON.stringify(rawBody) : rawBody).toString(
    CryptoJS.enc.Hex,
  );
};
