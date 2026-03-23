export default function imageResizer(file, maxWidth = 400, maxHeight = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 1. Calculate new dimensions correctly for BOTH Portrait and Landscape
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        // 2. MOVED OUTSIDE: Create canvas and draw regardless of orientation
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            // FIX: If blob is null, reject. If it exists, resolve!
            if (!blob) {
              reject(new Error("Canvas to blob failed."));
              return;
            }
            
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });

            resolve({
              file: resizedFile,
              preview: URL.createObjectURL(resizedFile),
            });
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = () => reject(new Error("Image Load Error"));
    };
    reader.onerror = () => reject(new Error("File Read Error"));
  });
}