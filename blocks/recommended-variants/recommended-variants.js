export default async function decorate(block) {
  block.classList.add('variant-details');

  try {
    const response = await fetch(`/graphql/execute.json/eds-nitesh-demo/carVariantList`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const carVariantList = await response.json();

    carVariantList.data.carVariantList.items.forEach(variant => {
      const variantDiv = document.createElement('div');
      variantDiv.classList.add('variant-card');

      variantDiv.innerHTML = `
        <div class="card-top">
          <img src='${variant.variantImage._path}' alt='${variant.variantTitle}' class='variant-img' />
          <div class='variant-share-section'>
            <p class='variant-share-text'>Share</p>
            <div class='top-selling-container'>
              <p class='top-selling-text ${variant.topSelling}'>Top Selling</p>
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
  } catch (error) {
    console.error("Error fetching car variants:", error);
  }
}
