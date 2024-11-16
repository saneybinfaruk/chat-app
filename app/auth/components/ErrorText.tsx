import React from "react";

const ErrorText = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="label">
      <span className="label-text-alt text-red-600">{errorMessage}</span>
    </div>
  );
};

export default ErrorText;
