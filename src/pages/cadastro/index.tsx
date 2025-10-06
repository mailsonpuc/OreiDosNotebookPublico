import { useState, type FormEvent } from "react";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export function Cadastra() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Função para validar a senha conforme IdentityOptions
    function validatePassword(password: string) {
        const minLength = /.{6,}/;
        const upperCase = /[A-Z]/;
        const lowerCase = /[a-z]/;
        const number = /[0-9]/;
        const specialChar = /[^A-Za-z0-9]/;

        if (!minLength.test(password))
            return "A senha deve ter pelo menos 6 caracteres.";
        if (!upperCase.test(password))
            return "A senha deve conter pelo menos uma letra maiúscula.";
        if (!lowerCase.test(password))
            return "A senha deve conter pelo menos uma letra minúscula.";
        if (!number.test(password))
            return "A senha deve conter pelo menos um número.";
        if (!specialChar.test(password))
            return "A senha deve conter pelo menos um caractere especial.";
        return null;
    }

    async function handleRegister(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        // Validação antes de enviar à API
        const passwordError = validatePassword(password);
        if (passwordError) {
            toast.error(passwordError);
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/api/Auth/register", {
                userName,
                email,
                password,
            });

            toast.success("Cadastro realizado com sucesso!");
            navigate("/login");
        } catch (error: any) {
            console.error("Erro no registro:", error);
            toast.error(
                error.response?.data?.message ||
                "Erro ao realizar cadastro. Verifique os dados e tente novamente."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                Cadastro
            </h1>

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-600"
                    >
                        Nome de usuário
                    </label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Digite seu nome de usuário"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        maxLength={100}
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-600"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Digite seu email"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        maxLength={100}
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-600"
                    >
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        A senha deve conter: 6+ caracteres, 1 maiúscula, 1 minúscula, 1
                        número e 1 símbolo.
                    </p>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    {loading ? "Cadastrando..." : "Cadastrar"}
                </button>

                <p className="text-sm text-center text-gray-600 mt-3">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Fazer login
                    </Link>
                </p>
            </form>
        </div>
    );
}
