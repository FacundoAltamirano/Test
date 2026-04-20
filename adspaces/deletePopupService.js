import axiosInstance from '../../api/axiosInstance';

export const deletePopupService = async (id, email) => {
	try {
		const response = await axiosInstance({
			method: 'DELETE',
			url: `/tokinheadless/banners/popups/${id}`,
			headers: { email },
		});

		return response.data;
	} catch (error) {
		console.error('Error deleting popup:', error);
		throw new Error('Ocurrió un error al eliminar el popup.');
	}
};
