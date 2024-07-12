/**
 * 제품 선택 컴포넌트 정의
 */
class ProductSelect extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <select id="internal-product-select" class="border rounded p-2 mr-2">
        <option value="p1">상품1 - 10000원</option>
        <option value="p2">상품2 - 20000원</option>
        <option value="p3">상품3 - 30000원</option>
      </select>
    `;
  }

  connectedCallback() {
    const select = this.querySelector('#internal-product-select');
    select.addEventListener('change', () => {
      const event = new CustomEvent('product-selected', {
        detail: select.value,
      });
      this.dispatchEvent(event);
    });

    // 초기 선택 상태를 설정하고 이벤트를 트리거합니다.
    select.value = 'p1';
    select.dispatchEvent(new Event('change'));
  }

  get value() {
    return this.querySelector('#internal-product-select').value;
  }

  set value(newValue) {
    this.querySelector('#internal-product-select').value = newValue;
    this.querySelector('#internal-product-select').dispatchEvent(new Event('change'));
  }
}

customElements.define('product-select', ProductSelect);
