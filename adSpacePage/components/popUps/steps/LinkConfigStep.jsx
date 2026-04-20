import { useState, useRef } from 'react';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';

import { inputStyle } from '../../../../../components/general/styles';
import DestinationSelector from '../../DestinationSelector';
import { ItemsSelector } from '../../../../../components/promotions/ItemsSelector';

const locationOptions = [
	{ value: 'home', label: 'Home' },
	{ value: 'promotions', label: 'Promoción' },
	{ value: 'search', label: 'Página de resultados de búsqueda' },
	{ value: 'categories', label: 'Categorías' },
];

const LinkConfigStep = ({
	data,
	update,
	setData,
	collectionOptions,
	categoryOptions,
	brandOptions,
	promotionOptions,
}) => {
	const [destinationType, setDestinationType] = useState('external');
	const [locations, setLocations] = useState(
		(data?.locations ?? [])
			.map((l) => locationOptions.find((o) => o.value === l))
			.filter(Boolean),
	);

	const updateProductSegmentation = (key, values) => {
		console.log('updateProductSegmentation', key, values);
		setData((prev) => ({
			...prev,
			productSegmentation: {
				...prev.productSegmentation,
				[key]: values,
			},
		}));
	};

	const destinationOptions = [
		{
			value: 'collection',
			label: 'Colección',
			renderSelector: () => (
				<ItemsSelector
					title='Colección'
					getOptions={() => Promise.resolve(collectionOptions)}
					data={{ values: data?.productSegmentation?.collections ?? [] }}
					setData={(v) => updateProductSegmentation('collections', v.values)}
				/>
			),
		},
		{
			value: 'category',
			label: 'Categoría',
			renderSelector: () => (
				<ItemsSelector
					title='Categoría'
					getOptions={() => Promise.resolve(categoryOptions)}
					data={{ values: data?.productSegmentation?.categories ?? [] }}
					setData={(v) => updateProductSegmentation('categories', v.values)}
				/>
			),
		},
		{
			value: 'external',
			label: 'URL externa',
			renderSelector: () => (
				<TextField
					fullWidth
					label='URL de destino del pop up'
					placeholder='https://...'
					value={data?.link ?? ''}
					onChange={(e) => update('link', e.target.value)}
					size='small'
					sx={{ ...inputStyle, mt: 1 }}
				/>
			),
		},
		{
			value: 'brand',
			label: 'Marcas',
			renderSelector: () => (
				<ItemsSelector
					title='Marcas'
					getOptions={() => Promise.resolve(brandOptions)}
					data={{ values: data?.productSegmentation?.brands ?? [] }}
					setData={(v) => updateProductSegmentation('brands', v.values)}
				/>
			),
		},
		{
			value: 'promotion',
			label: 'Promociones',
			renderSelector: () => (
				<ItemsSelector
					title='Promociones'
					getOptions={() => Promise.resolve(promotionOptions)}
					data={{ values: data?.productSegmentation?.promotions ?? [] }}
					setData={(v) => updateProductSegmentation('promotions', v.values)}
				/>
			),
		},
	];

	return (
		<Stack spacing={2}>
			<Typography fontWeight={600} fontSize={14} mb={1}>
				Sección donde se visualizará el pop up
			</Typography>
			<Autocomplete
				multiple
				size='small'
				disablePortal
				options={locationOptions}
				value={locations}
				onChange={(_, v) => {
					setLocations(v);
					update(
						'locations',
						v.map((l) => l.value),
					);
				}}
				isOptionEqualToValue={(o, v) => o?.value === v?.value}
				getOptionLabel={(o) => o?.label || ''}
				renderInput={(params) => (
					<TextField
						{...params}
						label='URL donde se visualizará el pop up'
						sx={inputStyle}
					/>
				)}
				sx={inputStyle}
			/>
			<DestinationSelector
				label='Destino del Pop Up'
				options={destinationOptions}
				value={destinationType}
				onChange={(newType) => {
					setDestinationType(newType);
					update('link', '');
					update('productSegmentation', {
						collections: [],
						categories: [],
						brands: [],
						products: [],
						skus: [],
						promotions: [],
					});
				}}
			/>
		</Stack>
	);
};

export default LinkConfigStep;
