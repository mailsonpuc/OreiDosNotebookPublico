import React, { useEffect, useState } from 'react';
import axios, { type AxiosInstance } from 'axios';

// 1. Definição da Interface (Tipo) para o Produto
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imagemUrl: string; // Ex: "/img/51HvjwRCBJL._AC_SL1000_.jpg"
  fullImageUrl: string; // A URL completa que será usada na tag <img>
}

// 2. Configuração da API
const API_BASE_URL: string = "https://apinotebook-ehd3cuabdpazh8bs.canadacentral-01.azurewebsites.net"; 

// Criação da instância do Axios com a URL base
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

export function Carrousel() {
    // 3. Estado tipado para armazenar os produtos
    const [products, setProducts] = useState<Product[]>([]);
    // 4. Estados para controle do Carrossel e Feedback
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const totalSlides: number = products.length;

    // 5. Efeito para buscar os dados da API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Tipamos a resposta do Axios com o array de produtos esperado
                const response = await api.get<Omit<Product, 'fullImageUrl'>[]>("/api/Products");
                
                // Mapeia os dados e constrói a URL completa da imagem
                const productsWithFullUrl: Product[] = response.data.map(product => ({
                    ...product,
                    // Concatena a URL base com o caminho da imagem do produto
                    fullImageUrl: `${API_BASE_URL}${product.imagemUrl}`, 
                }));

                setProducts(productsWithFullUrl);
                
            } catch (err: unknown) {
                console.error("Erro ao buscar produtos:", err);
                // Tratamento de erro específico para TypeScript
                if (axios.isAxiosError(err)) {
                    setError(`Falha ao carregar: ${err.message}`);
                } else {
                    setError("Ocorreu um erro desconhecido ao carregar as imagens.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // 6. Efeito para o Auto-play (Mudança de Slide Automática)
    useEffect(() => {
        if (totalSlides > 0) {
            const interval = setInterval(() => {
                // Move para o próximo slide, loop infinito
                setActiveIndex(prevIndex => (prevIndex + 1) % totalSlides);
            }, 5000); // 5 segundos

            return () => clearInterval(interval); // Limpa o interval quando o componente desmonta
        }
    }, [totalSlides]);
    
    // 7. Funções de Navegação do Carrossel
    const nextSlide = () => {
        setActiveIndex(prevIndex => (prevIndex + 1) % totalSlides);
    };

    const prevSlide = () => {
        // Lógica para ir para o slide anterior, tratando a volta para o final
        setActiveIndex(prevIndex => (prevIndex - 1 + totalSlides) % totalSlides);
    };

    // 8. Tratamento de Estados (Feedback ao Usuário)
    if (loading) {
        return <div className="text-center p-8 text-lg">Carregando carrossel... ⏳</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-lg text-red-500">Erro: {error} ❌</div>;
    }

    if (totalSlides === 0) {
        return <div className="text-center p-8 text-lg">Nenhum produto encontrado para o carrossel.</div>;
    }


    // 9. Renderização do Carrossel
    return (
        <div id="default-carousel" className="relative w-full">
            {/* Carousel wrapper */}
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                
                {/* Renderiza os itens do Carrossel dinamicamente */}
                {products.map((product, index) => (
                    <div 
                        key={product.id} 
                        // Controla a visibilidade com base no activeIndex
                        className={`absolute w-full h-full duration-700 ease-in-out ${index === activeIndex ? 'block' : 'hidden'}`} 
                        data-carousel-item
                    >
                        <img 
                            src={product.fullImageUrl} 
                            className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" 
                            alt={product.title}
                        />
                         <div className="absolute inset-0 bg-black/30 flex items-end justify-start p-6">
                            <h3 className="text-white text-xl md:text-3xl font-bold text-shadow-lg drop-shadow-lg">{product.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {products.map((_, index) => (
                    <button 
                        key={index}
                        type="button" 
                        // Altera a cor do indicador ativo
                        className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`} 
                        aria-current={index === activeIndex ? "true" : "false"}
                        aria-label={`Slide ${index + 1} - ${products[index].title}`}
                        onClick={() => setActiveIndex(index)} 
                        data-carousel-slide-to={index}
                    ></button>
                ))}
            </div>

            {/* Slider controls (Anterior/Próximo) */}
            <button 
                type="button" 
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" 
                onClick={prevSlide}
                data-carousel-prev
            >
                {/* Ícone de seta (mantido o SVG original) */}
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button 
                type="button" 
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" 
                onClick={nextSlide}
                data-carousel-next
            >
                {/* Ícone de seta (mantido o SVG original) */}
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
    );
}