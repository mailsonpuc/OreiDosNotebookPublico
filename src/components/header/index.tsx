import { useContext, useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FiShoppingCart } from "react-icons/fi"
import { CartContext } from "../context/CartContext"
import { jwtDecode } from "jwt-decode"

// Define a estrutura básica de um token decodificado (pode ter mais propriedades)
interface DecodedToken {
    unique_name?: string; // Nome de usuário no token
    exp?: number; // Tempo de expiração (Unix timestamp)
    // Outras claims...
}

export function Header() {
    const { cartAmount } = useContext(CartContext)
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Função para checar o status de autenticação e decodificar o usuário
    const checkAuthStatus = () => {
        // Use a chave que você está salvando no Login.tsx
        const token = localStorage.getItem('@authTokenReiDosNotebooks');

        if (token) {
            try {
                // Decodifica o token para obter as informações do usuário
                const decodedToken: DecodedToken = jwtDecode(token);
                
                // Verifica a expiração (boa prática)
                if (decodedToken.exp && (decodedToken.exp * 1000) < Date.now()) {
                     throw new Error("Token expirado.");
                }

                // Pega o nome de usuário (adapte 'unique_name' se for diferente na sua API)
                const userName = decodedToken.unique_name;

                setLoggedInUser(userName || null);
                // Não é estritamente necessário salvar o userName em localStorage se você decodifica,
                // mas é aceitável se for usado em outros lugares.
                // localStorage.setItem('userName', userName || ''); 

            } catch (e) {
                console.error("Token inválido, expirado ou erro na decodificação. Limpando sessão.", e);
                // Limpa todos os dados de login se o token for inválido
                localStorage.removeItem('@authTokenReiDosNotebooks');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenExpiration');
                localStorage.removeItem('userName');
                setLoggedInUser(null);
            }
        } else {
            setLoggedInUser(null);
        }
    };


    useEffect(() => {
        // 1. Roda a checagem ao carregar e sempre que a rota (location) muda.
        checkAuthStatus();

        // 2. Listener para o evento 'storage', que lida com logout/login em outras abas.
        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };

    }, [location.pathname]); // Executa novamente se o caminho da URL mudar


    // Função de Logout
    const handleLogout = () => {
        // Remove todos os itens de autenticação do localStorage
        localStorage.removeItem('@authTokenReiDosNotebooks');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userName'); // Limpa se você estiver usando
        localStorage.removeItem('token'); // Limpa se você estiver usando

        setLoggedInUser(null); // Limpa o estado local
        navigate('/login', { replace: true }); // Redireciona para o login
    };


    return (
        <header className="w-full px-1 bg-slate-200">
            <nav className="w-full max-w-7xl h-14 flex items-center justify-between px-5 mx-auto">
                
                {/* Logo */}
                <Link to="/" className="font-bold text-2xl">
                    O Rei dos Notebooks
                </Link>

                {/* Área Condicional: Olá, Usuário! / Sair OU Link de Login */}
                {loggedInUser && (
                    // Se estiver logado: Mostra saudação e botão Sair
                    <div className="flex items-center space-x-4">
                        <span className='text-gray-700 font-medium'>
                            Olá, <strong>{loggedInUser}</strong>!
                        </span>

                        <button
                            className='py-1 px-3 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition'
                            onClick={handleLogout}
                        >
                            Sair
                        </button>
                    </div>
                ) 
                
                // : (
                //     // Se NÃO estiver logado: Mostra link para Login
                //     <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-600 transition">
                //          <FiUser size={24} className="mr-1" />
                //          Login
                //     </Link>
                // )
                
                }


                {/* Ícone do Carrinho */}
                <Link to="/cart" className="relative">
                    <FiShoppingCart size={24} color="#121212" />
                    {cartAmount > 0 && (
                        <span className="absolute -top-3 -right-3 px-2.5 bg-sky-500 rounded-full w-6 flex items-center justify-center text-white text-xs">
                            {cartAmount}
                        </span>
                    )}
                </Link>

            </nav>
        </header>
    )
}