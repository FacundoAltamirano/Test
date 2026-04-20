import axiosInstance from '../../api/axiosInstance';
import { buildPopupBody } from './popupsHelpers';

export const updatePopupService = async (id, popupData, country, email) => {
	try {
		const body = buildPopupBody(popupData, country);

		const response = await axiosInstance({
			method: 'PUT',
			url: `/tokinheadless/banners/popups/${id}`,
			data: body,
			headers: { email },
		});

		return response.data;
	} catch (error) {
		console.error('Error updating popup:', error);
		throw new Error('Ocurrió un error al editar el popup.');
	}
};
