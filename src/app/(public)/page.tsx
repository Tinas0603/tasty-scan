import dishApiRequest from '@/apiRequests/dish'
import { formatCurrency } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  let dishList: DishListResType['data'] = []
  try {
    const result = await dishApiRequest.list()
    const { payload: { data } } = result
    dishList = data
  } catch (error) {
    return <div className="text-center text-red-500 font-semibold mt-10">Something went wrong...</div>
  }

  return (
    <div className='w-full space-y-12'>
      {/* Banner Section */}
      <section className='relative z-10'>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10'></span>
        <Image
          src='/banner.png'
          width={400}
          height={200}
          quality={100}
          alt='Banner'
          className='absolute top-0 left-0 w-full h-full object-cover'
          priority
        />
        <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20 text-white'>
          <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 rainbow-text">
            Bếp ẩm thực TastyScan
          </h1>

          <p className='text-center text-sm sm:text-base mt-4 '>Sự tiện lợi trong mỗi lần quét, hương vị trong mỗi món ăn</p>
        </div>
      </section>

      {/* Dish Section */}
      <section className='space-y-10 py-16'>
        <h2 className='section-title'>Đa dạng các món ăn</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4'>
          {dishList.map((dish) => (
            <Link
              href={`/dishes/${dish.id}`}
              className='card flex flex-col items-center'
              key={dish.id}
            >
              <div className='w-full h-40 overflow-hidden rounded-t-lg'>
                <Image
                  src={dish.image}
                  width={300}
                  height={300}
                  quality={100}
                  className='object-cover w-full h-full'
                  alt={dish.name}
                />
              </div>
              <div className='p-4 w-full text-center space-y-2'>
                <h3 className='text-lg font-semibold'>{dish.name}</h3>
                <p className='text-sm text-muted-foreground'>{formatCurrency(dish.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
