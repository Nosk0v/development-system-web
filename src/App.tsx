import Router from './app/router/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SessionLockGuard} from "./shared/SessionLockGuard.tsx";

const App = () => (
    <>
        <SessionLockGuard>
            <Router />
        </SessionLockGuard>
        <ToastContainer position="top-right" autoClose={3000} />
    </>
);

export default App;
