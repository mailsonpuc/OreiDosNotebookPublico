import { useContext } from "react"
import { CartContext } from "../../components/context/CartContext"
import { getFullImageUrl } from "../home"
import { Link } from "react-router-dom"
import toast from "react-hot-toast";


export function Cart() {
    const { cart, total, addItemCart, removeItemCart } = useContext(CartContext)

    function handleFinalizar() {
        toast.success("Comprar Finalzada.")
    }


    return (
        <div className="w-full max-w-7xl  mx-auto">
            <h1 className="font-medium text-2xl text-center my-4">Meu Carrinho</h1>
            {cart.length === 0 && (

                <div className="flex flex-col items-center justify-center">
                    <p className="font-medium">Seu carrinho está vazio...</p>
                    <Link to="/" className="bg-slate-600 my-3 p-1 px-3 text-white font-medium rounded">
                        Acessar Produtos
                    </Link>
                </div>
            )}
            {cart.map((item) => (
                <section className="flex items-center justify-between border-b-2 border-gray-300" key={item.id}>
                    <img
                        className="w-28"
                        src={getFullImageUrl(item.imagemUrl)}
                        alt={item.title}
                    />
                    <strong>
                        Preço: {
                            item.price.toLocaleString("pt-br", {
                                style: "currency",
                                currency: "BRL"
                            })
                        }
                    </strong>

                    <div className="flex items-center justify-center gap-3">
                        <button
                            className="bg-slate-500 px-2 rounded text-white font-medium flex items-center justify-center"
                            onClick={() => removeItemCart(item)}
                        >
                            -
                        </button>

                        {item.amount}

                        <button
                            className="bg-slate-500 px-2 rounded text-white font-medium flex items-center justify-center"
                            onClick={() => addItemCart(item)}
                        >
                            +
                        </button>
                    </div>

                    <strong className="float-right">
                        SubTotal: {
                            item.total.toLocaleString("pt-br", {
                                style: "currency",
                                currency: "BRL"
                            })
                        }
                    </strong>
                </section>

            ))}

            {cart.length !== 0 && <p className="font-bold mt-4">Total: {total}</p>}



            {cart.length !== 0 && (

                <button
                    onClick={handleFinalizar}
                    className="bg-slate-500 px-2 
                rounded text-white font-medium 
                flex items-center justify-center
                mt-2.5
                "
                >
                    Finalizar Comprar.
                </button>
            )}


        </div>
    )
}