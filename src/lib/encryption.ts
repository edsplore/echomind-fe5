
// Encryption/Decryption utilities for Twilio agent links
// This file can be imported in backend for decryption

export const encrypt = (text: string): string => {
  const key = 'twilio-agent-link-secret-key-2024'; // In production, use env variable
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(result);
};

export const decrypt = (encryptedText: string): string => {
  try {
    const key = 'twilio-agent-link-secret-key-2024'; // In production, use env variable
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

// Type definition for the encrypted payload
export interface TwilioAgentPayload {
  twilioNumber: string;
  authId: string;
  sid: string;
  agentId: string;
  baseUrl: string;
  timestamp: number;
}

// Helper function to decrypt and parse payload
export const decryptTwilioPayload = (encryptedData: string): TwilioAgentPayload => {
  const decryptedString = decrypt(encryptedData);
  return JSON.parse(decryptedString) as TwilioAgentPayload;
};
