import { createContext, type ReactNode, useState } from "react";
import { type ProductProps } from "../../pages/home";


interface CartContextData {
    cart: CartProps[]
    cartAmount: number;
    addItemCart: (newItem: ProductProps) => void;
    removeItemCart: (product: CartProps) => void
    total: string;
}

interface CartProps {
    id: string;
    title: string;
    description: string;
    price: number;
    imagemUrl: string;
    amount: number;
    total: number;
}
export const CartContext = createContext({} as CartContextData)


interface CartProviderProps {
    children: ReactNode
}


function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartProps[]>([])
    const [total, setTotal] = useState("")

    function addItemCart(newItem: ProductProps) {
        //adiciona no carrinho
        //se ja nao existe ele no carrinho
        const indexItem = cart.findIndex(item => item.id == newItem.id)
        if (indexItem !== -1) {
            //se entrou aqui soma +1 e calcula o total desse carrinho
            let cartList = cart

            cartList[indexItem].amount = cartList[indexItem].amount + 1
            cartList[indexItem].total = cartList[indexItem].amount * cartList[indexItem].price

            setCart(cartList)
            totalResultCart(cartList)
            return
        }

        //adicionar na lista
        let data = {
            ...newItem,
            amount: 1,
            total: newItem.price
        }

        setCart(products => [...products, data])
        totalResultCart([...cart, data])
    }


    function removeItemCart(product: CartProps) {
        const indexItem = cart.findIndex(item => item.id === product.id)

        if (cart[indexItem]?.amount > 1) {
            //diminuir apenas 1 amount que tem.
            let cartList = cart;
            cartList[indexItem].amount = cartList[indexItem].amount -1
            cartList[indexItem].total = cartList[indexItem].total - cartList[indexItem].price

            setCart(cartList)
            totalResultCart(cartList)
            return
        }


        const removeItem = cart.filter(item => item.id !== product.id)
        setCart(removeItem)
        totalResultCart(removeItem)

    }


    function totalResultCart(items: CartProps[]) {
        let myCart = items;
        let result = myCart.reduce((acc, obj) => { return acc + obj.total }, 0)
        const reultFormated = result.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        })

        setTotal(reultFormated)

    }

    return (
        <CartContext.Provider
            value={{
                cart,
                cartAmount: cart.length,
                addItemCart,
                removeItemCart,
                total
            }}>
            {children}

        </CartContext.Provider>
    )
}

export default CartProvider