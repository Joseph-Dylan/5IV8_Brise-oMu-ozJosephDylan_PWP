function createNewItem(event) {
    event.preventDefault();

    const name = document.getElementById('newItemName').value;
    const price = parseFloat(document.getElementById('newItemPrice').value);
    const stock = parseInt(document.getElementById('newItemStock').value, 10);
    const categoryId = document.getElementById('newItemCategoryId');

    let id = categoryId+1;

    const newItem = {
        name: name,
        price: price,
        stock: stock
    };
    fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Product created:', data);
    })
    .catch(error => console.error('Error:', error));
}
