import css from './SignInBlock.module.scss'
import {MainButton} from "../../../../widgets/button/button.tsx";
import { Label } from '../../../../widgets/input-label/label.tsx';
import {Input} from "../../../../widgets/input/input.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import { useSignInMutation } from '../../../../api/materialApi.ts';
import {useState} from "react";



export const SignInBlock = () => {
    const [signIn] = useSignInMutation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignIn = async () => {
        try {
            const res = await signIn({ email, password }).unwrap();
            toast.success('Успешный вход!');
            localStorage.setItem('access_token', res.access_token);

            navigate('/material-list');
        } catch (error) {
            toast.error('Ошибка авторизации! Пожалуйста, проверьте введенные данные.');
            console.error('Ошибка авторизации:', error);
        }
    };

    return (
        <div className={css.wrapper}>
            <div className={css.formContainer}>
                <div className={css.title}>Авторизизация</div>
                <Label label="Почта">
                    <Input
                        placeholder="Введите почту"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Обновление email
                    />
                </Label>
                <Label label="Пароль">
                    <Input
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Обновление password
                    />
                </Label>
                <MainButton text="Войти" onClick={onSignIn} />
            </div>
        </div>
    );
};
