// utils/languageMapping.ts

const languageMapping: { [key: string]: string } = {
  IN: "hi", // Default to Hindi for India
  "IN-HI": "hi", // Hindi
  "IN-EN": "en", // English
  "IN-TA": "ta", // Tamil
  "IN-TE": "te", // Telugu
  "IN-BN": "bn", // Bengali
  "IN-KN": "kn", // Kannada
  "IN-ML": "ml", // Malayalam
  "IN-MR": "mr", // Marathi
  "IN-GU": "gu", // Gujarati
  "IN-PA": "pa", // Punjabi
  "IN-OR": "or", // Odia
  "IN-AS": "as", // Assamese
  "IN-UR": "ur", // Urdu
  // You can add more Indian languages as per requirement.
};

export const getLanguageFromCountry = (countryCode: string): string => {
  // Default to Hindi (hi) for India if no specific language is found
  return languageMapping[countryCode] || "hi";
};
