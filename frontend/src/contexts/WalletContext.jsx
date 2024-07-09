import {createContext, useState} from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const getTimeAgo = (timestamp) => {
    const secondsPerMinute = 60;
    const secondsPerHour = secondsPerMinute * 60;
    const secondsPerDay = secondsPerHour * 24;
    const secondsPerMonth = secondsPerDay * 30; // Tạm tính tháng có 30 ngày
    const secondsPerYear = secondsPerDay * 365; // Tạm tính năm có 365 ngày

    const now = Math.floor(new Date().getTime() / 1000);
    const elapsed = now - timestamp;

    if (elapsed < secondsPerMinute) {
      return `${elapsed} second${elapsed !== 1 ? 's' : ''} ago`;
    } else if (elapsed < secondsPerHour) {
      const minutes = Math.floor(elapsed / secondsPerMinute);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (elapsed < secondsPerDay) {
      const hours = Math.floor(elapsed / secondsPerHour);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (elapsed < secondsPerMonth) {
      const days = Math.floor(elapsed / secondsPerDay);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (elapsed < secondsPerYear) {
      const months = Math.floor(elapsed / secondsPerMonth);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(elapsed / secondsPerYear);
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  }

  const shortenAddress = (address) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  const shortenTransactionId = (id) => {
    return `${id.slice(0, 15)}...`;
  }

  return (
    <WalletContext.Provider value={{
      privateKey, setPrivateKey,
      publicKey, setPublicKey,
      getTimeAgo,
      shortenAddress,
      shortenTransactionId
    }}>
      {children}
    </WalletContext.Provider>
  );
}