import { useEffect, useState, useContext } from "react";
import { BsCartPlus } from "react-icons/bs";
import { api } from "../../services/api"
import { CartContext } from "../../components/context/CartContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loading } from "../../components/loading/"
import { Carrousel } from "../carrousel";
import { Footer } from "../footer";

export interface ProductProps {
    id: string;
    title: string;
    description: string;
    price: number;
    imagemUrl: string;
}



//pegar a imagem da pasta do backend, caminho completo
//http://localhost:5297/img/51HvjwRCBJL._AC_SL1000_.jpg
export function getFullImageUrl(relativePath: string) {
    return `${api.defaults.baseURL}${relativePath}`
}


export function Home() {
    const { addItemCart } = useContext(CartContext)
    const [products, setProducts] = useState<ProductProps[]>([])
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function getProducts() {
            try {
                setLoading(true);
                const response = await api.get("/api/Products");
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                toast.error("Erro ao carregar produtos.");
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);


    function handleAddCartItem(product: ProductProps) {
        // console.log(product)
        toast.success("Produto adicionado no carrinho.")
        addItemCart(product)
    }

  // Mostra o componente de carregamento enquanto busca os produtos
    if (loading) {
        return <Loading />;
    }
  


    return (
        <div className="w-full max-w-7xl px-4 mx-auto">
            <Carrousel/>
            <h1 className="font-bold text-2xl mb-4 mt-10 text-center">Podutos em alta</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">

                {products.map((product) => (
                    <section className="w-full" key={product.id}>
                        <Link to={`/product/${product.id}`}>
                            <img
                                className="w-full rounded-lg max-h-70 mb-2 object-contain"
                                //pegar o http://localhost:5297/+ img/51HvjwRCBJL._AC_SL1000_.jpg
                                src={getFullImageUrl(product.imagemUrl)}
                                alt={product.title}
                            />
                        </Link>

                        <p className="font-medium mt-1 mb-2">{product.title}</p>
                        <div className="flex gap-3 items-center">
                            <strong className="text-zinc-700/90">
                                {product.price.toLocaleString("pt-br", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                            </strong>
                            <button className="bg-zinc-900 p-1 rounded" onClick={() => handleAddCartItem(product)}>
                                <BsCartPlus size={20} color="#FFF" />
                            </button>
                        </div>
                    </section>
                ))}


            </div>
            <Footer/>
        </div>
    )
}