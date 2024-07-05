import './App.css';
import Home from './pages/Home';
import {WalletProvider} from './contexts/WalletContext';
import {Route, Routes, useLocation} from 'react-router-dom';
import Wallet from './pages/wallet/Wallet';

function App() {
  const location = useLocation();

  const getClassName = (pathname) => {
    switch (pathname) {
      case "/":
        return "home-class";
      default:
        return "default-class";
    }
  }

  return (
    <WalletProvider>
      <div className={getClassName(location.pathname)}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/#" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </div>
    </WalletProvider>
  );
}

export default App;
