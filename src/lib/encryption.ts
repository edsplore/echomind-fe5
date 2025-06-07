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

// Split payload structure for smaller URLs
interface MainPayload {
  a: string; // agent_id
  p: string; // agent_phone_number_id
}

export const generateEncryptedLink = (payload: LinkConfiguration): string => {
  // Split into two parts: main payload and dynamic variables
  const mainPayload: MainPayload = {
    a: payload.agent_id,
    p: payload.agent_phone_number_id
  };

  const dynamicVariables = payload.conversation_initiation_client_data.dynamic_variables;

  // Encrypt both parts separately
  const encryptedMain = encrypt(JSON.stringify(mainPayload));
  const encryptedDynamic = encrypt(JSON.stringify(dynamicVariables));

  return `${VITE_TWILIO_OUTBOUND_URL}?token1=${encryptedMain}&token2=${encryptedDynamic}`;
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

// Updated function to handle split tokens
export const decryptLinkConfiguration = (token1: string, token2: string): LinkConfiguration => {
  try {
    const decryptedMain = decrypt(token1);
    const decryptedDynamic = decrypt(token2);

    console.log('Decrypted main payload:', decryptedMain);
    console.log('Decrypted dynamic variables:', decryptedDynamic);

    const mainPayload = JSON.parse(decryptedMain) as MainPayload;
    const dynamicVariables = JSON.parse(decryptedDynamic) as Record<string, string | number | boolean>;

    return {
      agent_id: mainPayload.a,
      agent_phone_number_id: mainPayload.p,
      conversation_initiation_client_data: {
        dynamic_variables: dynamicVariables
      }
    };
  } catch (error) {
    throw new Error('Invalid encrypted tokens');
  }
};

// Legacy function for backward compatibility (single token)
export const decryptLinkConfigurationLegacy = (encryptedData: string): LinkConfiguration => {
  const decryptedString = decrypt(encryptedData);
  console.log('Decrypted payload:', decryptedString);

  try {
    // Try parsing as full format
    return JSON.parse(decryptedString) as LinkConfiguration;
  } catch (error) {
    throw new Error('Invalid payload format');
  }
};