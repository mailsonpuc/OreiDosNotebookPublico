import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import CartProvider from './components/context/CartContext'
import { Toaster } from 'react-hot-toast'



function App() {
  return (
    <div>
      <CartProvider>
        <Toaster
          position='top-center'
          reverseOrder={false}
        />
        <RouterProvider router={router} />
      </CartProvider>
    </div>
  )
}



export default App