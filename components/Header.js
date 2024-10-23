import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';  // Importamos el CSS modular

export default function Header({ carritoCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={190} height={80} className={styles.logo} />
        </Link>

        {/* Menú de navegación */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/productos" className={styles.navLink}>
            Productos
          </Link>
          <Link href="/contacto" className={styles.navLink}>
            Contacto
          </Link>
        </nav>

        {/* Carrito */}
        <Link href="/carrito">
          <div className={styles.cartContainer}>
            <span className={styles.cartText}>Carrito</span>
            <div className={styles.cartCount}>
              {carritoCount}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
