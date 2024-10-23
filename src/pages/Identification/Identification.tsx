import {
  Autocomplete,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { cbo } from '../../services/cbo';
import { handleCep } from '../../services/viacep';
import { handleAge } from '../../utils/handleAge';
import { disabledFields, educationClasses } from './utils';

type Props = {
  index: number;
  value: number;
};

const Identification = ({ value, index, ...other }: Props) => {
  const { register, watch, control, setValue, resetField } = useFormContext();
  const [cepError, setCepError] = useState('');
  const [susCardError, setSusCardError] = useState('');
  const watchTypeOfDeath = watch('identification.typeOfDeath');
  const watchDateOfDeath = watch('identification.dateOfDeath');
  const watchDateOfBirth = watch('identification.dateOfBirth');
  const watchEducation = watch('identification.education');

  useEffect(() => {
    if (watchTypeOfDeath === 'Fetal') {
      disabledFields.forEach((field) => {
        resetField(field);
      });
      if (watchDateOfDeath) {
        setValue('identification.dateOfBirth', watchDateOfDeath);
      }
    }
  }, [watchTypeOfDeath, watchDateOfDeath, setValue, resetField]);

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
        <Grid2 size={2}>
          <Controller
            render={({ field }) => (
              <FormControl fullWidth required>
                <InputLabel shrink>Tipo de óbito</InputLabel>
                <Select
                  label="Tipo de óbito *"
                  notched
                  {...field}
                  value={field.value || ''}
                >
                  <MenuItem value={'Fetal'}>Fetal</MenuItem>
                  <MenuItem value={'Não fetal'}>Não Fetal</MenuItem>
                </Select>
              </FormControl>
            )}
            name="identification.typeOfDeath"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
          />
        </Grid2>
        <Grid2 size={2}>
          <Controller
            name="identification.dateOfDeath"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field }) => (
              <DatePicker
                slotProps={{
                  textField: {
                    InputLabelProps: {
                      shrink: true,
                    },
                    fullWidth: true,
                    required: true,
                  },
                }}
                label="Data do óbito"
                value={field.value}
                onChange={(date) => field.onChange(date)}
              />
            )}
          />
        </Grid2>
        <Grid2 size={2}>
          <Controller
            render={({ field }) => (
              <TimePicker
                label="Hora do óbito"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    InputLabelProps: {
                      shrink: true,
                    },
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            )}
            name="identification.hourOfDeath"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label="Nome do falecido *"
            {...register('identification.deceasedName', { required: 'Campo obrigatório' })}
            fullWidth
            required
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label="Nome da mãe"
            {...register('identification.mothersName', { required: 'Campo obrigatório' })}
            fullWidth
            required
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label="Nome do pai"
            {...register('identification.fathersName', { required: 'Campo obrigatório' })}
            fullWidth
            required
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label="Naturalidade"
            {...register('identification.naturalness', { required: 'Campo obrigatório' })}
            fullWidth
            required
          />
        </Grid2>
        <Grid2 size={2}>
          <Controller
            render={({ field }) => (
              <DatePicker
                slotProps={{
                  textField: {
                    InputLabelProps: {
                      shrink: true,
                    },
                    fullWidth: true,
                    required: !watchTypeOfDeath || watchTypeOfDeath !== 'Fetal',
                  },
                }}
                label="Data de nascimento"
                value={watchTypeOfDeath === 'Fetal' ? watchDateOfDeath : null}
                onChange={(date) => field.onChange(date)}
                disabled={watchTypeOfDeath === 'Fetal'}
              />
            )}
            name="identification.dateOfBirth"
            control={control}
            rules={{ required: !watchTypeOfDeath || watchTypeOfDeath !== 'Fetal' ? 'Campo obrigatório' : false }}
          />
        </Grid2>
        <Grid2 size={2}>
          <Controller
            render={({ field }) => (
              <TextField
                label="Idade"
                slotProps={{
                  input: { readOnly: true },
                  inputLabel: { shrink: true },
                }}
                {...field}
                value={handleAge(watchDateOfBirth, watchDateOfDeath)}
                fullWidth
              />
            )}
            name="identification.age"
            control={control}
          />
        </Grid2>
        <Grid2 size={2}>
          <FormControl fullWidth required>
            <InputLabel shrink>Sexo</InputLabel>
            <Select
              label="Sexo"
              notched
              defaultValue={''}
              {...register('identification.sex', { required: 'Campo obrigatório' })}
            >
              <MenuItem value={'M'}>Masculino</MenuItem>
              <MenuItem value={'F'}>Feminino</MenuItem>
              <MenuItem value={'I'}>Não se aplica</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={2}>
          <FormControl fullWidth required>
            <InputLabel shrink>Raça</InputLabel>
            <Select
              label="Raça"
              defaultValue={''}
              notched
              {...register('identification.race', { required: 'Campo obrigatório' })}
            >
              <MenuItem value={'Branca'}>Branca</MenuItem>
              <MenuItem value={'Preta'}>Preta</MenuItem>
              <MenuItem value={'Amarela'}>Amarela</MenuItem>
              <MenuItem value={'Parda'}>Parda</MenuItem>
              <MenuItem value={'Indígena'}>Indígena</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={2}>
          <FormControl fullWidth>
            <InputLabel shrink>Estado civil</InputLabel>
            <Select
              label="Estado civil"
              defaultValue={''}
              notched
              disabled={watchTypeOfDeath === 'Fetal'}
              {...register('identification.maritalStatus')}
            >
              <MenuItem value={'Solteiro(a)'}>Solteiro(a)</MenuItem>
              <MenuItem value={'Casado(a)'}>Casado(a)</MenuItem>
              <MenuItem value={'Divorciado(a)'}>Divorciado(a)</MenuItem>
              <MenuItem value={'Viúvo(a)'}>Viúvo(a)</MenuItem>
              <MenuItem value={'Separado(a)'}>Separado(a)</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={2}>
          <Controller
            name="identification.susCard"
            control={control}
            rules={{
              validate: (value) => {
                if (!value) return true; // Permite campo vazio
                const numbers = value.replace(/\D/g, '');
                return numbers.length === 15 || 'O cartão do SUS deve ter 15 números';
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                slotProps={{ inputLabel: { shrink: true } }}
                label="Cartão do SUS"
                disabled={watchTypeOfDeath === 'Fetal'}
                fullWidth
                error={!!susCardError}
                helperText={susCardError}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  field.onChange(value);
                  if (value.length !== 15 && value.length !== 0) {
                    setSusCardError('O cartão do SUS deve ter 15 números');
                  } else {
                    setSusCardError('');
                  }
                }}
              />
            )}
          />
        </Grid2>
        <Grid2 size={2}>
          <Controller
            name="identification.education"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel htmlFor="education" shrink>
                  Escolaridade
                </InputLabel>
                <Select
                  label="Escolaridade"
                  notched
                  id="education"
                  disabled={watchTypeOfDeath === 'Fetal'}
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    resetField('identification.class', { defaultValue: '' });
                  }}
                >
                  <MenuItem value={'Sem escolaridade'}>
                    Sem escolaridade
                  </MenuItem>
                  <MenuItem value={'Fundamental I (1ª a 4ª série)'}>
                    Fundamental I (1ª a 4ª série)
                  </MenuItem>
                  <MenuItem value={'Fundamental II (5ª a 8ª série)'}>
                    Fundamental II (5ª a 8ª série)
                  </MenuItem>
                  <MenuItem value={'Médio (antigo 2º grau)'}>
                    Médio (antigo 2º grau)
                  </MenuItem>
                  <MenuItem value={'Superior incompleto'}>
                    Superior incompleto
                  </MenuItem>
                  <MenuItem value={'Superior completo'}>
                    Superior completo
                  </MenuItem>
                  <MenuItem value={'Não se aplica'}>Não se aplica</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid2>
        <Grid2 size={2}>
          <Controller
            name="identification.class"
            render={({ field }) =>
              watchEducation ? (
                <FormControl fullWidth>
                  <InputLabel shrink>Série</InputLabel>
                  <Select
                    defaultValue={''}
                    label="Série"
                    notched
                    disabled={
                      watchTypeOfDeath === 'Fetal' ||
                      educationClasses[watchEducation].length === 0
                    }
                    {...field}
                    onChange={(e) => {
                      console.log(e.target.value);
                      console.log(educationClasses[watchEducation]);
                      field.onChange(e.target.value);
                    }}
                  >
                    {educationClasses[watchEducation].map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  slotProps={{ inputLabel: { shrink: true } }}
                  label="Série"
                  fullWidth
                  disabled
                />
              )
            }
            control={control}
          />
        </Grid2>
        <Grid2 size={'grow'}>
          <Autocomplete
            disablePortal
            options={cbo}
            disabled={watchTypeOfDeath === 'Fetal'}
            getOptionKey={(option) => option.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ocupação"
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('identification.occupation')}
              />
            )}
          />
        </Grid2>
        <Grid2 size={12}>
          <p>Endereço do falecido</p>
        </Grid2>
        <Grid2 size={2}>
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                id="identification.deceasedAddress.cep"
                slotProps={{ inputLabel: { shrink: true } }}
                label="CEP"
                fullWidth
                onBlur={(e) => {
                  const cep = e.target.value.replace(/\D/g, '');
                  if (cep.length !== 8) {
                    setCepError('O CEP deve conter 8 dígitos');
                  } else {
                    setCepError('');
                    handleCep(
                      cep,
                      'identification.deceasedAddress',
                      setValue,
                    );
                  }
                }}
                required
                error={!!cepError}
                helperText={cepError}
              />
            )}
            name="identification.deceasedAddress.zipCode"
            control={control}
            rules={{
              required: 'Campo obrigatório',
              validate: (value) => {
                const cep = value.replace(/\D/g, '');
                return cep.length === 8 || 'O CEP deve conter 8 dígitos';
              }
            }}
          />
        </Grid2>
        <Grid2 size={8}>
          <Controller
            name="identification.deceasedAddress.street"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                slotProps={{ inputLabel: { shrink: true } }}
                label="Logradouro"
                fullWidth
              />
            )}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label="Número"
            {...register('identification.deathPlace.number')}
            fullWidth
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label="Bairro"
            {...register('identification.deceasedAddress.neighborhood')}
            fullWidth
          />
        </Grid2>
        <Grid2 size={5}>
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label="Cidade"
            {...register('identification.deceasedAddress.city')}
            fullWidth
          />
        </Grid2>
        <Grid2 size={1}>
          <Controller
            name="identification.deceasedAddress.state"
            control={control}
            rules={{
              required: 'Campo obrigatório',
              validate: (value) => {
                const validStates = [
                  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
                  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
                ];
                return validStates.includes(value.toUpperCase()) || 'UF inválida';
              }
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                slotProps={{ inputLabel: { shrink: true } }}
                label="UF"
                fullWidth
                error={!!error}
                helperText={error?.message || ''}
                inputProps={{ maxLength: 2 }}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            label="Complemento"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('identification.deceasedAddress.complement')}
            fullWidth
          />
        </Grid2>
      </Grid2>
    </div>
  );

}

export default Identification;
