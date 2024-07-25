export const uploadFileAndGetId = async ({ file, userToken }: any) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch("https://uploads.meower.org/attachments", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: userToken,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to upload file(s): ${file.name}`);
    }
  
    const data = await response.json();
    return data.id;
};