import React from "react";

const InputField = ({
  type,
  className,
  placeholder,
  value,
  onChange,
  required,
}) => {
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  );
};

export default InputField;
