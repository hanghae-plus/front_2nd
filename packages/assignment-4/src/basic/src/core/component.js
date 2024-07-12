class Component {
  #innerHTML;

  constructor(innerHTML) {
    this.#innerHTML = innerHTML;
  }

  render() {
    return this.#innerHTML;
  }
}
