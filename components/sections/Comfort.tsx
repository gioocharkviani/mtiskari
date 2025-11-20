import ComfortCard from "../cards/ComfortCard";
import image1 from "../../public/services/Adventure-Icon-7.png";
import { ComfortTypes } from "@/types";

const dummy: ComfortTypes[] = [
  {
    id: 1,
    icon: image1,
    titleEn: "Luxury Accommodation",
    titleGe: "ლუქსუსი განთავსება",
    descEn:
      "Experience ultimate comfort in our beautifully designed rooms with premium amenities and stunning views of the surrounding nature.",
    descGe:
      "განიჭეთ უმაღლესი კომფორტი ჩვენს ლამაზად დაპროექტებულ ოთახებში პრემიუმი ხელმისაწვდომობებით და გარშემორტყმული ბუნების გასაოცარი ხედებით.",
  },
  {
    id: 2,
    icon: image1,
    titleEn: "Spa & Wellness",
    titleGe: "სპა და ჯანმრთელობა",
    descEn:
      "Relax and rejuvenate with our exclusive spa treatments, sauna, and wellness programs designed to refresh your mind and body.",
    descGe:
      "დაისვენეთ და განაახლეთ თავი ჩვენი ექსკლუზიური სპა პროცედურებით, საუნით და ჯანმრთელობის პროგრამებით, რომლებიც შექმნილია თქვენი გონების და სხეულის გასაახლებლად.",
  },
  {
    id: 3,
    icon: image1,
    titleEn: "Gourmet Dining",
    titleGe: "გურმანული კვება",
    descEn:
      "Savor exquisite local and international cuisine prepared by our expert chefs using fresh, locally sourced ingredients.",
    descGe:
      "დააგემოვნეთ ნახევრად ადგილობრივი და საერთაშორისო კულინარია, რომელიც მომზადებულია ჩვენი ექსპერტი შეფ-მზარეულების მიერ ადგილობრივი ახალი ინგრედიენტების გამოყენებით.",
  },
  {
    id: 4,
    icon: image1,
    titleEn: "Adventure Activities",
    titleGe: "სათავგადასავლო აქტივობები",
    descEn:
      "Explore the great outdoors with guided hiking, mountain biking, and nature walks through our breathtaking landscapes.",
    descGe:
      "გაეცანით დიდ ღია ცის ქვეშ მდებარე ადგილებს ჰაიკინგით, მთის ველოსიპედით და ბუნების ფეხით სეირნობით ჩვენი გასაოცარი ლანდშაფტების მეშვეობით.",
  },
  {
    id: 5,
    icon: image1,
    titleEn: "Swimming Pool",
    titleGe: "საცურაო აუზი",
    descEn:
      "Enjoy our infinity pool overlooking the mountains, perfect for a refreshing swim or relaxing by the water with a cocktail.",
    descGe:
      "ისიამოვნეთ ჩვენი უსასრულო აუზით, რომელიც მთებს უყურებს, სრულყოფილია გამაგრილებელი ცურვისთვის ან კოქტეილით წყლის გასწვრივ დასასვენებლად.",
  },
  {
    id: 6,
    icon: image1,
    titleEn: "Conference Facilities",
    titleGe: "კონფერენციის ობიექტები",
    descEn:
      "Host successful business meetings and events in our fully equipped conference rooms with modern technology and professional service.",
    descGe:
      "გამართეთ წარმატებული ბიზნეს შეხვედრები და ღონისძიებები ჩვენს სრულად აღჭურვილ კონფერენციის ოთახებში თანამედროვე ტექნოლოგიებით და პროფესიონალური სერვისით.",
  },
  {
    id: 7,
    icon: image1,
    titleEn: "Fitness Center",
    titleGe: "ფიტნეს ცენტრი",
    descEn:
      "Stay active during your stay with our state-of-the-art fitness equipment, yoga classes, and personal training sessions.",
    descGe:
      "დარჩით აქტიური თქვენი ვიზიტის დროს ჩვენი თანამედროვე ფიტნეს აღჭურვილობით, იოგის გაკვეთილებით და პერსონალური ვარჯიშის სესიებით.",
  },
  {
    id: 8,
    icon: image1,
    titleEn: "Kids Club",
    titleGe: "ბავშვთა კლუბი",
    descEn:
      "Children enjoy supervised activities, games, and entertainment while parents relax and enjoy their vacation time.",
    descGe:
      "ბავშვები უვარგიშებენ ზედამხედველობის ქვეშ არსებულ აქტივობებს, თამაშებს და გართობას, ხოლო მშობლები ისვენებენ და უვარგიშებენ თავიანთ შვებულების დროს.",
  },
  {
    id: 9,
    icon: image1,
    titleEn: "Private Beach",
    titleGe: "პირადი ნაპირი",
    descEn:
      "Access our exclusive private beach area with sun loungers, beach service, and crystal clear waters for the perfect day in paradise.",
    descGe:
      "გამოიყენეთ ჩვენი ექსკლუზიური პირადი ნაპირის ზონა მზის სავარძლებით, ნაპირის სერვისით და სუფთა ნათელი წყლებით სრულყოფილი დღისთვის სამოთხეში.",
  },
];

const Comfort = () => {
  return (
    <div className="w-full flex justify-center relative px-5">
      <div className="bg2 opacity-[0.08] bg-fixed! bg-bottom-left absolute inset-0 bg-cover -z-10"></div>

      <div className="w-full max-w-[1500px] flex flex-col mt-20 min-h-screen xl:min-h-max">
        <div className="flex w-full justify-center items-center flex-col">
          <span className="text-5xl font-bold text-center">
            Stay Amidst Comfort and Nature
          </span>

          <div className="grid w-max grid-cols-1 md:grid-cols-2 my-14 gap-4 justify-items-center">
            {dummy.slice(0, 4).map((_, i) => (
              <ComfortCard key={i} data={_} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comfort;
