import {
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from '@mui/material';
import { Controller, useFormContext, FieldError } from 'react-hook-form';

type Props = {
  index: number;
  value: number;
};

// Defina uma interface para os erros do médico
interface DoctorErrors {
  name?: FieldError;
  crm?: FieldError;
  confirmedBy?: FieldError;
  city?: FieldError;
  contact?: FieldError;
  confirmationDate?: FieldError;
}

const Doctor = ({ value, index, ...other }: Props) => {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const confirmedBy = watch('doctor.confirmedBy');

  // Faça um cast do errors.doctor para o tipo DoctorErrors
  const doctorErrors = errors.doctor as DoctorErrors;

  console.log('Doctor Errors:', doctorErrors);

  const validateCRM = (value: string) => {
    if (!value) {
      return 'CRM é obrigatório';
    }
    const crmRegex = /^CRM\/[A-Z]{2}\s\d{4,6}$/;
    return crmRegex.test(value) || 'Formato de CRM inválido. Exemplo correto: CRM/SP 123456';
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
        <Grid2 size={8}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Nome do médico"
            {...register(`doctor.name`, { required: 'Nome do médico é obrigatório' })}
            error={!!doctorErrors?.name}
            helperText={doctorErrors?.name?.message}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="CRM"
            {...register(`doctor.crm`, { 
              required: 'CRM é obrigatório',
              validate: validateCRM
            })}
            error={!!doctorErrors?.crm}
            helperText={doctorErrors?.crm?.message}
          />
        </Grid2>
        <Grid2 size={2}>
          <FormControl fullWidth error={!!doctorErrors?.confirmedBy}>
            <InputLabel htmlFor="doctor.confirmedBy" shrink>
              Óbito atestado por médico
            </InputLabel>
            <Select
              label="Óbito atestado por médico"
              notched
              defaultValue={''}
              id="doctor.confirmedBy"
              {...register('doctor.confirmedBy', { required: 'Campo obrigatório' })}
            >
              <MenuItem value={'Assistente'}>Assistente</MenuItem>
              <MenuItem value={'Substituto'}>Substituto</MenuItem>
              <MenuItem value={'IML'}>IML</MenuItem>
              <MenuItem value={'SVO'}>SVO</MenuItem>
              <MenuItem value={'Outro'}>Outro</MenuItem>
            </Select>
            {doctorErrors?.confirmedBy && (
              <FormHelperText>{doctorErrors.confirmedBy.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={6}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Município e UF do SVO ou IML"
            disabled={confirmedBy !== 'IML' && confirmedBy !== 'SVO'}
            {...register(`doctor.city`, { 
              required: confirmedBy === 'IML' || confirmedBy === 'SVO' 
                ? 'Município e UF são obrigatórios' 
                : false 
            })}
            error={!!doctorErrors?.city}
            helperText={doctorErrors?.city?.message}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="Meio de comunicação (telefone, e-mail, etc)"
            {...register(`doctor.contact`, { required: 'Meio de comunicação é obrigatório' })}
            error={!!doctorErrors?.contact}
            helperText={doctorErrors?.contact?.message}
          />
        </Grid2>
        <Grid2 size={2}>
          <Controller
            render={({ field }) => (
              <TextField
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                label="Data de atestado"
                fullWidth
                {...field}
                error={!!doctorErrors?.confirmationDate}
                helperText={doctorErrors?.confirmationDate?.message}
              />
            )}
            name="doctor.confirmationDate"
            control={control}
            rules={{ required: 'Data de atestado é obrigatória' }}
          />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Doctor;
