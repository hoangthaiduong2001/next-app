import dishApiRequest from "@/apiRequest/dish";
import { formatCurrency } from "@/config/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Foodie HTD",
  description: "Foodie HTD",
  icons: {
    icon: "https://cdn-icons-png.flaticon.com/512/857/857755.png",
  },
};

const Home = async () => {
  let dishList: DishListResType["data"] = [];
  try {
    const result = await dishApiRequest.getListDish();
    const { data } = result.response;
    dishList = data;
  } catch {
    return <div>Something went wrong</div>;
  }
  return (
    <div className="w-full space-y-4">
      <section className="relative z-10">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
        <Image
          src="/banner.png"
          width={400}
          height={200}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            Foodie HTD
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">
            Delicious taste, full moment
          </p>
        </div>
      </section>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">Variety of dishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishList.map((dish) => (
            <div className="flex gap-4 justify-center" key={dish.id}>
              <div className="flex-shrink-0">
                <Image
                  src={dish.image}
                  width={150}
                  height={150}
                  quality={100}
                  alt={dish.name}
                  unoptimized
                  className="object-cover w-[150px] h-[150px] rounded-md"
                />
              </div>
              <div className="space-y-1 w-1/6">
                <h3 className="text-xl font-semibold text-nowrap">
                  {dish.name}
                </h3>
                <p className="text-nowrap">{dish.description}</p>
                <p className="font-semibold text-nowrap">
                  {formatCurrency(dish.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
