import { ComfortTypes } from "@/types";

const ComfortCard = ({ data }: { data: ComfortTypes }) => {
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };
  return (
    <div className=" bg-white border-2  overflow-hidden  border-transparent hover:border-[#191d1326] drop-shadow-2xl flex flex-col rounded-lg p-5 w-full max-w-[700px] md:max-w-[400] h-[200px] transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-[24px] text-black capitalize font-extrabold">
          {data.titleEn}
        </h2>
        <span className="font-extrabold text-6xl text-[#87986A26]">
          {formatNumber(data.id)}
        </span>
      </div>
      <div className="flex flex-col mt-3 h-full">
        <span className="text-[12px] mt-2 text-[#2e302d] line-clamp-3 leading-relaxed flex-1">
          {data.descEn}
        </span>
      </div>
    </div>
  );
};

export default ComfortCard;
