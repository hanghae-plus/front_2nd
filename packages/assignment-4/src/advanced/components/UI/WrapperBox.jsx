export default function WrapperBox({ children }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      {children}
    </div>
  );
}
