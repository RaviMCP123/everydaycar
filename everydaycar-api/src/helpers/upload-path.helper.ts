import * as path from "path";
import { FileHelper } from "./file.helper";
import { Helper } from "./index";

export const UPLOADS_FOLDER = "uploads";

export function getUploadsDirectory(): string {
  return path.resolve(process.cwd(), "public", UPLOADS_FOLDER);
}

/** Saves an uploaded file under `public/uploads` and returns its public URL. */
export function saveUploadedImageFile(file: Express.Multer.File): string {
  const directory = getUploadsDirectory();
  FileHelper.createDirectoryIfNotExists(directory);

  const fileName = FileHelper.generateUniqueFileName(file.originalname);
  FileHelper.saveFile(file.buffer, fileName, directory);

  const baseUrl = (Helper.getBaseUrl() || "http://localhost:8000").replace(
    /\/$/,
    "",
  );
  return `${baseUrl}/${UPLOADS_FOLDER}/${fileName}`;
}

/** Persists a base64 data-URI image to uploads and returns its public URL. */
export function saveBase64Image(
  mimeSubtype: string,
  base64Data: string,
): string {
  const directory = getUploadsDirectory();
  FileHelper.createDirectoryIfNotExists(directory);

  const ext =
    mimeSubtype === "jpeg"
      ? "jpg"
      : mimeSubtype === "svg+xml"
        ? "svg"
        : mimeSubtype;
  const fileName = FileHelper.generateUniqueFileName(`image.${ext}`);
  const buffer = Buffer.from(base64Data, "base64");
  FileHelper.saveFile(buffer, fileName, directory);

  const baseUrl = (Helper.getBaseUrl() || "http://localhost:8000").replace(
    /\/$/,
    "",
  );
  return `${baseUrl}/${UPLOADS_FOLDER}/${fileName}`;
}

/** Replaces inline base64 `<img src="data:...">` with persisted upload URLs. */
export function replaceBase64ImagesInHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return html;
  }

  const imgRegex =
    /<img([^>]*)\ssrc=["'](data:image\/([^;]+);base64,([^"']+))["']([^>]*)>/gi;

  return html.replace(
    imgRegex,
    (_full, before, _dataUri, mimeSubtype, base64Data, after) => {
      try {
        const url = saveBase64Image(mimeSubtype, base64Data);
        return `<img${before} src="${url}"${after}>`;
      } catch {
        return _full;
      }
    },
  );
}
