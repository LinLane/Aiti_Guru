import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '../../../shared/ui/button';
import { Checkbox } from '../../../shared/ui/checkbox';
import { Delimiter } from '../../../shared/ui/delimiter';
import { Input } from '../../../shared/ui/input';
import { Link } from '../../../shared/ui/link';
import { useToast } from '../../../shared/ui/toast';
import { getAuthErrorMessage, useAuthStore } from '../../../features/auth';
import userIcon from '../assets/userIcon.png';
import deleteIcon from '../assets/delete.png';
import eyeOffIcon from '../assets/eye-off.png';
import eyeOnIcon from '../assets/eye-on.svg';
import lockIcon from '../assets/lock-03.png';
import logoIcon from '../assets/logo.png';
import styles from './AuthForm.module.css';

export default function AuthForm() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);
    const { showToast } = useToast();
    const [values, setValues] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [highlightEmpty, setHighlightEmpty] = useState({
        username: false,
        password: false,
    });
    const [credentialsInvalid, setCredentialsInvalid] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
        setCredentialsInvalid(false);
        setHighlightEmpty((previous) => ({ ...previous, username: false }));
        setValues((previous) => ({
            ...previous,
            username: event.target.value,
        }));
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setCredentialsInvalid(false);
        setHighlightEmpty((previous) => ({ ...previous, password: false }));
        setValues((previous) => ({
            ...previous,
            password: event.target.value,
        }));
    }

    function clearUsername() {
        setCredentialsInvalid(false);
        setHighlightEmpty((previous) => ({ ...previous, username: false }));
        setValues((previous) => ({ ...previous, username: '' }));
    }

    function togglePasswordVisible() {
        setPasswordVisible((previous) => !previous);
    }

    function handleRememberMeChange(event: ChangeEvent<HTMLInputElement>) {
        setValues((previous) => ({
            ...previous,
            rememberMe: event.target.checked,
        }));
    }

    function validate(): boolean {
        const usernameEmpty = !values.username.trim();
        const passwordEmpty = !values.password.trim();
        setHighlightEmpty({ username: usernameEmpty, password: passwordEmpty });

        if (usernameEmpty || passwordEmpty) {
            const message =
                usernameEmpty && passwordEmpty
                    ? 'Введите логин и пароль'
                    : usernameEmpty
                        ? 'Введите логин'
                        : 'Введите пароль';
            showToast({ variant: 'error', message });
            return false;
        }

        return true;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            await login({
                username: values.username.trim(),
                password: values.password,
                rememberMe: values.rememberMe,
            });
            navigate('/products', { replace: true });
        } catch (caught: unknown) {
            showToast({ variant: 'error', message: getAuthErrorMessage(caught) });
            setCredentialsInvalid(true);
        }
    }

    return (
        <article className={styles.card}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.logoWrapper}>
                        <img className={styles.logo} src={logoIcon} alt="" />
                    </div>
                    <h1 className={styles.title}>Добро пожаловать!</h1>
                    <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>
                </header>

                <form className={styles.form} noValidate onSubmit={handleSubmit}>
                    <div className={styles.fields}>
                        <Input
                            fullWidth
                            name="username"
                            autoComplete="username"
                            label="Логин"
                            value={values.username}
                            onChange={handleUsernameChange}
                            invalid={highlightEmpty.username || credentialsInvalid}
                            leftIcon={<img src={userIcon} alt="" />}
                            rightIcon={
                                <button
                                    type="button"
                                    className={styles.iconButton}
                                    aria-label="Очистить логин"
                                    disabled={!values.username}
                                    onClick={clearUsername}
                                >
                                    <img src={deleteIcon} alt="" aria-hidden />
                                </button>
                            }
                        />
                        <Input
                            fullWidth
                            name="password"
                            type={passwordVisible ? 'text' : 'password'}
                            autoComplete="current-password"
                            label="Пароль"
                            value={values.password}
                            onChange={handlePasswordChange}
                            invalid={highlightEmpty.password || credentialsInvalid}
                            leftIcon={<img src={lockIcon} alt="" />}
                            rightIcon={
                                <button
                                    type="button"
                                    className={styles.iconButton}
                                    aria-label={passwordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                                    onClick={togglePasswordVisible}
                                >
                                    <img
                                        src={passwordVisible ? eyeOnIcon : eyeOffIcon}
                                        alt=""
                                        aria-hidden
                                    />
                                </button>
                            }
                        />
                    </div>

                    <Checkbox
                        label="Запомнить данные"
                        name="rememberMe"
                        checked={values.rememberMe}
                        onChange={handleRememberMeChange}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Входим...' : 'Войти'}
                    </Button>
                </form>

                <div className={styles.footer}>
                    <Delimiter text="или" />
                    <p className={styles.footerText}>
                        Нет аккаунта? <Link href="/signup">Создать</Link>
                    </p>
                </div>
            </div>

        </article>
    );
}
