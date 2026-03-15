import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full space-y-4">
      <div className="relative">
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
            Nhà hàng Big Boy
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">
            Vị ngon, trọn khoảnh khắc
          </p>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div className="flex gap-4 w" key={index}>
                <div className="flex-shrink-0">
                  {/* <Image
                    src="https://ik.imagekit.io/freeflo/production/6b91c700-92c4-4601-8e96-37d84ac3c28c.png?tr=w-2048,q-75&alt=media&pr-true"
                    alt="Mô tả hình ảnh món ăn DeBistro" 
                    width={150} 
                    height={150}
                    className="object-cover rounded-md"
                  /> */}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">Bánh mì</h3>
                  <p className="">Bánh mì sandwidch</p>
                  <p className="font-semibold">123,123đ</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
