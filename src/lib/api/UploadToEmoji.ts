export async function uploadToEmoji({ file, userToken }: { file: File; userToken: string }) {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch("https://uploads.meower.org/emojis", {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': userToken,
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to upload file: ${file.name}. Status: ${response.status}. Response: ${errorText}`);
      throw new Error(`Failed to upload file: ${file.name}`);
    }
  
    const data = await response.json();
    console.log('Upload successful:', data);
    return data.id;
}