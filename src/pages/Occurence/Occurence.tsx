import React, { useEffect } from 'react';
import {
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { handleCep } from '../../services/viacep';

type Props = {
  index: number;
  value: number;
};

// Defina a interface para o seu formulário
interface FormValues {
  occurence: {
    placeType: string;
    cnes: string;
    establishmentName: string;
    hospitalAddress: {
      zipCode: string;
      street: string;
      neighborhood: string;
      city: string;
      state: string;
      number: string;
      complement: string;
    };
  };
}

const Ocorrencia: React.FC<Props> = ({ value, index, ...other }) => {
  const { register, control, setValue, formState: { errors } } = useFormContext<FormValues>();

  useEffect(() => {
    const fields = [
      'occurence.placeType',
      'occurence.cnes',
      'occurence.establishmentName',
      'occurence.hospitalAddress.zipCode',
      'occurence.hospitalAddress.street',
      'occurence.hospitalAddress.neighborhood',
      'occurence.hospitalAddress.city',
      'occurence.hospitalAddress.state',
      'occurence.hospitalAddress.number',
      'occurence.hospitalAddress.complement'
    ];
    fields.forEach((field) => {
      register(field as keyof FormValues, { required: 'Este campo é obrigatório' });
    });
  }, [register]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`secao-${index}`}
      aria-labelledby={`secao-${index}`}
      {...other}
      className="w-full p-8"
    >
      <Grid2 container spacing={2} width="100%">
        <Grid2 size={3}>
          <FormControl fullWidth error={!!errors.occurence?.placeType}>
            <InputLabel shrink>Local da ocorrência do óbito *</InputLabel>
            <Select
              label="Local da ocorrência do óbito *"
              defaultValue={''}
              notched
              {...register('occurence.placeType')}
            >
              <MenuItem value={'Hospital'}>Hospital</MenuItem>
              <MenuItem value={'Outro estabelecimento de saúde'}>
                Outro estabelecimentos de saúde
              </MenuItem>
              <MenuItem value={'Via pública'}>Via pública</MenuItem>
              <MenuItem value={'Domicílio'}>Domicílio</MenuItem>
              <MenuItem value={'Outros'}>Outros</MenuItem>
              <MenuItem value={'Não se aplica'}>Não se aplica</MenuItem>
            </Select>
            {errors.occurence?.placeType && (
              <span className="text-red-500 text-sm">
                {errors.occurence.placeType.message}
              </span>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={2}>
          <TextField
            label="Código CNES"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('occurence.cnes', { required: 'Este campo é obrigatório' })}
            fullWidth
            error={!!errors.occurence?.cnes}
            helperText={errors.occurence?.cnes?.message}
          />
        </Grid2>
        <Grid2 size={5}>
          <Controller
            render={({ field }) => (
              <TextField
                label="Nome do estabelecimento"
                slotProps={{ inputLabel: { shrink: true } }}
                {...field}
                fullWidth
                error={!!errors.occurence?.establishmentName}
                helperText={errors.occurence?.establishmentName?.message}
              />
            )}
            name="occurence.establishmentName"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            label="CEP"
            id="occurence.hospitalAddress.zipCode"
            {...register('occurence.hospitalAddress.zipCode', { 
              required: 'Este campo é obrigatório',
              pattern: {
                value: /^\d{8}$/,
                message: 'O CEP deve conter exatamente 8 dígitos'
              }
            })}
            onBlur={(e) =>
              handleCep(e.target.value, 'occurence.hospitalAddress', setValue)
            }
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.occurence?.hospitalAddress?.zipCode}
            helperText={errors.occurence?.hospitalAddress?.zipCode?.message}
            fullWidth
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label="Logradouro"
            {...register('occurence.hospitalAddress.street')}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid2>
        <Grid2 size={3}>
          <TextField
            label="Bairro"
            {...register('occurence.hospitalAddress.neighborhood')}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid2>
        <Grid2 size={3}>
          <TextField
            label="Município"
            {...register('occurence.hospitalAddress.city')}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid2>
        <Grid2 size={1}>
          <TextField
            label="UF"
            {...register('occurence.hospitalAddress.state')}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid2>
        <Grid2 size={1}>
          <TextField
            label="Número"
            {...register('occurence.hospitalAddress.number')}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            label="Complemento"
            {...register('occurence.hospitalAddress.complement')}
            id="hospitalAddress.complement"
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Ocorrencia;
