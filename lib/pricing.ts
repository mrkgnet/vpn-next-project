import React from "react";

const pricing = (gb: number, days: number) => {
  const basePrice = 3000;
  const extraCharge = 1300;
  if (days > 31) {
    return gb * (basePrice + extraCharge);
  }
  return gb * basePrice;
};

export default pricing;
