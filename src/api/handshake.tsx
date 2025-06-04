import CryptoJS from 'crypto-js';


export const createHmacSignature = (
  secretKey: string,
  data: string,
): string => {
  return CryptoJS.HmacSHA256((data), secretKey).toString(
    CryptoJS.enc.Hex,
  );
};

export const createHadShakeHmacSignature = (
  secretKey: string,
  data: string,
): string => {
  return CryptoJS.HmacSHA256(JSON.stringify(data), secretKey).toString(
    CryptoJS.enc.Hex,
  );
};

export const createBodyHash = (rawBody: any): string => {
  return CryptoJS.SHA256(rawBody).toString(CryptoJS.enc.Hex);
};
