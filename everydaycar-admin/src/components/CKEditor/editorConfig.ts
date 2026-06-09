import type { EditorConfig } from "ckeditor5";
import {
  Autoformat,
  BlockQuote,
  Bold,
  Essentials,
  Font,
  GeneralHtmlSupport,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  SourceEditing,
  Table,
  TableToolbar,
  TextTransformation,
} from "ckeditor5";

/** Allow pasted/saved HTML to keep classes, inline styles, and style blocks. */
export const CMS_HTML_SUPPORT_CONFIG = {
  allow: [
    {
      name: /^.+$/,
      attributes: true,
      classes: true,
      styles: true,
    },
  ],
  disallow: [{ name: "script" }, { name: "iframe" }],
} as const;

export const CMS_EDITOR_PLUGINS = [
  Essentials,
  Paragraph,
  Heading,
  Autoformat,
  Bold,
  Italic,
  Font,
  BlockQuote,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  List,
  Indent,
  Link,
  MediaEmbed,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation,
  GeneralHtmlSupport,
  SourceEditing,
];

export const CMS_EDITOR_TOOLBAR = [
  "heading",
  "|",
  "bold",
  "italic",
  "fontSize",
  "fontColor",
  "fontBackgroundColor",
  "|",
  "link",
  "bulletedList",
  "numberedList",
  "|",
  "outdent",
  "indent",
  "|",
  "uploadImage",
  "blockQuote",
  "insertTable",
  "mediaEmbed",
  "|",
  "sourceEditing",
  "|",
  "undo",
  "redo",
];

export function createCmsEditorConfig(
  overrides?: Partial<EditorConfig>,
): EditorConfig {
  return {
    licenseKey: "GPL",
    plugins: CMS_EDITOR_PLUGINS,
    toolbar: CMS_EDITOR_TOOLBAR,
    htmlSupport: CMS_HTML_SUPPORT_CONFIG,
    image: {
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    ...overrides,
  };
}
