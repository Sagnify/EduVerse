export async function addLibrary(data: {
  visibility: boolean;
  asset_url: string;
  title: string;
  description: string;
  stream?: string;
  subject?: string;
  standard?: string;
}) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://eduverse-a4l5.onrender.com/api/libassets/?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in addLibrary:", error);
    return {
      success: false,
      message: "An error occurred while submitting the form.",
    };
  }
}
