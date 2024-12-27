import { useEffect, useState } from "react";
import Coin from "./Coin";

function Coins({ io }) {
  const [coinData, setCoinData] = useState([])

  useEffect(() => {
    io.on("coin-data", data => setCoinData(data));
    return () => io.off("coin-data")
  }, [])

  return (
    <>
      <header className="navigation">
        <div className="flex items-center gap-16 fs-small">
          <a href="#"> خانه </a>
          <a href="#"> نمودار ها </a>
          <a href="#"> اشتراک ویژه </a>
          <a href="#"> پشتیبانی </a>
          <a href="#"> درباره ما </a>
          <a href="#"> تماس با ما </a>
        </div>
        <div className="flex gap-8">
          <a href="#" className="get-prime">
            خرید اشتراک
          </a>
          <a href="#" className="login-button">
            ورود | عضویت
          </a>
        </div>
      </header>

      <div className="table">
        <div className="table-head">
          <span className="flex items-center gap-4 table-head-row">
            رتبه
            <i className="bi bi-arrow-down-up fs-xs gray-200"></i>
          </span>
          <span className="flex items-center gap-4 table-head-row">
            ارز دیجیتال
            <i className="bi bi-arrow-down-up fs-xs gray-200"></i>
          </span>
          <span className="flex items-center gap-4 table-head-row">
            قیمت
            <i className="bi bi-arrow-down-up fs-xs gray-200"></i>
          </span>
          <span className="flex items-center gap-4 table-head-row">
            قیمت به تومان
            <i className="bi bi-arrow-down-up fs-xs gray-200"></i>
          </span>
          <span className="flex items-center gap-4 table-head-row">
            تغییرات (24ساعت)
            <i className="bi bi-arrow-down-up fs-xs gray-200"></i>
          </span>
          <span className="flex items-center gap-4 table-head-row">
            ارزش کل بازار
            <i className="bi bi-arrow-down-up fs-xs gray-200"></i>
          </span>
          <span className="flex items-center gap-4 table-head-row">
            حجم معاملات (24ساعت)
            <i className="bi bi-arrow-down-up fs-xs gray-200"></i>
          </span>
        </div>
        <div className="table-main">
          {coinData.map((coin) => (
            <Coin key={coin.id} {...coin} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Coins;
