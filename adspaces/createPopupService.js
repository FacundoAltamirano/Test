import axiosInstance from '../../api/axiosInstance';
import { buildPopupBody } from './popupsHelpers';

export const createPopupService = async (popupData, country, email) => {
	try {
		const body = buildPopupBody(popupData, country);
		console.log('body enviado:', JSON.stringify(body, null, 2));
		const response = await axiosInstance({
			method: 'POST',
			url: '/tokinheadless/banners/popups',
			data: body,
			headers: { email },
		});

		return response.data;
	} catch (error) {
		console.error('Error creating popup:', error);
		throw new Error('Ocurrió un error al crear el popup.');
	}
};
