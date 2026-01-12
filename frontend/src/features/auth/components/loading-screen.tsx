const LoadingScreen = ({ message = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};
export default LoadingScreen;
