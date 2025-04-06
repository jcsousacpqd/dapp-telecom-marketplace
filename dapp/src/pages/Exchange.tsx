import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import TLCAbi from '@/contracts/Telecoin.json';
import { TELECOIN_ADDRESS } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  display: flex;
  gap: 2rem;
  flex-direction: row;
  flex-wrap: wrap;
`;

const HomeLink = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

const Box = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #fff;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.3rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const TransactionItem = styled.li`
  font-size: 0.85rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
`;

export default function ExchangePage() {
  const [account, setAccount] = useState('');
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [tlcBalance, setTlcBalance] = useState('0');
  const [fiatBalance, setFiatBalance] = useState(100);
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [transactions, setTransactions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const tlc = new ethers.Contract(TELECOIN_ADDRESS, TLCAbi.abi, signer);

        setSigner(signer);
        setAccount(address);
        setContract(tlc);
        await loadBalance(tlc, address);
      }
    }
    init();
  }, []);

  async function loadBalance(tlc: any, address: string) {
    const bal = await tlc.balanceOf(address);
    setTlcBalance(ethers.formatUnits(bal, 18));
  }

  async function handleExchange() {
    const amount = parseFloat(exchangeAmount);
    if (!signer || isNaN(amount) || amount <= 0) return alert('Valor inválido');

    try {
      const response = await fetch('http://localhost:3001/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: account, amount }),
      });

      const res = await response.json();
      if (res.success) {
        setFiatBalance((prev) => prev - amount);
        await loadBalance(contract, account);
        setTransactions((prev) => [
          `Convertido $${amount.toFixed(2)} em ${amount.toFixed(2)} TLC`,
          ...prev,
        ]);
        setExchangeAmount('');
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao converter: ' + err);
    }
  }

  async function handleWithdraw() {
    const amount = parseFloat(exchangeAmount);
    if (!contract || isNaN(amount) || amount <= 0) return alert('Valor inválido');

    try {
      const tx = await contract.burn(ethers.parseUnits(amount.toString(), 18));
      await tx.wait();
      setFiatBalance((prev) => prev + amount);
      await loadBalance(contract, account);
      setTransactions((prev) => [
        `Convertido ${amount.toFixed(2)} TLC em $${amount.toFixed(2)}`,
        ...prev,
      ]);
      setExchangeAmount('');
    } catch (err) {
      console.error(err);
      alert('Erro ao sacar: ' + err);
    }
  }

  return (
    <Container>

      <Box>
        <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
        <h2>Exchange</h2>
        <p><strong>Conta:</strong> {account}</p>
        <p><strong>Saldo em Reais:</strong> ${fiatBalance.toFixed(2)}</p>
        <p><strong>Saldo em Tokens:</strong> {tlcBalance} TLC</p>

        <Label>Valor</Label>
        <Input
          type="number"
          value={exchangeAmount}
          onChange={(e) => setExchangeAmount(e.target.value)}
        />
        <Button onClick={handleExchange}>Converter para TLC</Button>
        <Button
          onClick={handleWithdraw}
          style={{ marginLeft: '1rem', background: '#0ea5e9' }}
        >
          Sacar em $
        </Button>
      </Box>

      <Box>
        <h2>Extrato</h2>
        <TransactionList>
          {transactions.map((t, idx) => (
            <TransactionItem key={idx}>{t}</TransactionItem>
          ))}
        </TransactionList>
      </Box>
    </Container>
  );
}
