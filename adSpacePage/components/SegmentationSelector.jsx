import { useEffect, useState } from 'react';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { inputStyle } from '../../../components/general/styles';
import { AsyncFilterSelector } from '../../../components/general/AsyncFilterSelector';
import {
	getCommercialAgreementsOptions,
	getSegmentsOptions,
	getSellersOptions,
} from '../../../api-rest/queries';
import { fetchPdvs } from '../../../services/coupons/fetchPdvs';

const SegmentationSelector = ({ data = {}, setData }) => {
	const { selectedCountry } = useSelector((state) => state.global);
	const [isLoading, setIsLoading] = useState(true);

	const [sellerOptions, setSellerOptions] = useState([]);
	const [segmentOptions, setSegmentOptions] = useState({
		SEG2: [],
		SEG3: [],
		SEG4: [],
		SEG5: [],
	});
	const [commercialAgreementsOptions, setCommercialAgreementsOptions] = useState([]);

	const seller = data.sellers?.[0] ? { id: data.sellers[0], name: data.sellers[0] } : null;
	const canal = data.segment2?.[0] ? { id: data.segment2[0], name: data.segment2[0] } : null;
	const subCanal = data.segment3?.[0]
		? { id: data.segment3[0], name: data.segment3[0] }
		: null;
	const subCanalAdicional = data.segment4?.[0]
		? { id: data.segment4[0], name: data.segment4[0] }
		: null;

	const categoria = data.segment5?.[0]
		? { id: data.segment5[0], name: data.segment5[0] }
		: null;
	const acuerdo = data.commercialAgreements?.[0]
		? { id: data.commercialAgreements[0], name: data.commercialAgreements[0] }
		: null;
	const idpdvs = (data.idpdvs ?? []).map((id) =>
		typeof id === 'object' ? id : { id, name: id },
	);

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				setIsLoading(true);
				const [sellersData, segmentsData, agreementsData] = await Promise.all([
					getSellersOptions(selectedCountry),
					getSegmentsOptions(selectedCountry),
					getCommercialAgreementsOptions(selectedCountry),
				]);
				setSellerOptions(sellersData);
				setSegmentOptions({
					SEG2: segmentsData.SEG2 ?? [],
					SEG3: segmentsData.SEG3 ?? [],
					SEG4: segmentsData.SEG4 ?? [],
					SEG5: segmentsData.SEG5 ?? [],
				});
				setCommercialAgreementsOptions(agreementsData);
			} catch (error) {
				console.error('Error al cargar opciones de segmentación:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchOptions();
	}, [selectedCountry]);

	const getIdpdvsOptions = async (filter) => {
		try {
			const { data: pdvData } = await fetchPdvs(
				{ country: selectedCountry, page: 1, size: 30 },
				{ pdvName: filter },
			);
			return pdvData?.map((item) => ({ id: item.idPdv, name: item.pdvName }));
		} catch (error) {
			console.error('Error al obtener IDPDVs:', error);
			return [];
		}
	};

	const update = (field, value) => {
		setData({ ...data, [field]: value });
	};

	if (isLoading) {
		return (
			<Typography variant='caption' color='text.secondary'>
				Cargando opciones...
			</Typography>
		);
	}

	return (
		<Stack spacing={2}>
			<Autocomplete
				size='small'
				disablePortal
				options={sellerOptions}
				value={seller}
				onChange={(_, v) => update('sellers', v ? [v.id] : [])}
				isOptionEqualToValue={(o, v) => o?.id === v?.id}
				getOptionLabel={(o) => o?.name || ''}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Seller'
						placeholder='Seleccionar seller'
						sx={inputStyle}
					/>
				)}
				sx={inputStyle}
			/>
			<Autocomplete
				size='small'
				disablePortal
				options={segmentOptions.SEG2}
				value={canal}
				onChange={(_, v) => update('segment2', v ? [v.id] : [])}
				isOptionEqualToValue={(o, v) => o?.id === v?.id}
				getOptionLabel={(o) => o?.name || ''}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Canal'
						placeholder='Seleccionar canal'
						sx={inputStyle}
					/>
				)}
				sx={inputStyle}
			/>
			<Autocomplete
				size='small'
				disablePortal
				options={segmentOptions.SEG3}
				value={subCanal}
				onChange={(_, v) => update('segment3', v ? [v.id] : [])}
				isOptionEqualToValue={(o, v) => o?.id === v?.id}
				getOptionLabel={(o) => o?.name || ''}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Sub Canal'
						placeholder='Seleccionar Sub Canal'
						sx={inputStyle}
					/>
				)}
				sx={inputStyle}
			/>
			<Autocomplete
				size='small'
				disablePortal
				options={segmentOptions.SEG4}
				value={subCanalAdicional}
				onChange={(_, v) => update('segment4', v ? [v.id] : [])}
				isOptionEqualToValue={(o, v) => o?.id === v?.id}
				getOptionLabel={(o) => o?.name || ''}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Sub Canal Adicional'
						placeholder='Seleccionar Canal Adicional'
						sx={inputStyle}
					/>
				)}
				sx={inputStyle}
			/>

			<Autocomplete
				size='small'
				disablePortal
				options={segmentOptions.SEG5}
				value={categoria}
				onChange={(_, v) => update('segment5', v ? [v.id] : [])}
				isOptionEqualToValue={(o, v) => o?.id === v?.id}
				getOptionLabel={(o) => o?.name || ''}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Categoría'
						placeholder='Seleccionar categoría'
						sx={inputStyle}
					/>
				)}
				sx={inputStyle}
			/>
			<Autocomplete
				size='small'
				disablePortal
				options={commercialAgreementsOptions}
				value={acuerdo}
				onChange={(_, v) => update('commercialAgreements', v ? [v.id] : [])}
				isOptionEqualToValue={(o, v) => o?.id === v?.id}
				getOptionLabel={(o) => o?.name || ''}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Acuerdo comercial'
						placeholder='Seleccionar acuerdo comercial'
						sx={inputStyle}
					/>
				)}
				sx={inputStyle}
			/>
			<AsyncFilterSelector
				label='ID del Punto de Venta (PDV)'
				fetchOptions={getIdpdvsOptions}
				data={idpdvs}
				setData={(v) => update('idpdvs', v)}
			/>
		</Stack>
	);
};

export default SegmentationSelector;
