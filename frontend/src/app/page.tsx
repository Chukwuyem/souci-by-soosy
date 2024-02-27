import React from 'react';
import Link from 'next/link';
import styles from '../styles/styles.module.css';

const IndexPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/capture">
          Capture Image
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;
