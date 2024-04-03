//module donde exporto funciones js para hacer reqAjax al servicio REST-FULL montado sobre NODEJS

var clienteRESTservice = {
  RegistrarCliente: async function ({ nombre, apellidos, email, password, login, telefono }) {
    if (login === '') login = email;

    //#region --------- PETAJAX con XMLHTTPREQUEST-------------
    /*var _promiseResult = new Promise((resolve, reject) => {
      var petAjax = new XMLHttpRequest();
      petAjax.open('POST', 'http://localhost:3002/api/Cliente/Registro');
      petAjax.setRequestHeader('Content-Type', 'application/json');
    
      if (petAjax.status === 4) {
        console.log(petAjax);
    
        switch (petAjax.status) {
          case 200:
            var respuesta = JSON.parse(petAjax.responseText);
            resolve(respuesta);
            break;
          default:
            reject({ codigo: 1, mensaje: 'algo ha ido mal en pet.ajax al servicio de registrar cliente...' });
            break;
        }
      }
      petAjax.send(JSON.stringify({ nombre, apellidos, login, telefono, email, password }));
    });
    return _promiseResult;*/
    //#endregion


    //#region --------- petAjax con FETCH-API
    try {
      var _petAjax = await fetch('http://localhost:3003/api/Cliente/Registro',
        {
          method: 'POST',
          body: JSON.stringify({ nombre, apellidos, email, password, login, telefono }),
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return await _petAjax.json();

    } catch (error) {
      return { codigo: 1, mensaje: 'algo ha ido mal en pet.ajax al servicio de registrar cliente...' };
    }

    //#endregion

  },
  LoginCliente: async function (datoslogin) {
    try {
      var _petAjax = await fetch('http://localhost:3003/api/Cliente/Login',
        {
          method: 'POST',
          body: JSON.stringify(datoslogin),
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return await _petAjax.json();
    } catch (error) {
      return { codigo: 1, mensaje: 'Hubo un error al procesar la solicitud de inicio de sesión del cliente.' };
    }

  },
  UploadProfileImage: async function (formData){
    try {
      var _petAjax = await fetch('http://localhost:3003/api/Cliente/UploadProfileImage',
        {
          method: 'POST',
          body: formData,
          headers: {'Content-Type': 'multipart/form-data;boundary=--------------d123456789e'},
        }
      );
      if (!_petAjax.ok) {
        throw new Error('Error en la subida de la imagen');
      }
      return await _petAjax.json();

    } catch (error) {
      return { codigo: 1, mensaje: 'Hubo un error en la subida de imagen.' };
    }
  },
  ModifyAccountData: async function (datoscliente, jwt){
    try {

      var _petAjax = await fetch('http://localhost:3003/api/Cliente/ModifyData',
        {
          method: 'POST',
          body: JSON.stringify(datoscliente),
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          }
        }
      );
      return await _petAjax.json();
      
    } catch (error) {
      return { codigo: 1, mensaje: 'Hubo un error al intentar modificar los datos de cuenta.' };
    }
  },
  RetrieveOrders: async function (datoscuenta, jwt){
    try {

      var _petAjax = await fetch('http://localhost:3003/api/Cliente/Pedidos',
        {
          method: 'POST',
          body: JSON.stringify(datoscuenta),
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          }
        }
      );
      return await _petAjax.json();
      
    } catch (error) {
      return { codigo: 1, mensaje: 'Hubo un error al intentar recuperar los pedidos.' };
    }
  },
  AddComment: async function(comentario, email, jwt){
    try {
      var _petAjax = await fetch('http://localhost:3003/api/Cliente/valorar',
        {
          method: 'POST',
          body: JSON.stringify({comentario, email}),
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          }
        }
      );
      return await _petAjax.json();
    } catch (error) {
      return { codigo: 1, mensaje: 'Hubo un error al registrar la valoracion.' };
    }
  }
}

export default clienteRESTservice;