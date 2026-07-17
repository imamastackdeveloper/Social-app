import { clsx } from 'clsx';
import { forwardRef } from 'react';

/**
 * Reusable Input component with label, error, and placeholder support
 * Integrates with React Hook Form via forwardRef
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      placeholder,
      type = 'text',
      className = '',
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={clsx(
            'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
            'bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
