import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center font-sans text-slate-800">
      {/* Mobile Shell Wrapper */}
      <div className="w-full h-full sm:w-[400px] sm:h-[850px] sm:rounded-[40px] sm:shadow-2xl sm:overflow-hidden relative bg-gray-50 flex flex-col border-[12px] border-slate-900">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
