'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useDishListQuery } from '@/queries/useDish'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { DishStatus } from '@/constants/type'
import { useRouter } from 'next/navigation'
import Quantity from './quantity'

export default function MenuOrder() {
    const { data } = useDishListQuery()
    const dishes = useMemo(() => data?.payload.data ?? [], [data])
    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
    const { mutateAsync } = useGuestOrderMutation()
    const router = useRouter()
    const [isDescriptionOpen, setIsDescriptionOpen] = useState<number | null>(null) // Track the dishId whose description is open
    const totalPrice = useMemo(() => {
        return dishes.reduce((result, dish) => {
            const order = orders.find((order) => order.dishId === dish.id)
            if (!order) return result
            return result + order.quantity * dish.price
        }, 0)
    }, [dishes, orders])

    const handleQuantityChange = (dishId: number, quantity: number) => {
        setOrders((prevOrders) => {
            if (quantity === 0) {
                return prevOrders.filter((order) => order.dishId !== dishId)
            }
            const index = prevOrders.findIndex((order) => order.dishId === dishId)
            if (index === -1) {
                return [...prevOrders, { dishId, quantity }]
            }
            const newOrders = [...prevOrders]
            newOrders[index] = { ...newOrders[index], quantity }
            return newOrders
        })
    }

    const handleOrder = async () => {
        try {
            await mutateAsync(orders)
            router.push(`/guest/orders`)
        } catch (error) {
            handleErrorApi({ error })
        }
    }

    const handleDescriptionClick = (dishId: number) => {
        // Toggle description open/close for the specific dish
        setIsDescriptionOpen(prev => prev === dishId ? null : dishId)
    }

    return (
        <>
            {dishes
                .filter((dish) => dish.status !== DishStatus.Hidden)
                .map((dish) => (
                    <div
                        key={dish.id}
                        className={cn('flex gap-4', {
                            'pointer-events-none': dish.status === DishStatus.Unavailable
                        })}
                    >
                        <div className='flex-shrink-0 relative'>
                            {dish.status === DishStatus.Unavailable && (
                                <span className='absolute inset-0 flex items-center justify-center text-sm'>
                                    Hết hàng
                                </span>
                            )}
                            <Image
                                src={dish.image}
                                alt={dish.name}
                                height={100}
                                width={100}
                                quality={100}
                                className='object-cover w-[80px] h-[80px] rounded-md'
                            />
                        </div>
                        <div className='space-y-1 flex-1'>
                            <h3 className='text-sm'>{dish.name}</h3>
                            <p
                                className={cn('text-xs', {
                                    'line-clamp-3': isDescriptionOpen !== dish.id,
                                })}
                            >
                                {dish.description}
                            </p>
                            {!isDescriptionOpen && dish.description.length > 100 && (
                                <button
                                    onClick={() => handleDescriptionClick(dish.id)}
                                    className="text-xs text-blue-500"
                                >
                                    Xem thêm
                                </button>
                            )}
                            {isDescriptionOpen === dish.id && (
                                <button
                                    onClick={() => handleDescriptionClick(dish.id)}
                                    className="text-xs text-blue-500"
                                >
                                    Thu gọn
                                </button>
                            )}
                        </div>

                        <div className="ml-auto flex flex-col items-center ">
                            <p className='text-xs font-semibold'>
                                Giá: {formatCurrency(dish.price)}
                            </p>
                            <Quantity
                                onChange={(value) => handleQuantityChange(dish.id, value)}
                                value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                            />
                        </div>
                    </div>
                ))}
            <div className='sticky bottom-0'>
                <Button
                    className='w-full justify-between'
                    onClick={handleOrder}
                    disabled={orders.length === 0}
                >
                    <span>Đặt hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    )
}
