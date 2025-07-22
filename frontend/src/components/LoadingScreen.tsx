function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

        <p className="text-white text-sm tracking-wide opacity-80">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
