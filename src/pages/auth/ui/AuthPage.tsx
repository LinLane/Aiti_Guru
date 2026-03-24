import AuthForm from '../../../widgets/auth';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <AuthForm />
      </div>
    </main>
  );
}