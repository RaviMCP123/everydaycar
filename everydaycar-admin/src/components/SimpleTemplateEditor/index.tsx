import React from "react";
import { Form } from "react-bootstrap";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CKEditor from "@components/CKEditor";
import Label from "@components/form/Label";
import { Language } from "interface/common";
import { PageTemplate } from "@config/pageTemplates";
import type { UploadFile } from "antd/es/upload/interface";
import showToast from "@utils/toast";

const MAX_SIZE_MB = 5;

interface SimpleTemplateEditorProps {
  template: PageTemplate;
  languageList: Language[];
  activeLang: string;
  content: Record<string, any>;
  onContentChange: (key: string, value: any, lang?: string) => void;
  imageFiles?: Record<string, UploadFile[]>;
  onImageChange?: (key: string, files: UploadFile[]) => void;
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
    if (onImageChange) {
      onImageChange(key, fileList);
    }
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
              type="text"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
              value={value}
              onChange={(e) => {
                setFieldValue(field, lang, e.target.value);
              }}
              placeholder={field.placeholder || ""}
            />
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
            <CKEditor
              keyName={`${field.key}-${lang}`}
              value={String(value || "")}
              setValue={(_key, nextValue) => {
                setFieldValue(field, lang, nextValue);
              }}
            />
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
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
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
                className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                value={value}
                onChange={(e) => {
                  setFieldValue(field, lang, e.target.value);
                }}
                placeholder={field.placeholder || ""}
              />
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
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
              value={value}
              onChange={(e) => {
                setFieldValue(field, lang, e.target.value);
              }}
              placeholder={field.placeholder || ""}
            />
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
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm"
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
      aboutWhy: [],
      servicesHero: [],
      servicesCard: [],
      servicesCta: [],
      legalHero: [],
      legalDescription: [],
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
        field.key.startsWith("footerGetInTouchTitle") ||
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
