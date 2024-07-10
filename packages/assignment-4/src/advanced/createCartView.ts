import { PRODUCTS } from './product';
import { getMainLayoutLiteral } from './templates';

export const createHtmlFromLiteral = (literal: string) => {
  return document.createRange().createContextualFragment(literal);
};

export const createCartView = () => {
  const mainLayoutLiteral = getMainLayoutLiteral({ items: PRODUCTS });

  const $app = document.getElementById('app');
  const $mainLayout = createHtmlFromLiteral(mainLayoutLiteral);

  $app?.append($mainLayout);
};
