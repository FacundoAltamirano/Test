import axiosInstance from '../../api/axiosInstance';
import { parseListResponse } from './popupsHelpers';

export const fetchPopupsAdmin = async (country, filters = {}) => {
	try {
		const body = {
			country,
			...(filters.status &&
				filters.status !== 'all' && {
					status: filters.status.toLowerCase(),
				}),
			...(filters.name && { name: filters.name }),
		};

		const response = await axiosInstance({
			method: 'POST',
			url: '/tokinheadless/banners/getPopups',
			data: body,
		});

		return parseListResponse(response.data);
	} catch (error) {
		console.error('Error fetching popups admin:', error);
		throw new Error('Ocurrió un error al obtener los popups.');
	}
};
