import axiosInstance from '../../api/axiosInstance';
import { parseListResponse } from './popupsHelpers';

export const fetchPopupsByPdv = async (country, idPdv) => {
	try {
		const response = await axiosInstance({
			method: 'POST',
			url: '/tokinheadless/banners/popups-by-pdv',
			data: { country, idPdv: Number(idPdv) },
		});

		return parseListResponse(response.data);
	} catch (error) {
		console.error('Error fetching popups by pdv:', error);
		throw new Error('Ocurrió un error al buscar popups por PDV.');
	}
};
