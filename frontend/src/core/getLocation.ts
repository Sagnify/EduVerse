// utils/getLocation.ts
export const getLocation = async () => {
  try {
    const token = process.env.IPINFO_TOKEN;
    const response = await fetch(`https://ipinfo.io/json?token=${token}`);
    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }
    const data = await response.json();
    const { country } = data;
    return country; // Returns the country code (e.g., 'US', 'DE')
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};
