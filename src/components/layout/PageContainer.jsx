export default function PageContainer({
  children,
  className = "",
  size = "default",
}) {
  const sizeClasses = {
    sm: "max-w-3xl",
    default: "max-w-7xl",
    lg: "max-w-[1400px]",
    article: "max-w-4xl",
    narrow: "max-w-2xl",
    wide: "max-w-[1600px]",
  };

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${
        sizeClasses[size] || sizeClasses.default
      } ${className}`}
    >
      {children}
    </div>
  );
}