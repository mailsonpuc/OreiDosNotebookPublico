import { useState, type FormEvent } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


export function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Para redirecionar

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            //  enviar 'userName' e 'password'
            const response = await api.post("/api/Auth/login", {
                userName,
                password
            });

            const { token, refreshToken, expiration } = response.data;

            // Armazenando os tokens no localStorage
            localStorage.setItem("@authTokenReiDosNotebooks", token);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("tokenExpiration", expiration);

            // Exibindo um toast de sucesso
            toast.success("Login realizado com sucesso!");

            // Redirecionando para a página de dashboard após login
            navigate("/");

        } catch (error: any) {
            console.error("Erro no login:", error);
            toast.error("Nome de usuário ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h1>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-600">Nome de usuário</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Digite seu nome de usuário"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={userName}
                        onChange={e => setUserName(e.target.value)} // Atualizando userName
                        maxLength={100}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">Senha</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={e => setPassword(e.target.value)} // Atualizando password
                        maxLength={100}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-600">
                        <input type="checkbox" className="mr-2" />
                        Lembrar de mim
                    </label>
                    <a href="#" className="text-sm text-blue-500 hover:text-blue-700">Esqueceu a senha?</a>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p className="mt-10">Não possui uma conta?</p>
            <Link to="/cadastra"
                className="text-sm text-blue-500 hover:text-blue-700"
            >Cadastre-se</Link>
        </div>
    );
}
