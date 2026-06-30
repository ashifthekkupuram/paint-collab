import { Brush } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#FAF9EE]">
      <Brush color="#A2AF9B" height={80} width={80} className="animate-bounce" />
    </div>
  );
};

export default Loading;
