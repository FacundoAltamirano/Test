import axiosInstance from '../../api/axiosInstance';
import { parseListResponse } from './popupsHelpers';

export const searchPopupsService = async (country, filters = {}, email) => {
	try {
		const isPdvSearch = !!filters.idpdv;
		const url = isPdvSearch
			? '/tokinheadless/banners/popups-by-pdv'
			: '/tokinheadless/banners/getPopups';
		const body = isPdvSearch
			? { country, email, idPdv: Number(filters.idpdv) }
			: {
					country,
					...(filters.status &&
						filters.status !== 'all' && { status: filters.status.toLowerCase() }),
					name: filters.name ?? '',
				};

		const response = await axiosInstance({
			method: 'POST',
			url,
			data: body,
			headers: { email },
		});

		return parseListResponse(response.data);
	} catch (error) {
		console.error('Error searching popups:', error);
		throw new Error('Ocurrió un error al buscar popups.');
	}
};
