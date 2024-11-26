import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";

export default async function DishDetail({
    dish,
}: {
    dish: DishResType['data'] | undefined
}) {
    if (!dish)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-semibold">Món ăn không tồn tại</h1>
            </div>
        );

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
            {/* Tên món ăn */}
            <h1 className="text-4xl lg:text-5xl font-extrabold">{dish.name}</h1>

            {/* Hình ảnh và thông tin */}
            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                {/* Hình ảnh */}
                <div className="relative w-full lg:w-1/2 h-72 lg:h-96 overflow-hidden rounded-lg shadow-md">
                    <Image
                        src={dish.image}
                        fill
                        quality={100}
                        alt={dish.name}
                        className="object-cover"
                        title={dish.name}
                    />
                </div>

                {/* Thông tin món ăn */}
                <div className="flex-1 space-y-6 lg:pl-6">
                    {/* Giá món ăn */}
                    <div className="text-2xl font-semibold">
                        Giá: {formatCurrency(dish.price)}
                    </div>

                    {/* Mô tả */}
                    <p className="text-lg leading-relaxed">{dish.description}</p>
                </div>
            </div>
        </div>
    );
}
