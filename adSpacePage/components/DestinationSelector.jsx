import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	Stack,
} from '@mui/material';

const DestinationSelector = ({ label = 'Destino', options = [], value, onChange }) => {
	const currentOption = options.find((o) => o.value === value);

	return (
		<FormControl>
			<FormLabel sx={{ fontSize: 13, fontWeight: 600 }}>{label}</FormLabel>
			<RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
				<Grid container>
					{options.map((option) => (
						<Grid item xs={4} key={option.value}>
							<FormControlLabel
								value={option.value}
								control={<Radio />}
								label={option.label}
							/>
						</Grid>
					))}
				</Grid>
			</RadioGroup>
			{currentOption && (
				<Stack key={value} mt={1}>
					{currentOption.renderSelector()}
				</Stack>
			)}
		</FormControl>
	);
};

export default DestinationSelector;
