// Encryption/Decryption utilities for Twilio agent links
// This file can be imported in backend for decryption

const VITE_TWILIO_OUTBOUND_SECRET = import.meta.env.VITE_TWILIO_OUTBOUND_SECRET;
const VITE_TWILIO_OUTBOUND_URL = import.meta.env.VITE_TWILIO_OUTBOUND_URL;

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

// Type definition for the link configuration payload
export interface LinkConfiguration {
  agent_id: string;
  agent_phone_number_id: string;
  conversation_initiation_client_data: {
    dynamic_variables: Record<string, string | number | boolean>;
  };
}

export const generateEncryptedLink = (payload: LinkConfiguration): string => {
  const encryptedPayload = encrypt(JSON.stringify(payload));
  // URL encode the encrypted payload to handle special characters
  const encodedToken = encodeURIComponent(encryptedPayload);
  return `${VITE_TWILIO_OUTBOUND_URL}?token=${encodedToken}`;
};

export const decrypt = (encryptedText: string): string => {
  try {
    const key = VITE_TWILIO_OUTBOUND_SECRET;
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
export const decryptLinkConfiguration = (encryptedData: string): LinkConfiguration => {
  try {
    // URL decode the token first
    const decodedToken = decodeURIComponent(encryptedData);
    const decryptedString = decrypt(decodedToken);
    console.log('Decrypted payload:', decryptedString);
    return JSON.parse(decryptedString) as LinkConfiguration;
  } catch (error) {
    throw new Error('Invalid encrypted token');
  }
};