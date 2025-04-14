import React, { useState } from 'react';

interface Holding {
  ticker: string;
  shares: number;
  buyPrice: number;
  realTimePrice?: number;
}
const Holdings: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const fetchRealTimePrice = async (ticker: string) => {
    setError('');
    try {
      const response = await fetch(`/api/hello?ticker=${ticker}`);
      if (!response.ok) throw new Error(`Network response was not ok`);
      try {
        const data = await response.json();
        if (data && data.price) {
          return data.price;
        } else {
          setError(`Invalid data received for ${ticker}`);
          return undefined;
        }
      } catch (e) {
        setError(`Failed to fetch price for ${ticker}`);
        console.error(e);
        return undefined
      }
    } catch (e) {
      setError(`Failed to fetch price for ${ticker}`);
      console.error(e);
      return undefined
    }
  };
  
  const [newHolding, setNewHolding] = useState<Holding>({ ticker: '', shares: 0, buyPrice: 0 });
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);

  const addHolding = async () => {
    try {
      if (newHolding.ticker && newHolding.shares > 0 && newHolding.buyPrice > 0) {
        const price = await fetchRealTimePrice(newHolding.ticker)
        if(price !== undefined) {
            setHoldings([...holdings, { ...newHolding, realTimePrice: price }]);
          } else {
              setError(`Could not add holding for ${newHolding.ticker}`);
          }
        setNewHolding({ ticker: '', shares: 0, buyPrice: 0 });
      }
    } catch (e) {
        setError(`Could not add holding for ${newHolding.ticker}`);
        console.error(e);
    }
  };

  const updateHolding = async (updatedHolding: Holding) => {
    try {
      const price = await fetchRealTimePrice(updatedHolding.ticker)
      if(price !== undefined){
          setHoldings(holdings.map(holding =>
              holding.ticker === updatedHolding.ticker ? { ...updatedHolding, realTimePrice: price } : holding,
          ));
          setEditingHolding(null);
      }
    } catch (e) {
      setError(`Could not update holding for ${updatedHolding.ticker}`)
      console.error(e);
    }
  };
    const [error, setError] = useState<string>('');

  return (
    <div>
      <h1>My Holdings</h1>
      <div className="add-holding">
        <input
          type="text"
          placeholder="Ticker"
          value={newHolding.ticker}
          onChange={(e) => setNewHolding({ ...newHolding, ticker: e.target.value })}
        />
        <input
          type="number"
          placeholder="Shares"
          value={newHolding.shares}
          onChange={(e) => setNewHolding({ ...newHolding, shares: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Buy Price"
          value={newHolding.buyPrice}
          onChange={(e) => setNewHolding({ ...newHolding, buyPrice: Number(e.target.value) })}
        />
        <button onClick={editingHolding ? () => {updateHolding(newHolding)} : addHolding}>{editingHolding ? 'Update Holding' : 'Add Holding'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div className='holdings-list'>
        <table className="holdings-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Ticker</th> 
              <th style={{ textAlign: 'left' }}>Shares</th> 
              <th style={{ textAlign: 'left' }}>Buy Price</th> 
              <th style={{ textAlign: 'left' }}>Real-Time Price</th>
              <th style={{ textAlign: 'left' }}>%</th>
              <th style={{ textAlign: 'left' }}>Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding.ticker} className="holding"  >
                <td  >{holding.ticker}</td>
                <td  >{holding.shares}</td>
                <td  >{holding.buyPrice}</td>
                <td  >{holding.realTimePrice === undefined ? 'N/A' : holding.realTimePrice.toFixed(2)}</td>
                <td>{
                    holding.realTimePrice === undefined ? 'N/A' : (
                        (() => {
                            const percentage = ((holding.realTimePrice - holding.buyPrice) / holding.buyPrice) * 100;
                            const color = percentage >= 0 ? 'green' : 'red';
                            return <span style={{ color }}>{percentage.toFixed(2)}%</span>;
                        })()
                    )
                }
                </td>
                <td  >
                  {
                    (() => {
                      const currentPrice = holding.realTimePrice || 0;
                      const profitLoss = (currentPrice - holding.buyPrice) * holding.shares;
                      return <span style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>{profitLoss.toFixed(2)}</span>
                  })() 
                }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default Holdings;