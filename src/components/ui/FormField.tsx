type FormFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export const FormField = ({
  label,
  value,
  placeholder,
  onChange,
}: FormFieldProps) => (
  <div>
    <label className="block mb-2">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border rounded bg-gray-800 border-gray-600"
    />
  </div>
);
