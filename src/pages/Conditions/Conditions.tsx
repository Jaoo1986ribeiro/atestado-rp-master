import React, { useEffect, useState } from 'react';
import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Controller, useFormContext, FieldError } from 'react-hook-form';
import { isInfant } from '../../utils/handleAge';

interface Props {
  value: number;
  index: number;
}

interface ConditionField {
  type?: string;
  value?: string;
  message?: string;
}

interface ConditionsFields {
  [key: string]: ConditionField;
}

interface FormValues {
  conditions: ConditionsFields;
  identification: {
    typeOfDeath: string;
    dateOfBirth: Date | null;
    dateOfDeath: Date | null;
  };
}

const getErrorMessage = (error: FieldError | undefined): string => {
  return error?.message || '';
};

const Conditions: React.FC<Props> = ({ value, index }) => {
  const [infantDisabled, setInfantDisabled] = useState(false);
  const { register, control, watch, formState: { errors } } = useFormContext<FormValues>();
  const typeOfDeath = watch('identification.typeOfDeath');
  const birth = watch('identification.dateOfBirth');
  const death = watch('identification.dateOfDeath');
  const conditionErrors = errors.conditions || {};
  useEffect(() => {
    if ((typeOfDeath && typeOfDeath === 'Fetal') || (birth && death && isInfant(birth.toString(), death.toString()))) {
      setInfantDisabled(true);
    }
  }, [typeOfDeath, birth, death]);

  const renderCauseFields = (withLabel: boolean = true) => {
    const startingIndex = withLabel ? 2 : 4;
    const endingIndex = withLabel ? 3 : 5;
    const fields = [];
    for (let i = startingIndex; i <= endingIndex; i++) {
      fields.push(
        <Grid item xs={7} key={`${i}_cause_${withLabel ? 'primary' : 'secondary'}`}>
          <TextField
            fullWidth
            aria-label={withLabel ? `Causa associada ${i}` : ''}
            label={withLabel ? `Devido ou como consequência de:` : ''}
            InputLabelProps={{ shrink: true }}
            {...register(`conditions.cause${i}` as const, { 
              required: !infantDisabled ? "Este campo é obrigatório" : false 
            })}
            error={!!conditionErrors[`cause${i}`]}
            helperText={getErrorMessage(conditionErrors[`cause${i}`] as FieldError)}
          />
        </Grid>,
        <Grid item xs={2} key={`${i}_time_${withLabel ? 'primary' : 'secondary'}`}>
          <Controller
            name={`conditions.evolutionTime${i}` as const}
            control={control}
            rules={{ required: !infantDisabled ? "Tempo de evolução é obrigatório" : false }}
            render={({ field }) => (
              <TimePicker
                label="Tempo de evolução"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputLabelProps: { shrink: true },
                    error: !!conditionErrors[`evolutionTime${i}`],
                    helperText: getErrorMessage(conditionErrors[`evolutionTime${i}`] as FieldError),
                  },
                }}
              />
            )}
          />
        </Grid>,
        <Grid item xs={3} key={`${i}_cid_${withLabel ? 'primary' : 'secondary'}`}>
          <TextField
            fullWidth
            label="CID"
            InputLabelProps={{ shrink: true }}
            {...register(`conditions.cid${i}` as const, { 
              required: !infantDisabled ? "CID é obrigatório" : false 
            })}
            error={!!conditionErrors[`cid${i}`]}
            helperText={getErrorMessage(conditionErrors[`cid${i}`] as FieldError)}
          />
        </Grid>
      );
    }
    return fields;
  };

  return (
    <div role="tabpanel" hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Controller
            name="conditions.fertileAgeDeath"
            control={control}
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!conditionErrors.fertileAgeDeath}>
                <InputLabel id="fertile-age-death-label">
                  A morte ocorreu durante gravidez, parto ou aborto?
                </InputLabel>
                <Select
                  {...field}
                  labelId="fertile-age-death-label"
                  label="A morte ocorreu durante gravidez, parto ou aborto?"
                >
                  <MenuItem value="Sim">Sim</MenuItem>
                  <MenuItem value="Não">Não</MenuItem>
                  <MenuItem value="Não se aplica">Não se aplica</MenuItem>
                </Select>
                {conditionErrors.fertileAgeDeath && (
                  <FormHelperText>{getErrorMessage(conditionErrors.fertileAgeDeath as FieldError)}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="conditions.necropsy"
            control={control}
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!conditionErrors.necropsy}>
                <InputLabel id="necropsy-label">
                  Necropsia?
                </InputLabel>
                <Select
                  {...field}
                  labelId="necropsy-label"
                  label="Necropsia?"
                >
                  <MenuItem value="Sim">Sim</MenuItem>
                  <MenuItem value="Não">Não</MenuItem>
                  <MenuItem value="Não se aplica">Não se aplica</MenuItem>
                </Select>
                {conditionErrors.necropsy && (
                  <FormHelperText>{getErrorMessage(conditionErrors.necropsy as FieldError)}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <h2 className="mb-1 font-semibold">Causas da morte</h2>
          <p className="text-sm mb-2">
            Doença ou estado mórbido que causou diretamente a morte:
          </p>
        </Grid>
        <Grid item xs={7}>
          <TextField
            fullWidth
            label="Causa básica"
            InputLabelProps={{ shrink: true }}
            {...register('conditions.cause1', { required: "Causa básica é obrigatória" })}
            error={!!conditionErrors.cause1}
            helperText={getErrorMessage(conditionErrors.cause1 as FieldError)}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name="conditions.evolutionTime1"
            control={control}
            rules={{ required: "Tempo de evolução é obrigatório" }}
            render={({ field }) => (
              <TimePicker
                label="Tempo de evolução"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputLabelProps: { shrink: true },
                    error: !!conditionErrors.evolutionTime1,
                    helperText: getErrorMessage(conditionErrors.evolutionTime1 as FieldError),
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="CID"
            InputLabelProps={{ shrink: true }}
            {...register('conditions.cid1', { required: "CID é obrigatório" })}
            error={!!conditionErrors.cid1}
            helperText={getErrorMessage(conditionErrors.cid1 as FieldError)}
          />
        </Grid>
        {renderCauseFields()}
        <Grid item xs={12}>
          <p className="text-sm mb-2">
            Outras condições significativas que contribuíram para a morte, e que
            não entraram, porém, na cadeia acima:
          </p>
        </Grid>
        {renderCauseFields(false)}
      </Grid>
    </div>
  );
};

export default Conditions;
