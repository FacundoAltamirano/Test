import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { modalScrollStyle } from '../../../../components/general/styles';

import {
	getSelectorCategories,
	getCollectionsSelector,
	getBrands,
	getPromotionsSelector,
} from '../../../../api-graphql/queries';

import { PromotionHeader } from '../../../../components/promotions/general/PromotionHeader';
import GeneralInfoStep from './steps/GeneralInfoStep';
import VigenciaStep from './steps/VigenciaStep';
import ContentStep from './steps/ContentStep';
import LinkConfigStep from './steps/LinkConfigStep';
import VisualizationStep from './steps/VisualizationStep';
import SegmentationStep from './steps/SegmentationStep';

const PopupForm = ({ data, setData }) => {
	const { selectedCountry } = useSelector((state) => state.global);

	const [collectionOptions, setCollectionOptions] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [brandOptions, setBrandOptions] = useState([]);
	const [promotionOptions, setPromotionOptions] = useState([]);

	useEffect(() => {
		getSelectorCategories({ country: selectedCountry, page: 0, pageSize: null })
			.then((data) => setCategoryOptions(data ?? []))
			.catch(console.error);

		getCollectionsSelector({ country: selectedCountry })
			.then((data) => setCollectionOptions(data ?? []))
			.catch(console.error);

		getBrands(selectedCountry)
			.then((data) => setBrandOptions(data ?? []))
			.catch(console.error);

		getPromotionsSelector(selectedCountry)
			.then((data) =>
				setPromotionOptions(
					(data ?? []).map((p) => ({
						id: p.promotionId,
						name: p.metadata?.name ?? p.promotionId,
					})),
				),
			)
			.catch(console.error);
	}, [selectedCountry]);

	const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

	return (
		<Stack sx={{ ...modalScrollStyle, pr: 2 }}>
			<PromotionHeader step='2' title='Información general'>
				<GeneralInfoStep data={data} update={update} />
			</PromotionHeader>

			<PromotionHeader step='3' title='Vigencia'>
				<VigenciaStep data={data} update={update} />
			</PromotionHeader>

			<PromotionHeader step='4' title='Contenido del Pop Up'>
				<ContentStep data={data} setData={setData} />
			</PromotionHeader>

			<PromotionHeader step='5' title='Configuración del enlace'>
				<LinkConfigStep
					data={data}
					update={update}
					setData={setData}
					collectionOptions={collectionOptions}
					categoryOptions={categoryOptions}
					brandOptions={brandOptions}
					promotionOptions={promotionOptions}
				/>
			</PromotionHeader>

			<PromotionHeader step='6' title='Configuración de Visualización'>
				<VisualizationStep data={data} update={update} />
			</PromotionHeader>

			<PromotionHeader step='7' title='Segmentación de Contenido'>
				<SegmentationStep data={data} update={update} />
			</PromotionHeader>
		</Stack>
	);
};

export default PopupForm;
