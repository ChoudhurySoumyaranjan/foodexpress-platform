import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store/store.js'
import AuthInitializer from './auth/AuthInitializer.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <Provider store={store}>  
      <AuthInitializer>
          <>
          <RouterProvider router={router} />

          {/* Toastify Configuration */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </>
      </AuthInitializer>
    </Provider>
  //</StrictMode>,
)
