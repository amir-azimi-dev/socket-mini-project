window.addEventListener("load", () => {
  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    socket.on("coin-data", (coins) => {
      showCoins(coins);
    });
  });
});


const showCoins = (coins) => {
  const coinsContainer = document.querySelector(".table-main");

  coinsContainer.innerHTML = "";

  coins.forEach((coin) => {
    coinsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="table-row">
          <div>${coin.id}</div>
          <div class="coin-name">
            <span>
              <img src="${coin.logo}" alt="Coin icon" class="coin-icon">
            </span>
            <div>
              <p>${coin.title}</p>
              <p class="coin-shortName">${coin.shortName}</p>
            </div>
          </div>
          <div>$${coin.price.toLocaleString()}</div>
          <div>
            <!-- Put your price on this span -->
            ${coin.tomanPrice.toLocaleString()} تومان
          </div>
          <!-- styles = increase, decrease -->
          <div class="${coin.status}">${coin.changePercent}%</div>
          <div>${coin.marketValue} میلیارد دلار</div>
          <div>${coin.transaction} میلیون دلار</div>
        </div>
      `
    );
  });
};
