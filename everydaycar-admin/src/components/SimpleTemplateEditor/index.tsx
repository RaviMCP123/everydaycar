import React from "react";
import { Form } from "react-bootstrap";
import { Upload } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import CKEditor from "@components/CKEditor";
import Label from "@components/form/Label";
import Message from "@components/form/input/ErrorMessage";
import { Language } from "interface/common";
import { PageTemplate } from "@config/pageTemplates";
import type { UploadFile } from "antd/es/upload/interface";
import showToast from "@utils/toast";

const MAX_SIZE_MB = 5;

const ADD_SECTION_BUTTON_CLASS =
  "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700";

function scrollToEditorItem(elementId: string) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById(elementId)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  });
}

type AboutWhoItemContent = {
  icon?: string;
  title?: Record<string, string> | string;
  text?: Record<string, string> | string;
};

type AboutCompanyFactsItemContent = {
  icon?: string;
  title?: Record<string, string> | string;
  text?: Record<string, string> | string;
};

type FaqItemContent = {
  question?: Record<string, string> | string;
  answer?: Record<string, string> | string;
};

const ABOUT_WHO_ITEM_ICON_KEY = (index: number) => `aboutWhoItem-${index}-icon`;
const ABOUT_COMPANY_FACTS_ITEM_ICON_KEY = (index: number) =>
  `aboutCompanyFactsItem-${index}-icon`;

interface SimpleTemplateEditorProps {
  template: PageTemplate;
  languageList: Language[];
  activeLang: string;
  content: Record<string, any>;
  onContentChange: (key: string, value: any, lang?: string) => void;
  imageFiles?: Record<string, UploadFile[]>;
  onImageChange?: (key: string, files: UploadFile[]) => void;
  fieldErrors?: Record<string, string>;
  /** Optional: enables page dropdown only when field has selectPageForRedirect (home template section links). */
  allPages?: Array<{
    id?: string;
    _id?: string;
    slug?: string;
    customSlug?: string;
    title?: string | Record<string, string>;
  }>;
  /** Exclude this page id from redirect targets (current edited page). */
  excludePageId?: string;
}

