export const calculateTotalCost = (nowCart) => {
  return nowCart.reduce((accumulator, current) => {
    let disc = 0;

    if (current.cnt >= 10) {
      if (current.id === "p1") disc = 0.1;
      else if (current.id === "p2") disc = 0.15;
      else if (current.id === "p3") disc = 0.2;
    }
    const optionTotalCost = current.cost * current.cnt;

    return accumulator + optionTotalCost * (1 - disc);
  }, 0);
};

export const calculateDiscount = (nowCart, dcTotalCost) => {
  const nowTotalCost = nowCart.reduce((ac, cu) => ac + cu.cost * cu.cnt, 0);
  const totalCnt = nowCart.reduce((ac, cu) => ac + cu.cnt, 0);

  let dc = (nowTotalCost - dcTotalCost) / nowTotalCost;
  let finalDcTotalCost = dcTotalCost;

  if (totalCnt >= 30) {
    const bulkDiscount = dcTotalCost * 0.25;
    const individualDiscount = nowTotalCost - dcTotalCost;
    if (bulkDiscount > individualDiscount) {
      finalDcTotalCost = nowTotalCost * 0.75;
      dc = 0.25;
    }
  }

  return {
    conclusedTotalCost: Math.round(finalDcTotalCost),
    totalDc: (dc * 100).toFixed(1),
  };
};
