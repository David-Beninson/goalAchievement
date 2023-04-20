import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../layout/layout";
import styles from "../styles/NotFound.module.css";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 4000);
  }, []);

  return (
    <Layout>
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>
          Sorry, we can't seem to find the page you're looking for.
        </h1>
        <Link href="/" className={styles.notFoundLink}>
          Go to Homepage
        </Link>
      </div>
    </Layout>
  );
};
export default NotFound;