const SimpleTemplateEditor: React.FC<SimpleTemplateEditorProps> = ({
  template,
  languageList,
  activeLang,
  content,
  onContentChange,
  imageFiles = {},
  onImageChange,
  fieldErrors = {},
  allPages,
  excludePageId,
}) => {
  const getRawContentValue = (key: string): any => content?.[key];

  const getContentValue = (key: string, lang?: string): string => {
    const fieldContent = content?.[key];
    if (!fieldContent) return "";
    
    if (lang && typeof fieldContent === "object" && !Array.isArray(fieldContent) && fieldContent !== null) {
      const langValue = fieldContent[lang];
      return typeof langValue === "string" ? langValue : "";
    }
    if (typeof fieldContent === "string") {
      return fieldContent;
    }
    if (typeof fieldContent === "object" && !Array.isArray(fieldContent) && fieldContent !== null) {
      const firstValue = Object.values(fieldContent)[0];
      return typeof firstValue === "string" ? firstValue : "";
    }
    return "";
  };

  const setFieldValue = (field: any, lang: string, nextValue: string) => {
    const currentField = content[field.key] || {};
    if (field.multilingual === false) {
      onContentChange(field.key, nextValue);
      return;
    }
    onContentChange(field.key, { ...currentField, [lang]: nextValue }, lang);
  };

  const isFieldVisible = (field: any): boolean => {
    if (!field.showWhen) return true;
    const dependentRaw = getRawContentValue(field.showWhen.key);
    if (dependentRaw == null) return false;
    const dependentValue =
      typeof dependentRaw === "string"
        ? dependentRaw
        : typeof dependentRaw === "object" && dependentRaw !== null
          ? (dependentRaw[activeLang] ??
              Object.values(dependentRaw)[0] ??
              "")
          : "";
    return String(dependentValue).toLowerCase() === String(field.showWhen.equals).toLowerCase();
  };

  const handleImageChange = (key: string, fileList: UploadFile[]) => {
    const processedFileList = fileList.slice(0, 1).map((file) => {
      if (file.originFileObj && !file.url) {
        const previewUrl = URL.createObjectURL(file.originFileObj);
        return {
          ...file,
          url: previewUrl,
          thumbUrl: previewUrl,
          status: "done" as const,
        };
      }
      return {
        ...file,
        thumbUrl: file.url || file.thumbUrl,
        status: file.status || ("done" as const),
      };
    });
    if (onImageChange) {
      onImageChange(key, processedFileList);
    }
  };

  const getAboutWhoItems = (): AboutWhoItemContent[] => {
    const items = content?.aboutWhoItems;
    return Array.isArray(items) ? items : [];
  };

  const setAboutWhoItems = (items: AboutWhoItemContent[]) => {
    onContentChange("aboutWhoItems", items);
  };

  const getAboutWhoItemFieldValue = (
    item: AboutWhoItemContent,
    field: "title" | "text",
    lang: string,
  ): string => {
    const value = item[field];
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const langValue = value[lang];
      if (typeof langValue === "string") return langValue;
      const first = Object.values(value).find((entry) => typeof entry === "string");
      return typeof first === "string" ? first : "";
    }
    return "";
  };

  const updateAboutWhoItemField = (
    index: number,
    field: "title" | "text",
    lang: string,
    nextValue: string,
  ) => {
    const items = [...getAboutWhoItems()];
    const current = { ...(items[index] || {}) };
    const currentField = current[field];
    const nextField =
      typeof currentField === "object" && currentField !== null && !Array.isArray(currentField)
        ? { ...currentField, [lang]: nextValue }
        : { [lang]: nextValue };
    items[index] = { ...current, [field]: nextField };
    setAboutWhoItems(items);
  };

  const addAboutWhoItem = () => {
    const nextIndex = getAboutWhoItems().length;
    setAboutWhoItems([...getAboutWhoItems(), { title: {}, text: {} }]);
    scrollToEditorItem(`about-who-item-${nextIndex}`);
  };

  const removeAboutWhoItem = (index: number) => {
    const items = getAboutWhoItems().filter((_, itemIndex) => itemIndex !== index);
    setAboutWhoItems(items);
    if (onImageChange) {
      onImageChange(ABOUT_WHO_ITEM_ICON_KEY(index), []);
    }
  };

  const getAboutCompanyFactsItems = (): AboutCompanyFactsItemContent[] => {
    const items = content?.aboutCompanyFactsItems;
    return Array.isArray(items) ? items : [];
  };

  const setAboutCompanyFactsItems = (items: AboutCompanyFactsItemContent[]) => {
    onContentChange("aboutCompanyFactsItems", items);
  };

  const getAboutCompanyFactsItemFieldValue = (
    item: AboutCompanyFactsItemContent,
    field: "title" | "text",
    lang: string,
  ): string => {
    const value = item[field];
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const langValue = value[lang];
      if (typeof langValue === "string") return langValue;
      const first = Object.values(value).find((entry) => typeof entry === "string");
      return typeof first === "string" ? first : "";
    }
    return "";
  };

  const updateAboutCompanyFactsItemField = (
    index: number,
    field: "title" | "text",
    lang: string,
    nextValue: string,
  ) => {
    const items = [...getAboutCompanyFactsItems()];
    const current = { ...(items[index] || {}) };
    const currentField = current[field];
    const nextField =
      typeof currentField === "object" && currentField !== null && !Array.isArray(currentField)
        ? { ...currentField, [lang]: nextValue }
        : { [lang]: nextValue };
    items[index] = { ...current, [field]: nextField };
    setAboutCompanyFactsItems(items);
  };

  const addAboutCompanyFactsItem = () => {
    const nextIndex = getAboutCompanyFactsItems().length;
    setAboutCompanyFactsItems([
      ...getAboutCompanyFactsItems(),
      { title: {}, text: {} },
    ]);
    scrollToEditorItem(`about-company-facts-item-${nextIndex}`);
  };

  const removeAboutCompanyFactsItem = (index: number) => {
    const items = getAboutCompanyFactsItems().filter(
      (_, itemIndex) => itemIndex !== index,
    );
    setAboutCompanyFactsItems(items);
    if (onImageChange) {
      onImageChange(ABOUT_COMPANY_FACTS_ITEM_ICON_KEY(index), []);
    }
  };

  const getFaqItems = (): FaqItemContent[] => {
    const items = content?.faqItems;
    return Array.isArray(items) ? items : [];
  };

  const setFaqItems = (items: FaqItemContent[]) => {
    onContentChange("faqItems", items);
  };

  const getFaqItemFieldValue = (
    item: FaqItemContent,
    field: "question" | "answer",
    lang: string,
  ): string => {
    const value = item[field];
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const langValue = value[lang];
      if (typeof langValue === "string") return langValue;
      const first = Object.values(value).find((entry) => typeof entry === "string");
      return typeof first === "string" ? first : "";
    }
    return "";
  };

  const updateFaqItemField = (
    index: number,
    field: "question" | "answer",
    lang: string,
    nextValue: string,
  ) => {
    const items = [...getFaqItems()];
    const current = { ...(items[index] || {}) };
    const currentField = current[field];
    const nextField =
      typeof currentField === "object" && currentField !== null && !Array.isArray(currentField)
        ? { ...currentField, [lang]: nextValue }
        : { [lang]: nextValue };
    items[index] = { ...current, [field]: nextField };
    setFaqItems(items);
  };

  const addFaqItem = () => {
    const nextIndex = getFaqItems().length;
    setFaqItems([...getFaqItems(), { question: {}, answer: {} }]);
    scrollToEditorItem(`faq-item-${nextIndex}`);
  };

  const removeFaqItem = (index: number) => {
    setFaqItems(getFaqItems().filter((_, itemIndex) => itemIndex !== index));
  };

  const renderAboutWhoItemsEditor = (lang: string) => {
    const items = getAboutWhoItems();

    return (
      <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="mb-4">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white">
            Who We Are Items
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Add feature blocks with icon, title, and description.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            No items yet. Click &quot;Add Section&quot; to create one.
          </p>
        ) : null}

        {items.map((item, index) => {
          const iconKey = ABOUT_WHO_ITEM_ICON_KEY(index);
          const imageFileList = imageFiles[iconKey] || [];

          return (
            <div
              key={`about-who-item-${index}`}
              id={`about-who-item-${index}`}
              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h5 className="text-sm font-semibold text-gray-800 dark:text-white">
                  Item {index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removeAboutWhoItem(index)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <DeleteOutlined />
                  Remove
                </button>
              </div>

              <Form.Group className="mb-4">
                <Label>Item Icon</Label>
                <Upload
                  listType="picture-card"
                  fileList={imageFileList}
                  beforeUpload={beforeUpload}
                  onChange={({ fileList }) => handleImageChange(iconKey, fileList)}
                  maxCount={1}
                >
                  {imageFileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Group>

              <Form.Group className="mb-4">
                <Label>
                  Item Title<span className="text-error-500">*</span>
                </Label>
                <Form.Control
                  type="text"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
                  value={getAboutWhoItemFieldValue(item, "title", lang)}
                  onChange={(event) =>
                    updateAboutWhoItemField(index, "title", lang, event.target.value)
                  }
                  placeholder="Feature title"
                />
              </Form.Group>

              <Form.Group className="mb-0">
                <Label>
                  Item Description<span className="text-error-500">*</span>
                </Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  className="w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
                  value={getAboutWhoItemFieldValue(item, "text", lang)}
                  onChange={(event) =>
                    updateAboutWhoItemField(index, "text", lang, event.target.value)
                  }
                  placeholder="Feature description"
                />
              </Form.Group>
            </div>
          );
        })}

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={addAboutWhoItem}
            className={ADD_SECTION_BUTTON_CLASS}
          >
            <PlusOutlined />
            Add Section
          </button>
        </div>
      </div>
    );
  };

  const renderAboutCompanyFactsItemsEditor = (lang: string) => {
    const items = getAboutCompanyFactsItems();

    return (
      <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="mb-4">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white">
            Company Facts Items
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Add fact blocks with icon, title, and description.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            No items yet. Click &quot;Add Section&quot; to create one.
          </p>
        ) : null}

        {items.map((item, index) => {
          const iconKey = ABOUT_COMPANY_FACTS_ITEM_ICON_KEY(index);
          const imageFileList = imageFiles[iconKey] || [];

          return (
            <div
              key={`about-company-facts-item-${index}`}
              id={`about-company-facts-item-${index}`}
              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h5 className="text-sm font-semibold text-gray-800 dark:text-white">
                  Item {index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removeAboutCompanyFactsItem(index)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <DeleteOutlined />
                  Remove
                </button>
              </div>

              <Form.Group className="mb-4">
                <Label>Item Icon</Label>
                <Upload
                  listType="picture-card"
                  fileList={imageFileList}
                  beforeUpload={beforeUpload}
                  onChange={({ fileList }) => handleImageChange(iconKey, fileList)}
                  maxCount={1}
                >
                  {imageFileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Group>

              <Form.Group className="mb-4">
                <Label>
                  Item Title<span className="text-error-500">*</span>
                </Label>
                <Form.Control
                  type="text"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
                  value={getAboutCompanyFactsItemFieldValue(item, "title", lang)}
                  onChange={(event) =>
                    updateAboutCompanyFactsItemField(
                      index,
                      "title",
                      lang,
                      event.target.value,
                    )
                  }
                  placeholder="Fact title"
                />
              </Form.Group>

              <Form.Group className="mb-0">
                <Label>
                  Item Description<span className="text-error-500">*</span>
                </Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
                  value={getAboutCompanyFactsItemFieldValue(item, "text", lang)}
                  onChange={(event) =>
                    updateAboutCompanyFactsItemField(
                      index,
                      "text",
                      lang,
                      event.target.value,
                    )
                  }
                  placeholder="Fact description"
                />
              </Form.Group>
            </div>
          );
        })}

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={addAboutCompanyFactsItem}
            className={ADD_SECTION_BUTTON_CLASS}
          >
            <PlusOutlined />
            Add Section
          </button>
        </div>
      </div>
    );
  };

  const renderFaqItemsEditor = (lang: string) => {
    const items = getFaqItems();

    return (
      <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="mb-4">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white">
            FAQ Questions
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Add questions and answers for the accordion list.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            No questions yet. Click &quot;Add Question&quot; to create one.
          </p>
        ) : null}

        {items.map((item, index) => (
          <div
            key={`faq-item-${index}`}
            id={`faq-item-${index}`}
            className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-white">
                Question {index + 1}
              </h5>
              <button
                type="button"
                onClick={() => removeFaqItem(index)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <DeleteOutlined />
                Remove
              </button>
            </div>

            <Form.Group className="mb-4">
              <Label>
                Question<span className="text-error-500">*</span>
              </Label>
              <Form.Control
                type="text"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
                value={getFaqItemFieldValue(item, "question", lang)}
                onChange={(event) =>
                  updateFaqItemField(index, "question", lang, event.target.value)
                }
                placeholder="Enter the question"
              />
            </Form.Group>

            <Form.Group className="mb-0">
              <Label>
                Answer<span className="text-error-500">*</span>
              </Label>
              <Form.Control
                as="textarea"
                rows={4}
                className="w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
                value={getFaqItemFieldValue(item, "answer", lang)}
                onChange={(event) =>
                  updateFaqItemField(index, "answer", lang, event.target.value)
                }
                placeholder="Enter the answer"
              />
            </Form.Group>
          </div>
        ))}

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={addFaqItem}
            className={ADD_SECTION_BUTTON_CLASS}
          >
            <PlusOutlined />
            Add Question
          </button>
        </div>
      </div>
    );
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      showToast("Invalid file type. Please select a JPEG, PNG, or JPG image.", "error");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < MAX_SIZE_MB;
    if (!isLt5M) {
      showToast(`Image must be smaller than ${MAX_SIZE_MB}MB!`, "error");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload - file will be handled manually
  };

  const renderField = (field: any, lang: string) => {
    if (!isFieldVisible(field)) {
      return null;
    }

    const value = getContentValue(field.key, lang);
    const errorKey = field.multilingual === false ? field.key : `${field.key}-${lang}`;
    const fieldError = fieldErrors[errorKey];
    const invalidClass = fieldError
      ? "border-rose-300 focus:border-rose-300 dark:border-rose-400"
      : "border-gray-300 focus:border-brand-300 dark:border-gray-700";

    switch (field.type) {
      case "text":
        return (
          <Form.Group key={`${field.key}-${lang}`} className="mb-4">
            <Label>
              {field.label}
              {field.required && <span className="text-error-500">*</span>}
            </Label>
            {field.helpText && (
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
            )}
            <Form.Control
              type={field.key === "footerEmail" ? "email" : "text"}
              as={field.multiline ? "textarea" : undefined}
              rows={field.multiline ? 5 : undefined}
              className={`w-full rounded-lg border appearance-none px-4 py-2.5 text-sm ${invalidClass} ${
                field.multiline ? "min-h-[120px] resize-y" : "h-11"
              }`}
              value={value}
              onChange={(e) => {
                setFieldValue(field, lang, e.target.value);
              }}
              placeholder={field.placeholder || ""}
            />
            <Message message={fieldError || ""} />
          </Form.Group>
        );

      case "richText":
        return (
          <Form.Group key={`${field.key}-${lang}`} className="mb-4">
            <Label>
              {field.label}
              {field.required && <span className="text-error-500">*</span>}
            </Label>
            {field.helpText && (
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
            )}
            <div className={fieldError ? "rounded-lg ring-1 ring-rose-300" : ""}>
              <CKEditor
                keyName={`${field.key}-${lang}`}
                value={String(value || "")}
                setValue={(_key, nextValue) => {
                  setFieldValue(field, lang, nextValue);
                }}
              />
            </div>
            <Message message={fieldError || ""} />
          </Form.Group>
        );

      case "image":
        const imageFileList = imageFiles[field.key] || [];
        return (
          <Form.Group key={`${field.key}-${lang}`} className="mb-4">
            <Label>
              {field.label}
              {field.required && <span className="text-error-500">*</span>}
            </Label>
            {field.helpText && (
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
            )}
            <div className={fieldError ? "rounded-lg ring-1 ring-rose-300 p-1 w-fit" : ""}>
              <Upload
                listType="picture-card"
                fileList={imageFileList}
                beforeUpload={beforeUpload}
                onChange={({ fileList }) => handleImageChange(field.key, fileList)}
                maxCount={1}
              >
                {imageFileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
            <Message message={fieldError || ""} />
          </Form.Group>
        );

      case "link": {
        const showPagePicker =
          Boolean(field.selectPageForRedirect) && Array.isArray(allPages);

        if (showPagePicker) {
          const primaryLang = languageList[0]?.code || "en";
          const selectValue = (() => {
            if (!value) return "";
            const match = allPages!.find((page) => {
              const pageSlug = page.slug || page.customSlug || "";
              return value === `/${pageSlug}`;
            });
            return match ? value : "";
          })();

          return (
            <Form.Group key={`${field.key}-${lang}`} className="mb-4">
              <Label>
                {field.label}
                {field.required && <span className="text-error-500">*</span>}
              </Label>
              <div className="mb-2">
                <Form.Control
                  as="select"
                  className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 ${invalidClass} focus:ring-brand-500/20`}
                  value={selectValue}
                  onChange={(e) => {
                    setFieldValue(field, lang, e.target.value || "");
                  }}
                >
                  <option value="">Select a page</option>
                  {allPages!
                    .filter((page) => {
                      const pid = page.id || page._id;
                      return pid !== excludePageId;
                    })
                    .map((page) => {
                      const pageTitle =
                        typeof page.title === "string"
                          ? page.title
                          : (page.title?.[primaryLang] ||
                              Object.values(page.title || {})[0] ||
                              "Untitled");
                      const pageSlug = page.slug || page.customSlug || "";
                      return (
                        <option
                          key={page.id || page._id || pageSlug}
                          value={pageSlug ? `/${pageSlug}` : ""}
                        >
                          {pageTitle} {pageSlug ? `(${pageSlug})` : ""}
                        </option>
                      );
                    })}
                </Form.Control>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Or enter a custom URL or path below (e.g. external link).
              </p>
              <Form.Control
                type="text"
                className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 ${invalidClass} focus:ring-brand-500/20`}
                value={value}
                onChange={(e) => {
                  setFieldValue(field, lang, e.target.value);
                }}
                placeholder={field.placeholder || ""}
              />
              <Message message={fieldError || ""} />
            </Form.Group>
          );
        }

        return (
          <Form.Group key={`${field.key}-${lang}`} className="mb-4">
            <Label>
              {field.label}
              {field.required && <span className="text-error-500">*</span>}
            </Label>
            <Form.Control
              type="text"
              className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm ${invalidClass}`}
              value={value}
              onChange={(e) => {
                setFieldValue(field, lang, e.target.value);
              }}
              placeholder={field.placeholder || ""}
            />
            <Message message={fieldError || ""} />
          </Form.Group>
        );
      }

      case "select":
        return (
          <Form.Group key={`${field.key}-${lang}`} className="mb-4">
            <Label>
              {field.label}
              {field.required && <span className="text-error-500">*</span>}
            </Label>
            <Form.Control
              as="select"
              className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm ${invalidClass}`}
              value={value || field.options?.[0]?.value || ""}
              onChange={(e) => {
                setFieldValue(field, lang, e.target.value);
              }}
            >
              {(field.options || []).map((option: { label: string; value: string }) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
            <Message message={fieldError || ""} />
          </Form.Group>
        );

      default:
        return null;
    }
  };

  // Group fields by section for better organization
  const groupFieldsBySection = () => {
    const sections: Record<string, any[]> = {
      hero: [],
      aboutHero: [],
      aboutWho: [],
      aboutNotDo: [],
      aboutServed: [],
      aboutCompanyFacts: [],
      aboutJoin: [],
      aboutWhy: [],
      servicesHero: [],
      servicesCard: [],
      servicesCta: [],
      legalHero: [],
      legalDescription: [],
      faqHero: [],
      faqList: [],
      networkHero: [],
      networkSearch: [],
      networkRegion: [],
      networkStat: [],
      networkJoin: [],
      contactHero: [],
      contactInfo: [],
      contactForm: [],
      contactMap: [],
      footerMain: [],
      bookRepairHero: [],
      bookRepairBenefits: [],
      bookRepairSidebar: [],
      findRepairerHero: [],
      findRepairerSearch: [],
      findRepairerResults: [],
      findRepairerCta: [],
      trust: [],
      value: [],
      network: [],
      join: [],
      banner: [],
      overview: [],
      steps: [],
      closing: [],
    };

    // Always show all template fields, even if content is empty
    template.fields.forEach((field) => {
      if (field.key.startsWith("hero")) {
        sections.hero.push(field);
      } else if (field.key.startsWith("aboutHero")) {
        sections.aboutHero.push(field);
      } else if (field.key.startsWith("aboutWho")) {
        sections.aboutWho.push(field);
      } else if (field.key.startsWith("aboutNotDo")) {
        sections.aboutNotDo.push(field);
      } else if (field.key.startsWith("aboutServed")) {
        sections.aboutServed.push(field);
      } else if (field.key.startsWith("aboutCompanyFacts")) {
        sections.aboutCompanyFacts.push(field);
      } else if (field.key.startsWith("aboutJoin")) {
        sections.aboutJoin.push(field);
      } else if (field.key.startsWith("aboutWhy")) {
        sections.aboutWhy.push(field);
      } else if (field.key.startsWith("servicesHero")) {
        sections.servicesHero.push(field);
      } else if (field.key.startsWith("servicesCard")) {
        sections.servicesCard.push(field);
      } else if (field.key.startsWith("servicesCta")) {
        sections.servicesCta.push(field);
      } else if (field.key.startsWith("legalHero")) {
        sections.legalHero.push(field);
      } else if (field.key === "legalDescription") {
        sections.legalDescription.push(field);
      } else if (field.key.startsWith("faqHero")) {
        sections.faqHero.push(field);
      } else if (field.key.startsWith("faqList")) {
        sections.faqList.push(field);
      } else if (field.key.startsWith("networkHero")) {
        sections.networkHero.push(field);
      } else if (field.key.startsWith("networkSearch")) {
        sections.networkSearch.push(field);
      } else if (field.key.startsWith("networkRegion")) {
        sections.networkRegion.push(field);
      } else if (field.key.startsWith("networkStat")) {
        sections.networkStat.push(field);
      } else if (field.key.startsWith("networkJoin")) {
        sections.networkJoin.push(field);
      } else if (field.key.startsWith("contactHero")) {
        sections.contactHero.push(field);
      } else if (field.key.startsWith("contactInfo")) {
        sections.contactInfo.push(field);
      } else if (field.key.startsWith("contactForm")) {
        sections.contactForm.push(field);
      } else if (field.key.startsWith("contactMap")) {
        sections.contactMap.push(field);
      } else if (
        field.key.startsWith("footerTagline") ||
        field.key.startsWith("footerAddress") ||
        field.key.startsWith("footerPhone") ||
        field.key.startsWith("footerEmail") ||
        field.key.startsWith("footerCopyright")
      ) {
        sections.footerMain.push(field);
      } else if (field.key.startsWith("bookRepairHero")) {
        sections.bookRepairHero.push(field);
      } else if (field.key.startsWith("bookRepairBenefit")) {
        sections.bookRepairBenefits.push(field);
      } else if (
        field.key.startsWith("bookRepairWhyUse") ||
        field.key === "bookRepairPreferCallText" ||
        field.key === "bookRepairPhoneNumber" ||
        field.key === "bookRepairCallButtonText"
      ) {
        sections.bookRepairSidebar.push(field);
      } else if (field.key.startsWith("findRepairerHero")) {
        sections.findRepairerHero.push(field);
      } else if (field.key.startsWith("findRepairerSearch")) {
        sections.findRepairerSearch.push(field);
      } else if (field.key.startsWith("findRepairerResults")) {
        sections.findRepairerResults.push(field);
      } else if (
        field.key.startsWith("findRepairerCta") ||
        field.key === "findRepairerPhoneNumber" ||
        field.key === "findRepairerCallButtonText" ||
        field.key === "findRepairerBookButtonText" ||
        field.key === "findRepairerBookButtonLink"
      ) {
        sections.findRepairerCta.push(field);
      } else if (field.key.startsWith("trust")) {
        sections.trust.push(field);
      } else if (field.key.startsWith("value")) {
        sections.value.push(field);
      } else if (field.key.startsWith("network")) {
        sections.network.push(field);
      } else if (field.key.startsWith("join")) {
        sections.join.push(field);
      } else if (field.key.startsWith("banner")) {
        sections.banner.push(field);
      } else if (field.key.startsWith("overview")) {
        sections.overview.push(field);
      } else if (field.key.startsWith("step")) {
        sections.steps.push(field);
      } else if (field.key.startsWith("closing")) {
        sections.closing.push(field);
      } else {
        sections.overview.push(field);
      }
    });

    return sections;
  };

  const sections = groupFieldsBySection();
  
  // Ensure we always render all fields from the template
  // This ensures fields are visible even when adding a new page with no content

  return (
    <div className="simple-template-editor p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="space-y-6">
        {/* Banner / Hero Section */}
        {sections.hero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Banner (Hero) Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.hero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.aboutHero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">About Hero Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.aboutHero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.aboutWho.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">About Who We Are Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.aboutWho.map((field) => renderField(field, lang.code))}
                {template.key === "ABOUT_TEMPLATE_V1"
                  ? renderAboutWhoItemsEditor(lang.code)
                  : null}
              </div>
            ))}
          </div>
        )}

        {sections.aboutNotDo.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              What We Do Not Do Section
            </h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.aboutNotDo.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.aboutServed.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Served Locations Section
            </h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.aboutServed.map((field) => renderField(field, lang.code))}
              </div>
            ))}
            {template.key === "ABOUT_TEMPLATE_V1" ? (
              <p className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                Region badges are loaded automatically from{" "}
                <strong>Network Regions</strong> (active regions only, max 5, sorted by
                admin order).
              </p>
            ) : null}
          </div>
        )}

        {sections.aboutCompanyFacts.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Company Facts Section
            </h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.aboutCompanyFacts.map((field) => renderField(field, lang.code))}
                {template.key === "ABOUT_TEMPLATE_V1"
                  ? renderAboutCompanyFactsItemsEditor(lang.code)
                  : null}
              </div>
            ))}
          </div>
        )}

        {sections.aboutJoin.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Join Network CTA Section
            </h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.aboutJoin.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.aboutWhy.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">About Why Choose Us Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.aboutWhy.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.servicesHero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Services Hero Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.servicesHero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.servicesCard.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Services Cards</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.servicesCard.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.servicesCta.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Services CTA</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.servicesCta.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.legalHero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Legal Hero Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.legalHero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.legalDescription.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Legal Page Description</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.legalDescription.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.faqHero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">FAQ Hero Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.faqHero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {(sections.faqList.length > 0 || template.key === "FAQ_TEMPLATE_V1") && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">FAQ List Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.faqList.map((field) => renderField(field, lang.code))}
                {template.key === "FAQ_TEMPLATE_V1"
                  ? renderFaqItemsEditor(lang.code)
                  : null}
              </div>
            ))}
          </div>
        )}

        {sections.networkHero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Network Hero Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.networkHero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.networkSearch.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Network Search Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.networkSearch.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.networkRegion.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Network Regions</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.networkRegion.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.networkStat.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Network Stats</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.networkStat.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.networkJoin.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Network Join CTA</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.networkJoin.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.contactHero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Hero Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.contactHero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.contactInfo.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Info Card</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.contactInfo.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.contactForm.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Form Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.contactForm.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.contactMap.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Map Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.contactMap.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.footerMain.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Footer Main Content</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.footerMain.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.bookRepairHero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Book Repair Hero Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.bookRepairHero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.bookRepairBenefits.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Book Repair Hero Benefits</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.bookRepairBenefits.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.bookRepairSidebar.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Book Repair Sidebar</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.bookRepairSidebar.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.findRepairerHero.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Find a Repairer Hero Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.findRepairerHero.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.findRepairerSearch.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Find a Repairer Search Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.findRepairerSearch.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.findRepairerResults.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Find a Repairer Results Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.findRepairerResults.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.findRepairerCta.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Find a Repairer Bottom CTA</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.findRepairerCta.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.trust.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Trust Bar</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.trust.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.value.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Value Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.value.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.network.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Network Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.network.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.join.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Join CTA Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.join.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {sections.banner.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Banner Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.banner.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {/* Overview Section */}
        {sections.overview.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Overview Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.overview.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {/* Steps Section */}
        {sections.steps.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Steps</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.steps
                  .sort((a, b) => {
                    // Sort steps by number (step1, step2, step3, step4)
                    const aMatch = a.key.match(/step(\d+)/);
                    const bMatch = b.key.match(/step(\d+)/);
                    const aNum = aMatch ? parseInt(aMatch[1]) : 0;
                    const bNum = bMatch ? parseInt(bMatch[1]) : 0;
                    return aNum - bNum;
                  })
                  .map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}

        {/* Closing Section */}
        {sections.closing.length > 0 && (
          <div className="section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Closing Section</h3>
            {languageList.map((lang) => (
              <div key={lang.code} className={lang.code !== activeLang ? "hidden" : ""}>
                {sections.closing.map((field) => renderField(field, lang.code))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleTemplateEditor;
