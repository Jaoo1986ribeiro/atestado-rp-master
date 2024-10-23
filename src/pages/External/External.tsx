import { useState } from 'react';
import {
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { handleCep } from '../../services/viacep';

type Props = {
  index: number;
  value: number;
};

const External = ({ value, index, ...other }: Props) => {
  const { register, watch, setValue } = useFormContext();
  const [cepError, setCepError] = useState<string | null>(null);

  const validateCep = (value: string) => {
    if (value && value.length !== 8) {
      setCepError('O CEP deve ter 8 dígitos');
      return false;
    }
    setCepError(null);
    return true;
  };

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
        <Grid2 size={12}>
          <p>Prováveis circunstâncias de morte não natural</p>
          <p className="text-sm mb-3">
            Informações de caráter estritamente epidemiológico
          </p>
        </Grid2>
        <Grid2 size={2}>
          <FormControl fullWidth required>
            <InputLabel htmlFor="nonNaturalType" shrink>
              Tipo não natural
            </InputLabel>
            <Select
              label="Tipo não natural *"
              notched
              id="nonNaturalType"
              defaultValue={''}
              {...register('external.nonNaturalType', { required: true })}
            >
              <MenuItem value={'Acidente'}>Acidente</MenuItem>
              <MenuItem value={'Suicídio'}>Suicídio</MenuItem>
              <MenuItem value={'Homicídio'}>Homicídio</MenuItem>
              <MenuItem value={'Outros'}>Outros</MenuItem>
              <MenuItem value={'Não se aplica'}>Não se aplica</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={2}>
          <FormControl fullWidth required>
            <InputLabel htmlFor="workplaceAccident" shrink>
              Acidente de trabalho? *
            </InputLabel>
            <Select
              label="Acidente de trabalho? *"
              defaultValue={''}
              notched
              id="workplaceAccident"
              {...register('external.workplaceAccident', { required: true })}
            >
              <MenuItem value={'Sim'}>Sim</MenuItem>
              <MenuItem value={'Não'}>Não</MenuItem>
              <MenuItem value={'Não se aplica'}>Não se aplica</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={3}>
          <FormControl fullWidth required>
            <InputLabel htmlFor="informationSource" shrink>
              Fonte da informação? *
            </InputLabel>
            <Select
              label="Fonte da informação? *"
              defaultValue={''}
              notched
              id="informationSource"
              {...register('external.informationSource', { required: true })}
            >
              <MenuItem value={'Ocorrência policial'}>
                Ocorrência policial
              </MenuItem>
              <MenuItem value={'Família'}>Família</MenuItem>
              <MenuItem value={'Não'}>Não</MenuItem>
              <MenuItem value={'Outra'}>Outra</MenuItem>
              <MenuItem value={'Indetermiando'}>Não se aplica</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={5}>
          <TextField
            slotProps={{ inputLabel: { shrink: true } }}
            label="Nº do boletim de ocorrência *"
            disabled={watch('external.informationSource') !== 'Ocorrência policial'}
            fullWidth
            required
            {...register(`external.occurrenceNumber`, { required: true })}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Descrição sumária do evento"
            {...register(`external.occurrenceDescription`)}
          />
        </Grid2>
        <Grid2 size={3}>
          <FormControl fullWidth required>
            <InputLabel htmlFor="occurencePlaceType" shrink>
              Tipo de local de ocorrência *
            </InputLabel>
            <Select
              label="Tipo de local de ocorrência *"
              defaultValue={''}
              notched
              id="occurencePlaceType"
              {...register('external.placeType', { required: true })}
            >
              <MenuItem value={'Via pública'}>Via pública</MenuItem>
              <MenuItem value={'Estabelecimento de residência'}>
                Endereço de residência
              </MenuItem>
              <MenuItem value={'Outro domicílio'}>Outro domicílio</MenuItem>
              <MenuItem value={'Estabelecimento comercial'}>
                Estabelecimento comercial
              </MenuItem>
              <MenuItem value={'Outros'}>Outros</MenuItem>
              <MenuItem value={'Não se aplica'}>Não se aplica</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={2}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="CEP"
            error={!!cepError}
            helperText={cepError}
            {...register(`external.occurenceAddress.cep`, {
              validate: validateCep
            })}
            onBlur={(e) => {
              if (validateCep(e.target.value)) {
                handleCep(e.target.value, 'external.occurenceAddress', setValue);
              }
            }}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Logradouro"
            {...register(`external.occurenceAddress.street`)}
          />
        </Grid2>
        <Grid2 size={3}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Bairro"
            {...register(`external.occurenceAddress.district`)}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Município"
            {...register(`external.occurenceAddress.city`)}
          />
        </Grid2>
        <Grid2 size={1}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="UF"
            {...register(`external.occurenceAddress.state`)}
          />
        </Grid2>
        <Grid2 size={1}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Número"
            {...register(`external.occurenceAddress.number`)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Complemento"
            {...register(`external.occurenceAddress.complement`)}
          />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default External;
