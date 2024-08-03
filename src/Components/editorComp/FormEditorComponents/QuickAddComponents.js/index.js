import React, { useState } from "react";
import { useStateContext } from "../../../../context/ContextProvider";
import ReCAPTCHA from "react-google-recaptcha";
import "./htmlEditor.css";
const GeneralField = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  type,
  onChange,
  value,
}) => {
  console.log("required", required);
  return (
    <div
      className="flex flex-col gap-3 bg-transparent"
      style={{ width: `${width}%` }}
    >
      <label htmlFor="" className="text-[14px] font-medium">
        {label}
        {required && " *"}
      </label>
      <input
        type={type || "text"}
        name=""
        placeholder={placeholder}
        id={queryKey}
        className="focus:outline-none border w-full text-[14px] p-3 rounded-lg bg-transparent"
        required={required}
        onChange={(e) => onChange(queryKey, e?.target?.value)}
        value={value}
      />
      <label htmlFor="">{shortLabel}</label>
    </div>
  );
};

export const FirstName = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const LastName = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const FullName = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const Email = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      type="email"
      value={value}
    />
  );
};
export const Phone = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      type="number"
      value={value}
    />
  );
};
export const Address = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const City = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const Country = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const State = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const PostalCode = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const Organization = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const Website = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const ButtonComp = ({ label, url }) => {
  return (
    <button
      className={`shadow-none px-3 rounded-md text-[14px] text-white py-4 w-full mt-5 bg-green-600 text-center`}
      type="submit"
    >
      {label}
    </button>
  );
};
export const DateOfBirth = ({
  label,
  placeholder,
  queryKey,
  width,
  shortLabel,
  required,
  onChange,
  value,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, t } =
    useStateContext();
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      type="date"
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};

export const Image = ({
  width,
  required,
  label,
  shortLabel,
  onChange,
  placeholder,
  queryKey,
  value,
}) => {
  return (
    // <div>
    //   <input type="file" name="" id="" />
    // </div>
    <div className="flex flex-col gap-3" style={{ width: `${width}%` }}>
      <label htmlFor="" className="text-[14px] font-medium">
        {label}
        {required && " *"}
      </label>
      <input
        type={"file"}
        name=""
        placeholder={placeholder}
        id={queryKey}
        className="focus:outline-none border w-full text-[14px] p-3 rounded-lg"
        required={required}
        onChange={(e) => {
          onChange(queryKey, e.target.files[0]);
        }}
        value={value}
      />
      <label htmlFor="">{shortLabel}</label>
    </div>
  );
};
export const Text = ({ text, width }) => {
  return (
    <div className="flex flex-col gap-3" style={{ width: `${width}%` }}>
      <label htmlFor="" className="text-[14px] font-medium">
        {text}
      </label>
    </div>
  );
};

export const Captcha = ({ onChange }) => {
  function captchafunc(e) {
    console.log(e, "captcha");
  }
  return (
    <ReCAPTCHA
      sitekey="6LduTgUqAAAAAKOAz6_XDINzdpo-epA9UEigb-gL"
      onChange={(e) => {
        onChange("captcha", e);
      }}
    />
  );
};

export const Source = ({
  label,
  placeholder,
  width,
  shortLabel,
  required,
  queryKey,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const TandC = ({
  label,
  placeholder,
  width,
  shortLabel,
  required,
  queryKey,
  onChange,
  value,
}) => {
  return (
    <GeneralField
      label={label}
      placeholder={placeholder}
      width={width}
      shortLabel={shortLabel}
      required={required}
      queryKey={queryKey}
      onChange={onChange}
      value={value}
    />
  );
};
export const HTMLBlock = ({ onHTMLChange, htmlContent, isDevelopment }) => {
  // const [htmlContent, setHtmlContent] = useState("");

  const handleChange = (content) => {
    // setHtmlContent(content);

    onHTMLChange(content);
    console.log(content, "content");
  };
  const htmlContentRefined = htmlContent?.replace(/equalSignH/g, "=");
  const htmlPreviewStyles = {
    h1: {
      fontSize: "2em",
      fontWeight: "bold",
      marginTop: "1em",
      marginBottom: "0.5em",
    },
    p: {
      marginTop: "0.5em",
      marginBottom: "0.5em",
    },
    // Add more styles as needed
  };

  return (
    <div>
      {/* Rich Text Editor */}
      {isDevelopment && (
        // <ReactQuill value={htmlContent} onChange={handleChange} />
        <textarea
          placeholder="Write HTML here"
          className="w-full text-[16px] px-3 py-4 font-medium focus:outline-none border rounded-lg bg-transparent"
          value={htmlContentRefined}
          onChange={(e) => handleChange(e?.target?.value)}
        ></textarea>
      )}

      {/* Or Simple Textarea */}
      {/* <textarea value={htmlContent} onChange={(e) => handleChange(e.target.value)} /> */}

      <div
        className="html-preview"
        style={{ ...htmlPreviewStyles }}
        dangerouslySetInnerHTML={{ __html: htmlContentRefined }}
      />
    </div>
  );
};

export const RadioBtn = ({
  options,
  label,
  onChange,
  shortLabel,
  queryKey,
  value,
  required,
  width,
}) => {
  console.log("options", options);
  return (
    <div className="flex flex-col gap-3" style={{ width: `${width}%` }}>
      <label htmlFor="" className="text-[14px] font-medium">
        {label}
        {required && " *"}
      </label>
      {options?.map((option) => {
        return (
          <>
            <div className="flex gap-2 items-center">
              <input
                type={"radio"}
                name={queryKey}
                id={option.label}
                className="focus:outline-none border  text-[14px] p-3 rounded-lg"
                required={required}
                onChange={(e) => {
                  onChange(queryKey, e.target.value);
                }}
                value={option.value}
                checked={value ? (value == option.value ? true : false) : value}
              />
              <label htmlFor={option?.value}>{option?.label}</label>
            </div>
          </>
        );
      })}

      <label htmlFor="">{shortLabel}</label>
    </div>
  );
};
