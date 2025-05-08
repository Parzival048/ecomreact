import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const Message = ({ variant = 'info', children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return {
          container: 'bg-green-50 text-green-800 border-green-200',
          icon: <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0 h-5 w-5" />
        };
      case 'error':
        return {
          container: 'bg-red-50 text-red-800 border-red-200',
          icon: <FaExclamationCircle className="text-red-500 mr-3 flex-shrink-0 h-5 w-5" />
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          icon: <FaExclamationTriangle className="text-yellow-500 mr-3 flex-shrink-0 h-5 w-5" />
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <FaInfoCircle className="text-blue-500 mr-3 flex-shrink-0 h-5 w-5" />
        };
    }
  };

  const { container, icon } = getVariantClasses();

  return (
    <div
      className={`p-4 mb-4 rounded-xl border shadow-sm ${container}`}
      role="alert"
    >
      <div className="flex items-center">
        {icon}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Message;
