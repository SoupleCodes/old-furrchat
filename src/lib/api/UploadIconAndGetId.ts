export const uploadIconAndGetId = async ({ file, userToken }: { file: File; userToken: string }) => {
    if (!file) {
      throw new Error('No file provided');
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch("https://uploads.meower.org/icons", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: userToken,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${file.name}`);
      }
  
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error uploading icon:', error);
      throw error;
    }
  };  