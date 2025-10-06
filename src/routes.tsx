import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Cart } from "./pages/cart";
import { ProdutoDetail } from "./pages/details";
import { Login } from "./pages/login";
import { PrivateRoute } from "./components/PrivateRoute";
import { Cadastra } from "./pages/cadastro";
import { NotFound } from "./pages/notfound";

const router = createBrowserRouter([
  {
    // Rota Raiz que contém o Layout
    element: <Layout />,
    children: [
      // 1. ROTAS PÚBLICAS
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/cadastra",
        element: <Cadastra />,
      },
      {
        path: "/product/:id",
        element: <ProdutoDetail />,
      },

      // 2. ROTAS PROTEGIDAS
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/cart",
            element: <Cart />,
          },
        ],
      },

      // 3. ROTA DE ERRO (deve vir por último)
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export { router };
