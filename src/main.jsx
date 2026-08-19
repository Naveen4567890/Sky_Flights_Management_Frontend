
import {createRoot} from 'react-dom/client';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './components/store/store';


window.global = window;

const root = createRoot(document.getElementById('root'));
root.render(
<Provider store={store}>
    <App />
   <Toaster
        position="top-right"
        toastOptions={{
            duration: 4000,
            style: {
            fontSize: "18px",
            padding: "16px 24px",
            minWidth: "320px",
            borderRadius: "14px",
            fontWeight: "600",
            zIndex: 99999,
            },

            success: {
            duration: 3000,
            style: {
                background: "#dcfce7",
                color: "#166534",
                border: "1px solid #86efac",
            },
            },

            error: {
            duration: 4000,
            style: {
                background: "#fee2e2",
                color: "#b91c1c",
                border: "1px solid #fca5a5",
            },
            },
        }}
        />
</Provider>
);