import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSignUpMutation, useSignInMutation } from '../../api/materialApi.ts';
import { MainButton } from '../../widgets/button/button.tsx';
import { Input } from '../../widgets/input/input.tsx';
import { Label } from '../../widgets/input-label/label.tsx';

import css from './RegistrationPage.module.scss';

export const RegistrationPage = () => {
	const [signUp] = useSignUpMutation();
	const [signIn] = useSignInMutation();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');

	const emailRegex = /^[\w.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,6}$/;

	const handleSignUp = async () => {
		if (!email || !password || !name) {
			toast.error('Заполните все поля');
			return;
		}
		if (!emailRegex.test(email)) {
			toast.error('Некорректный формат email');
			return;
		}

		try {
			const registrationData = {
				email,
				password,
				name,
				organization_id: 1,
			};

			await signUp(registrationData).unwrap();
			toast.success(`Добро пожаловать, ${name}!`);

			const loginResponse = await signIn({ email, password }).unwrap();
			localStorage.setItem('access_token', loginResponse.access_token);
			localStorage.setItem('refresh_token', loginResponse.refresh_token);

			navigate('/courses');
		} catch (error) {
			console.error(error);
			toast.error('Ошибка при регистрации или входе. Попробуйте позже.');
		}
	};

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				handleSignUp();
			}
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [email, password, name]);

	const handleNavigateToLogin = () => {
		navigate('/');
	};

	return (
		<div className={css.wrapper}>
			<div className={css.formContainer}>
				<div className={css.title}>Регистрация</div>
				<Label label="Имя">
					<Input
						placeholder="Введите имя"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</Label>
				<Label label="Почта">
					<Input
						placeholder="Введите почту"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Label>
				<Label label="Пароль">
					<Input
						type="password"
						placeholder="Введите пароль"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Label>
				<MainButton text="Зарегистрироваться" onClick={handleSignUp} />


				<div className={css.signUpHint}>
					<span>Уже есть аккаунт?</span>
					<button onClick={handleNavigateToLogin} className={css.signUpLink}>
						Войти в аккаунт
					</button>
				</div>
			</div>
		</div>
	);
};