import { Stack, TextField } from '@mui/material';
import { inputStyle } from '../../../../../components/general/styles';

const VisualizationStep = ({ data, update }) => {
	return (
		<Stack spacing={2}>
			<TextField
				fullWidth
				type='number'
				label='Frecuencia de visualización'
				value={data?.showEvery ?? 24}
				onChange={(e) => update('showEvery', Number(e.target.value))}
				size='small'
				sx={inputStyle}
				inputProps={{ min: 1 }}
				helperText='Expresado en horas'
			/>
			<TextField
				fullWidth
				type='number'
				label='Máximo de denegaciones/cierre'
				value={data?.maxView ?? 4}
				onChange={(e) => update('maxView', Number(e.target.value))}
				size='small'
				sx={inputStyle}
				inputProps={{ min: 1 }}
				helperText='Después de esto, el usuario no verá el pop up'
			/>
		</Stack>
	);
};

export default VisualizationStep;
