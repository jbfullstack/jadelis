import React from "react";

interface CheckboxFieldProps {
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
  className?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  value,
  onChange,
  title,
  className,
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <label className="flex items-center space-x-3 text-lg">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-6 w-6 border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          title={title}
        />
        <span className="text-gray-700">{label}</span>
      </label>
    </div>
  );
};

export default CheckboxField;
