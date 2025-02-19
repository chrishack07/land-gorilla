import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';

// Define un esquema de validación con Yup
const schema = Yup.object().shape({
  fields: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Este campo es obligatorio'),
      email: Yup.string()
        .email('Debe ser un correo electrónico válido')
        .required('Este campo es obligatorio'),
    })
  ).required('Debe haber al menos un campo'),
});

type FormData = {
  fields: { name: string; email: string }[]; // Este tipo debe coincidir con el esquema de Yup
};

const DynamicForm: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),  // Resolver de Yup
    defaultValues: {
      fields: [{ name: '', email: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields', // Esto se refiere al nombre del campo en el estado
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simula el envío de los datos a una API
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', data);
      console.log('Datos enviados:', response.data);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      {fields.map((item, index) => (
        <div key={item.id} className="field-group">
          <Controller
            name={`fields.${index}.name`} // Aquí se usa la notación correcta
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Nombre"
                className={`input-field ${errors.fields?.[index]?.name ? 'input-error' : ''}`}
              />
            )}
          />
          {errors.fields?.[index]?.name && (
            <span className="error-text">
              {errors.fields[index]?.name?.message}
            </span>
          )}

          <Controller
            name={`fields.${index}.email`} // También corregimos esto
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Correo electrónico"
                className={`input-field ${errors.fields?.[index]?.email ? 'input-error' : ''}`}
              />
            )}
          />
          {errors.fields?.[index]?.email && (
            <span className="error-text">
              {errors.fields[index]?.email?.message}
            </span>
          )}

          <button type="button" onClick={() => remove(index)} className="remove-button">
            Eliminar
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append({ name: '', email: '' })} className="add-button">
        Agregar campo
      </button>

      <button type="submit" className="submit-button">Enviar</button>
    </form>
  );
};

export default DynamicForm;
