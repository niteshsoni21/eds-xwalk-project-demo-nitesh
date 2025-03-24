export default function decorate(block) {
  const variantsContainer = block.querySelector(':scope > div > div');

  const carVariantList = {
      'items': [
          {
              'modelId': 'maruti-brezza-lxi-cng',
              'variantImage': {
                  '_path': '/content/dam/demo-auto/english/images/highlights/Highlight-01.webp'
              },
              'variantTitle': 'Maruti Brezza Lxi CNG',
              'variantPrice': '₹ 10,00,000',
              'variantPriceLocation': 'Ex-showroom, Punjab',
              'variantFeatures': {
                  'html': '<ul>\n<li>Safety First</li>\n<li>Lorem Ipsum Daller Sit</li>\n<li>Steel Wheels With Wheel Cover</li>\n<li>Projector Headlamps</li>\n<li>Chrome Accentuated Front Grille</li>\n</ul>'
              }
          }
      ]
  };

  carVariantList.items.forEach(variant => {
      const variantDiv = document.createElement('div');
      variantDiv.classList.add('car-variant');

      variantDiv.innerHTML = `
          <div class='variant'>
              <img src='${variant.variantImage._path}' alt='${variant.variantTitle}' class='variant-image' />
              <h2 class='variant-title'>${variant.variantTitle}</h2>
              <p class='variant-price'>${variant.variantPrice}</p>
              <p class='variant-location'>${variant.variantPriceLocation}</p>
              <div class='variant-features'>${variant.variantFeatures.html}</div>
          </div>
      `;

      variantsContainer.appendChild(variantDiv);
  });
}
