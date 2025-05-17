import css from './SignInPage.module.scss';
import {SignInBlock} from "./sign-in-block";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignInPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        navigate('/', { replace: true });

    }, [navigate]);

    return (
        <div className={css.wrapper}>
            <SignInBlock />
        </div>
    );
};