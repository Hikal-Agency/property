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

// Decompression utility function
export const decompressData = (base64Data) => {
  console.log("data to be dcompressed:: ", base64Data);

  // Check if the base64Data is a string and not empty
  if (typeof base64Data !== "string" || base64Data.trim() === "") {
    return {
      success: false,
      error: "Invalid input: Data must be a non-empty string.",
    };
  }

  // Check if the string is valid base64
  const base64Pattern =
    /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  if (!base64Pattern.test(base64Data)) {
    return {
      success: false,
      error: "Invalid input: Data is not properly base64 encoded.",
    };
  }

  let decompressedData;
  let compressedDataArray = atob(base64Data).split(",");

  try {
    decompressedData = JSON.parse(
      pako.inflate(
        // new Uint8Array(compressedDataArray.map(compressedDataArray)),
        new Uint8Array(compressedDataArray),
        {
          raw: true,
          to: "string",
        }
      )
    );

    console.log("Decompressed data: ", decompressedData);
    return decompressedData;
  } catch (e) {
    //   throw new Error(e);
    return { success: false, error: e.message };
  }

  return decompressedData;
};
