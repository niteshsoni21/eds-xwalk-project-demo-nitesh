export default function decorate(block) {
  const variantsContainer = block.querySelector(':scope > div > div');
  const variantDiv = document.createElement('div');
  variantDiv.classList.add('car-variant');
  console.log('car-variant class added');

  variantDiv.innerHTML = `
    <div class='variant'>
      <img src='/content/dam/demo-auto/english/images/highlights/Highlight-01.webp' alt='Maruti Brezza Lxi CNG' class='variant-image' />
      <h2 class='variant-title'>Maruti Brezza Lxi CNG</h2>
      <p class='variant-price'>₹ 10,00,000</p>
      <p class='variant-location'>Ex-showroom, Punjab</p>
      <div class='variant-features'><ul>\n<li>Safety First</li>\n<li>Lorem Ipsum Daller Sit</li>\n<li>Steel Wheels With Wheel Cover</li>\n<li>Projector Headlamps</li>\n<li>Chrome Accentuated Front Grille</li>\n</ul></div>
    </div>
  `;
  variantsContainer.appendChild(variantDiv);
  console.log('variantDiv added');
}
