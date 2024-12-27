import React from "react";

function Coin({
  title,
  shortName,
  logo,
  price,
  tomanPrice,
  changePercent,
  marketValue,
  transaction,
  status,
}) {
  return (
    <div className="table-row">
      <div>7</div>
      <div className="coin-name">
        <span>
          <img src={logo} alt="Coin icon" className="coin-icon" />
        </span>
        <div>
          <p>{title}</p>
          <p className="coin-shortName">{shortName}</p>
        </div>
      </div>
      <div>${price?.toLocaleString()}</div>
      <div>{tomanPrice?.toLocaleString()} تومان</div>
      <div className={status}>{changePercent}%</div>
      <div>{marketValue?.toLocaleString()} میلیارد دلار</div>
      <div>{transaction?.toLocaleString()} میلیون دلار</div>
    </div>
  );
}

export default Coin;
