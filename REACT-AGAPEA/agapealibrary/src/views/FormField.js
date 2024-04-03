import { useState } from "react";


function FormField({id,label,name,placeholder,type,value,validators,onChangeInParent}){
   //variable state interna del componente q se mapea contra un <input...
   //controla errores de validacion...se cambiara en el evento onBlur del input
    const [errorField, setErrorField]=useState('');

    function HandlerOnBlurEvent(ev){
        let {name,value}=ev.target;

        if (name === 'login' && value.trim()==='') return;

        let _validField=true;        
  
        Object.keys(validators).forEach(
          (validator)=>{
                        switch (validator) {
                          case 'required':
                                _validField=value.trim() !== '';
                            break;
  
                          case 'pattern':
                                _validField=new RegExp(validators[validator][0]).test(value);
                            break;
  
                          case 'minlength':
                                _validField=value.length >= validators[validator][0];
                            break;
  
                          case 'maxlength':
                                _validField=value.length < validators[validator][0];
                            break;
  
                          case 'compareto':
                            let _campoacomparar=validators[validator][0];
                            _validField=value === document.getElementsByName(_campoacomparar)[0].value;
                            break;
                            
                          default:
                            break;
                        }
                        
                        if (! _validField) {  setErrorField(validators[validator][1]) } else { setErrorField('') }
          }
        );

    }

    function HandlerChangeEvent(ev){
      try {
        let { name, value } = ev.target;
        onChangeInParent(name, value);
      } catch (error) {
        console.error('Error en HandlerChangeEvent:', error);
      }
    }

    return (
      <div className="col-md-6">
            <label htmlFor={id} className="form-label">{label}:</label>                
            <input type={type} 
            className="form-control" 
            id={id} name={name} 
            placeholder={placeholder} 
            value={value} 
            onChange={HandlerChangeEvent} 
            onBlur={HandlerOnBlurEvent}></input>
            { errorField && <span className="text-danger">{errorField}</span>}
        </div>
    )

}

export default FormField;