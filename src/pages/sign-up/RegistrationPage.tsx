import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSignUpMutation, useSignInMutation } from '../../api/materialApi.ts';
import { MainButton } from '../../widgets/button/button.tsx';
import { Input } from '../../widgets/input/input.tsx';
import { Label } from '../../widgets/input-label/label.tsx';

import css from './RegistrationPage.module.scss';
import EyeIcon from '../../assets/images/view.png';
import EyeOffIcon from '../../assets/images/hide.png';

export const RegistrationPage = () => {
	const [signUp] = useSignUpMutation();
	const [signIn] = useSignInMutation();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [inviteCode, setInviteCode] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordMismatch, setPasswordMismatch] = useState(false);
	const emailRegex = /^[\w.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,6}$/;

	const handleSignUp = async () => {
		if (password !== confirmPassword) {
			setPasswordMismatch(true);
			toast.error('Пароли не совпадают');
			return;
		} else {
			setPasswordMismatch(false);
		}

		if (!email) {
			toast.error('Введите email');
			return;
		}
		if (!password) {
			toast.error('Введите пароль');
			return;
		}
		if (!name) {
			toast.error('Введите имя');
			return;
		}
		if (!inviteCode) {
			toast.error('Введите код приглашения');
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
				code: inviteCode,
			};

			await signUp(registrationData).unwrap();
			toast.success(`Добро пожаловать, ${name}!`);

			const loginResponse = await signIn({ email, password }).unwrap();
			localStorage.setItem('access_token', loginResponse.access_token);
			localStorage.setItem('refresh_token', loginResponse.refresh_token);

			navigate('/courses');
		} catch (error) {
			const err = error as { status?: number };
			if (err?.status === 433) {
				toast.error('Пользователь с таким email уже зарегистрирован');
			}
			if (err?.status === 434) {
				toast.error('Код приглашения уже использован');
			}
			if (err?.status === 435) {
				toast.error('Код приглашения невалиден');
			} else {
				console.error(err);
				toast.error('Ошибка при регистрации или входе. Попробуйте позже.');
			}
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
					<div className={css.passwordField}>
						<Input
							type={showPassword ? 'text' : 'password'}
							placeholder="Введите пароль"
							value={password}
							disablePaste={true}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							type="button"
							onClick={() => {
								setShowPassword(!showPassword);
								setConfirmPassword('');
							}}
							className={css.eyeButton}
						>
							<img src={showPassword ? EyeIcon : EyeOffIcon} alt="Показать пароль" />
						</button>
					</div>
				</Label>
				<Label label="Подтвердите пароль">
					<div className={css.passwordField}>
						<Input
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder="Введите пароль повторно"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disablePaste={true}
							className={passwordMismatch ? css.inputError : ''}
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className={css.eyeButton}
						>
							<img src={showConfirmPassword ? EyeIcon : EyeOffIcon} alt="Показать пароль" />
						</button>
					</div>
				</Label>
				<Label label="Код приглашения в организацию">
					<Input
						placeholder="Введите код приглашения"
						value={inviteCode}
						onChange={(e) => {
							const raw = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 30);
							const parts = raw.match(/.{1,5}/g);
							const formatted = parts ? parts.join('-') : '';
							setInviteCode(formatted);
						}}
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
