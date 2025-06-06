// Encryption/Decryption utilities for Twilio agent links
// This file can be imported in backend for decryption

const VITE_TWILIO_OUTBOUND_SECRET = import.meta.env.VITE_TWILIO_OUTBOUND_SECRET;

export const encrypt = (text: string): string => {
  const key = VITE_TWILIO_OUTBOUND_SECRET;
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(result);
};


// Type definition for the encrypted payload
export interface TwilioAgentPayload {
  twilioNumber: string;
  authId: string;
  sid: string;
  agentId: string;
  baseUrl: string;
}


export const decrypt = (encryptedText: string): string => {
  try {
    const key = VITE_TWILIO_OUTBOUND_SECRET; // In production, use env variable
    const decoded = atob(encryptedText);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  } catch (error) {
    throw new Error('Invalid encrypted payload');
  }
};

// Helper function to decrypt and parse payload
export const decryptTwilioPayload = (encryptedData: string): TwilioAgentPayload => {
  const decryptedString = decrypt(encryptedData);
  return JSON.parse(decryptedString) as TwilioAgentPayload;
};
