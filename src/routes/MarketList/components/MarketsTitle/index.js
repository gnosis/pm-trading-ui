import React from "react";
import classNames from "classnames/bind";

import css from "./MarketsTitle.mod.scss";

const cx = classNames.bind(css);

const MarketListTitle = () => (
  <div className={cx("marketListTitle")}>
    <div className="container">
      <h1>Market Title. Meoww</h1>
      <h2>/routes/MarketList/Components/MarketTitle/index.js</h2>
    </div>
  </div>
);

export default MarketListTitle;
