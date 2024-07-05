import Header from '../components/Header';
import Banner from '../components/Banner';
import CreateWalletCard from '../components/cards/CreateWalletCard';
import AccessWalletCard from '../components/cards/AccessWalletCard';

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
        <CreateWalletCard />
        <AccessWalletCard />
      </div>
    </>
  );
}

export default Home;