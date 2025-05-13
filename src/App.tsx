import Router from './app/router/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
    <>
        <Router />
        <ToastContainer position="top-right" autoClose={3000} />
    </>
);

export default App;
