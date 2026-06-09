import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { createCmsEditorConfig } from "./editorConfig";
import { configureEditorImageUpload } from "./editorUploadAdapter";

interface MyEditorProps {
  keyName: string;
  value: string;
  setValue: (key: string, value: string) => void;
}

const toHtmlString = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object" && value !== null) {
    const firstValue = Object.values(value)[0];
    return typeof firstValue === "string" ? firstValue : String(value || "");
  }
  return String(value || "");
};

const editorConfig = createCmsEditorConfig();

const MyEditor: React.FC<MyEditorProps> = ({ keyName, value, setValue }) => {
  const stringValue = React.useMemo(() => toHtmlString(value), [value]);

  return (
    <div className="editor-container editor-container--html">
      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        Paste from Word or web pages to keep formatting. Use{" "}
        <strong>Source</strong> in the toolbar to edit raw HTML. Add page-wide
        rules in Custom CSS below.
      </p>
      <CKEditor
        id={keyName}
        editor={ClassicEditor}
        data={stringValue}
        config={editorConfig}
        onReady={(editor) => {
          configureEditorImageUpload(editor);
        }}
        onChange={(_event, editor) => {
          setValue(keyName, editor.getData());
        }}
      />
    </div>
  );
};

export default MyEditor;
