export default async function decorate(block) {
  block.classList.add('variant-details');

  const response = await fetch('/graphql/execute.json/eds-nitesh-demo/carVariantList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const carVariantList = await response.json();

  carVariantList.data.carVariantList.items.forEach((variant) => {
    const variantDiv = document.createElement('div');
    variantDiv.classList.add('variant-card');

    const imagePath = Object.values(variant.variantImage)[0];      variantDiv.innerHTML = `

    variantDiv.innerHTML = `
      <div class="card-top">
        <img src='${imagePath}' alt='${variant.variantTitle}' class='variant-img' />
        <div class='variant-share-section'>
          <p class='variant-share-text'>Share</p>
          <div class='top-selling-container ${variant.topSelling}'>
            <p class='top-selling-text'>Top Selling</p>
          </div>
        </div>
      </div>
      <div class='variant-desc'>
        <p class='variant-title'>${variant.variantTitle}</p>
        <div class="variant-price-section">
          <p class='variant-price'>${variant.variantPrice}</p>
          <p class='variant-price-text'>${variant.variantPriceLocation}</p>
        </div>
        <p class="variant-feature">Features</p>
        ${variant.variantFeatures.html}
      </div>
    `;

    block.appendChild(variantDiv);
  });
}
