import {createContext, useState} from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  return (
    <WalletContext.Provider value={{
      privateKey, setPrivateKey,
      publicKey, setPublicKey
    }}>
      {children}
    </WalletContext.Provider>
  );
}