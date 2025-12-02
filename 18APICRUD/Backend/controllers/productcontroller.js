import Producto from '../models/productmodel.js';

export const createProduct = (req, res) => {
    let categoryid = req.body.categoryid;
    if(!req.body.name || (!isNaN(parseInt(categoryid)) && categoryid === 0)){  
        res.status(400).send({message: 'El nombre del producto y la categoría son obligatorios'});
        return;
    }

    const newProduct = new Producto({
        categoryid: req.body.categoryid,
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
    });
    
    let id = req.body.id;
    console.log('ID recibido:', id);
    if(id && id != 0 && typeof id === 'number' ? true : false){
        Producto.id = id;
    }

    console.log('Nuevo producto a crear:', newProduct);

    Producto.create(newProduct, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || 'Ocurrió un error al crear el producto'
            });
            return;
        }
        res.send({message: `Product ${data.name} con id ${data.id} creado exitosamente & categoría id ${data.category.id} creada exitosamente`});
    });
};