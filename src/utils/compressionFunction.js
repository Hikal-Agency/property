import pako from "pako";

export const compressData = (data) => {
  console.log("data to be compressed:: ", data);
  let compressData;
  let base64Data;
  try {
    compressData = pako.deflate(JSON.stringify(data), {
      raw: true,
      to: "string",
    });

    console.log("compress data: ", compressData);
    // Convert the compressed binary data to Base64
    base64Data = btoa(compressData);

    console.log("base64 data: ", base64Data);
    return base64Data;
  } catch (e) {
    // throw new Error(e);
    return { success: false, error: e.message };
  }
};
