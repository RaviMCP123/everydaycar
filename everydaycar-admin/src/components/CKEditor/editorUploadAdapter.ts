import type { FileLoader } from "ckeditor5";
import agent from "@utils/agent";
import { normalizeImageUrl } from "@utils/imageUrl";

class EditorUploadAdapter {
  private loader: FileLoader;

  constructor(loader: FileLoader) {
    this.loader = loader;
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file.then((file) => {
      if (!file) {
        return Promise.reject(new Error("No file to upload."));
      }

      const formData = new FormData();
      formData.append("upload", file);

      return agent
        .post<{ data?: { url?: string } }>("page/upload-image", formData)
        .then((response) => {
          const url = response.data?.data?.url;
          if (!url) {
            throw new Error("Image upload failed.");
          }
          return { default: normalizeImageUrl(url) || url };
        });
    });
  }

  abort(): void {
    // No-op: uploads are single-shot requests.
  }
}

export function configureEditorImageUpload(editor: {
  plugins: { get: (name: string) => { createUploadAdapter?: (loader: FileLoader) => EditorUploadAdapter } };
}): void {
  const fileRepository = editor.plugins.get("FileRepository");
  fileRepository.createUploadAdapter = (loader: FileLoader) =>
    new EditorUploadAdapter(loader);
}
