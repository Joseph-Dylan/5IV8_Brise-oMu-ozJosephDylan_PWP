const mirrow = (req, res) => {
    const methods  = [{
        method: 'POST',
        hasBody: true,
        purprose: "El metodo POST se utiliza para enviar una entidad para enviar un recurso especifico causando un cambio en el estado o efectos secundarios del servidor."
    },{
        method: 'PUT',
        hasBody: true,
        purprose: "El metodo PUT remplaza todas las representaciones actuales del recurso de destino con carga util de la peitición."
    },{
        method: 'PATCH',
        hasBody: true,
        purprose: "El metodo PATCH es utilizado para aplicar modificaciones parciales a un recurso."
    },{
        method: 'HEAD',
        hasBody: false,
        purprose: "El metodo HEAD pide una respuesta idéntica a la de una petición GET, pero sin el cuerpo de la respuesta."
    },{
        method: 'GET',
        hasBody: false,
        purprose: "El metodo GET solicita una representación de un recurso especifico. Las peticiones que usan el metodo GET solo deben recuperar datos."
    },{
        method: 'DELETE',
        hasBody: false,
        purprose: "El metodo DELETE elimina el recurso especificado."
    }];
    
    const requestMethod = methods.find(
        m => m.method === req.method) || {
            method: req.method,
            hasBody: false,
            purprose: "No tiene body, no hay una respuesta, metodo no soportado"
        };
        requestMethod.purprose+= requestMethod.hasBody ? "Tiene cuerpo" : "No tiene cuerpo";
        if(requestMethod.hasBody){
            req.body; //JS debe de parsear mediante un json el objeto necesario
            res.json({...req.body, ruta_consumida: req.route.path, ...requestMethod});
        } else{
            res.json({ruta_consumida: req.originalUrl, ...requestMethod});
        }
};

module.exports = mirrow;