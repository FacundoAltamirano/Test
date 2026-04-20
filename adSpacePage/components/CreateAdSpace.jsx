import { Autocomplete, Stack, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { inputStyle, modalScrollStyle } from '../../../components/general/styles';
import { PromotionHeader } from '../../../components/promotions/general/PromotionHeader';
import PopupForm from './popUps/PopupForm';

const adSpaceTypes = [{ title: 'Pop Up', value: 'popup' }];

const countries = [
	{ title: 'Argentina', value: 'ar' },
	{ title: 'Chile', value: 'cl' },
];

const CreateAdSpace = ({ data, setData }) => {
	const { selectedCountry } = useSelector((state) => state.global);
	const [adSpaceType, setAdSpaceType] = useState(adSpaceTypes[0]);

	return (
		<Stack sx={{ ...modalScrollStyle }}>
			<PromotionHeader step='1' title='Tipo de Espacio Publicitario'>
				<Stack direction='row' gap={2}>
					<Autocomplete
						size='small'
						disableClearable
						options={adSpaceTypes}
						value={adSpaceType}
						getOptionLabel={(o) => o.title}
						isOptionEqualToValue={(o, v) => o.value === v.value}
						onChange={(_, newValue) => setAdSpaceType(newValue)}
						sx={{ ...inputStyle, width: '60%' }}
						renderInput={(params) => (
							<TextField {...params} label='Tipo de Espacio Publicitario' />
						)}
					/>
					<TextField
						label='País'
						fullWidth
						value={
							countries.find(
								(c) =>
									c.value.toLowerCase() === selectedCountry?.toLowerCase(),
							)?.title ?? ''
						}
						size='small'
						InputProps={{ readOnly: true }}
						sx={inputStyle}
					/>
				</Stack>
			</PromotionHeader>

			{adSpaceType.value === 'popup' && <PopupForm data={data} setData={setData} />}
		</Stack>
	);
};

export default CreateAdSpace;
