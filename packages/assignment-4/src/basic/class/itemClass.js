import { appendChild, createEl } from '../utils/utils.js';
import { itemOptions } from '../data/elOptions.js';

/*
 *  - carItem 과 같은 일정한 데이터를 만들고 다루기 위해 class사용
 *  - OOP 지향적으로 데이터를 다루기 용이하고 유지보수 측면에서도 item을 다루는 매서드들과 값이 한군데 모여있는게 좋다고 판단
 * */
class ItemClass {
  constructor() {
    this.$item = null;
    this.$span = null;
    this.$minusBtn = null;
    this.$plusBtn = null;
    this.$removeBtn = null;
  }

  createItem(select) {
    this.$item = createEl('div', { id: select.id, ...itemOptions.itemBox });
    this.$item.dataset.quantity = '1';

    this.$span = createEl('span', {
      textContent:
        select.name +
        ' - ' +
        select.price +
        `원 x ${this.$item.dataset.quantity}`,
    });

    const $itemBtnWrap = createEl('div');
    this.createMinusBtn(select);
    this.createPlusBtn(select);
    this.createRemoveBtn(select);

    appendChild($itemBtnWrap, [this.$minusBtn, this.$plusBtn, this.$removeBtn]);
    appendChild(this.$item, [this.$span, $itemBtnWrap]);
  }

  createMinusBtn(select) {
    this.$minusBtn = createEl('button', itemOptions.minusBtn);
    this.$minusBtn.dataset.productId = select.id;
    this.$minusBtn.dataset.change = '-1';
  }

  handleClickMinusBtn(callBack, Item) {
    this.$minusBtn.onclick = () => {
      if (this.$item.dataset.quantity > 1) {
        this.setItemQuantity(-1);
        this.setSpanText();
      } else {
        delete Item[this.$item.id];
        this.$item.remove();
      }

      callBack();
    };
  }

  createPlusBtn(select) {
    this.$plusBtn = createEl('button', itemOptions.plusBtn);
    this.$plusBtn.dataset.productId = select.id;
    this.$plusBtn.dataset.change = '1';
  }
  handleClickPlusBtn(callBack) {
    this.$plusBtn.onclick = () => {
      this.setItemQuantity(1);
      this.setSpanText();

      callBack();
    };
  }

  createRemoveBtn(select) {
    this.$removeBtn = createEl('button', itemOptions.removeBtn);
    this.$removeBtn.dataset.productId = select.id;
  }

  handleClickRemoveBtn(callBack, Item) {
    this.$removeBtn.onclick = () => {
      delete Item[this.$item.id];
      this.$item.remove();

      callBack();
    };
  }

  setItemQuantity(num) {
    this.$item.dataset.quantity = parseInt(this.$item.dataset.quantity) + num;
  }

  setSpanText(select) {
    if (select)
      this.$span.textContent = `${select.name} - ${select.price}원 x ${this.$item.dataset.quantity}`;
    if (!select)
      this.$span.textContent =
        this.$span.textContent.split('x ')[0] +
        'x ' +
        this.$item.dataset.quantity;
  }
}

export default ItemClass;
