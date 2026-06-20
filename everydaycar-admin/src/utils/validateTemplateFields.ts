import type { PageTemplate, TemplateField } from "@config/pageTemplates";
import type { Language } from "interface/common";
import type { UploadFile } from "antd/es/upload/interface";

function stripHtmlAndTrim(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, "")
    .trim();
}

function isTemplateFieldEmpty(field: TemplateField, value: string): boolean {
  if (field.type === "richText") {
    return stripHtmlAndTrim(value).length === 0;
  }
  return value.trim().length === 0;
}

function getTemplateFieldDisplayValue(
  field: TemplateField,
  content: Record<string, any>,
  lang: string,
  imageFiles: Record<string, UploadFile[]>,
): string {
  if (field.type === "image") {
    const fileList = imageFiles[field.key] || [];
    if (fileList[0]?.originFileObj || fileList[0]?.url) {
      return "has-image";
    }
    const stored = content[field.key];
    if (
      typeof stored === "string" &&
      stored.trim() &&
      !stored.startsWith("blob:")
    ) {
      return stored;
    }
    return "";
  }

  const raw = content?.[field.key];
  if (field.multilingual === false) {
    return typeof raw === "string" ? raw : "";
  }
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    return typeof raw[lang] === "string" ? raw[lang] : "";
  }
  if (typeof raw === "string") {
    return raw;
  }
  return "";
}

function isTemplateFieldVisible(
  field: TemplateField,
  content: Record<string, any>,
  lang: string,
): boolean {
  if (!field.showWhen) return true;
  const dependentRaw = content?.[field.showWhen.key];
  if (dependentRaw == null) return false;
  const dependentValue =
    typeof dependentRaw === "string"
      ? dependentRaw
      : typeof dependentRaw === "object" && dependentRaw !== null
        ? String(dependentRaw[lang] ?? Object.values(dependentRaw)[0] ?? "")
        : "";
  return (
    dependentValue.toLowerCase() === String(field.showWhen.equals).toLowerCase()
  );
}

export function validateRequiredTemplateFields(
  template: PageTemplate,
  content: Record<string, any>,
  imageFiles: Record<string, UploadFile[]>,
  languageList: Language[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  const langs = languageList.map((lang) => lang.code).filter(Boolean);
  const languages = langs.length > 0 ? langs : ["en"];

  template.fields.forEach((field) => {
    if (!field.required) return;

    if (field.multilingual === false) {
      const primaryLang = languages[0];
      if (!isTemplateFieldVisible(field, content, primaryLang)) return;
      const value = getTemplateFieldDisplayValue(
        field,
        content,
        primaryLang,
        imageFiles,
      );
      if (isTemplateFieldEmpty(field, value)) {
        errors[field.key] = `${field.label} is required.`;
      }
      return;
    }

    languages.forEach((lang) => {
      if (!isTemplateFieldVisible(field, content, lang)) return;
      const value = getTemplateFieldDisplayValue(
        field,
        content,
        lang,
        imageFiles,
      );
      if (isTemplateFieldEmpty(field, value)) {
        errors[`${field.key}-${lang}`] = `${field.label} is required.`;
      }
    });
  });

  return errors;
}
