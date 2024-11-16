export const uploadFiles = async (files: File[]) => {
  const formDataArray = files.map((file) => {
    const renamedFile = new File([file], `${Date.now()}-${file.name}`, {
      type: file.type,
    });
    const formData = new FormData();
    const resourceType =
      file.type.startsWith("audio") || file.type.startsWith("video")
        ? "video"
        : "image";
    formData.append("file", renamedFile);
    formData.append("resource_type", resourceType);
    formData.append("upload_preset", "g2dueo8c"); // Your Cloudinary preset
    return formData;
  });

  try {
    const uploadPromises = formDataArray.map((formData) =>
      fetch(
        `https://api.cloudinary.com/v1_1/${
          process.env.CLOUDINARY_CLOUD_NAME
        }/${formData.get("resource_type")}/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
    );

    // Upload all files in parallel and wait for all responses
    const responses = await Promise.all(uploadPromises);

    // Convert all responses to JSON
    const results = await Promise.all(responses.map((res) => res.json()));

    console.log('results =>> ' , results);
    

    // Extract URLs from the results
    const fileUrls = results.map(({ url }: { url: string }) => {
      const urlParts = url.split("/upload/");
      const thumbnail_url = `${urlParts[0]}/upload/c_thumb,w_200,g_face/${urlParts[1]}`;
      return {
        thumbnail_url,
        url,
      };
    });

    return fileUrls; // Return the array of file URLs
  } catch (error) {
    console.error("Error during file uploads:", error);
    return [];
  }
};
