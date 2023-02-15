import BlocksComponent from "../components/BlocksComponent";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <BlocksComponent />
        {/* <InstructionsComponent></InstructionsComponent> */}
      </main>
    </div>
  );
}
