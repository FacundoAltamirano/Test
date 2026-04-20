import { TextField } from '@mui/material';
import { inputStyle } from '../../../../../components/general/styles';

const GeneralInfoStep = ({ data, update }) => {
	return (
		<TextField
			fullWidth
			label='Nombre del pop up'
			value={data?.name ?? ''}
			onChange={(e) => update('name', e.target.value)}
			size='small'
			sx={inputStyle}
		/>
	);
};

export default GeneralInfoStep;
