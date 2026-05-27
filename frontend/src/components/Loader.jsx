// Reusable loading spinner

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 animate-fade-in">
      <div
        className={`${sizes[size]} border-primary-500/30 border-t-primary-500 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
};

export default Loader;