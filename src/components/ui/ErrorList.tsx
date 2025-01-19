type ErrorListProps = {
  errors: string[];
};

export const ErrorList = ({ errors }: ErrorListProps) => (
  <div className="p-4 bg-orange-800 rounded text-white">
    <ul className="list-disc pl-5">
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  </div>
);
