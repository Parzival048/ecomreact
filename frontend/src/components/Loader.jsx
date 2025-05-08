const Loader = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 absolute top-0 left-0"></div>
        <div className="animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gradient-to-r from-indigo-400 to-orange-400 opacity-75"></div>
      </div>
    </div>
  );
};

export default Loader;
