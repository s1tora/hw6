const form = document.getElementById("form");
const fileInput = document.getElementById("fileInput");

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/server/upload");
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => {
      reject(xhr.statusText);
    };
    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const response = await uploadFile(file);
      console.log(`File "${file.name}" was uploaded successfully`, response);
    } catch (error) {
      console.error(`Failed to upload "${file.name}"`, error);
    }
  }
});
