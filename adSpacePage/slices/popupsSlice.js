import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	fetchPopupsAdmin,
	searchPopupsService,
	createPopupService,
	updatePopupService,
	deletePopupService,
} from '../../../services/adspaces/popupsService';

export const fetchInitialPopups = createAsyncThunk(
	'popups/fetchInitial',
	async ({ country }, { rejectWithValue }) => {
		try {
			const { data, pagination } = await fetchPopupsAdmin(country);
			return { data, pagination };
		} catch (error) {
			return rejectWithValue('Error al cargar los popups');
		}
	},
);

export const searchPopups = createAsyncThunk(
	'popups/search',
	async ({ country, filters }, { rejectWithValue, getState }) => {
		try {
			const { userLogged } = getState().user;
			const { data, pagination } = await searchPopupsService(
				country,
				filters,
				userLogged.email,
			);
			return { data, pagination };
		} catch (error) {
			return rejectWithValue('Error al buscar popups');
		}
	},
);

export const createPopup = createAsyncThunk(
	'popups/create',
	async ({ popupData }, { rejectWithValue, getState }) => {
		try {
			const { selectedCountry } = getState().global;
			const { filters } = getState().popups;
			const { userLogged } = getState().user;

			await createPopupService(popupData, selectedCountry, userLogged.email);

			const { data, pagination } = await fetchPopupsAdmin(
				selectedCountry.toLowerCase(),
				filters,
			);
			return { data, pagination };
		} catch (error) {
			return rejectWithValue(error.message || 'Error al crear el popup');
		}
	},
);

export const updatePopup = createAsyncThunk(
	'popups/update',
	async ({ id, popupData }, { rejectWithValue, getState }) => {
		try {
			const { selectedCountry } = getState().global;
			const { filters } = getState().popups;
			const { userLogged } = getState().user;

			await updatePopupService(id, popupData, selectedCountry, userLogged.email);

			const { data, pagination } = await fetchPopupsAdmin(
				selectedCountry.toLowerCase(),
				filters,
			);
			return { data, pagination };
		} catch (error) {
			return rejectWithValue(error.message || 'Error al editar el popup');
		}
	},
);

export const deletePopup = createAsyncThunk(
	'popups/delete',
	async ({ id }, { rejectWithValue, getState }) => {
		try {
			const { selectedCountry } = getState().global;
			const { filters } = getState().popups;
			const { userLogged } = getState().user;

			await deletePopupService(id, userLogged.email);

			const { data, pagination } = await fetchPopupsAdmin(
				selectedCountry.toLowerCase(),
				filters,
			);
			return { data, pagination };
		} catch (error) {
			return rejectWithValue(error.message || 'Error al eliminar el popup');
		}
	},
);

export const popupsSlice = createSlice({
	name: 'popups',
	initialState: {
		popups: [],
		pagination: {
			pageNumber: 1,
			pageSize: 10,
			totalElements: 0,
			totalPages: 0,
		},
		filters: {},
		loadingPage: true,
		loadingTable: false,
		loadingForm: false,
		error: null,
	},
	reducers: {
		setFilters: (state, action) => {
			state.filters = action.payload;
			state.pagination.pageNumber = 1;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchInitialPopups.pending, (state) => {
				state.loadingPage = true;
				state.error = null;
			})
			.addCase(fetchInitialPopups.fulfilled, (state, action) => {
				state.loadingPage = false;
				state.popups = action.payload.data;
				state.pagination = action.payload.pagination;
			})
			.addCase(fetchInitialPopups.rejected, (state, action) => {
				state.loadingPage = false;
				state.error = action.payload;
			})

			.addCase(searchPopups.pending, (state) => {
				state.loadingTable = true;
				state.error = null;
			})
			.addCase(searchPopups.fulfilled, (state, action) => {
				state.loadingTable = false;
				state.popups = action.payload.data;
				state.pagination = action.payload.pagination;
			})
			.addCase(searchPopups.rejected, (state, action) => {
				state.loadingTable = false;
				state.error = action.payload;
			})

			.addCase(createPopup.pending, (state) => {
				state.loadingForm = true;
				state.error = null;
			})
			.addCase(createPopup.fulfilled, (state, action) => {
				state.loadingForm = false;
				state.popups = action.payload.data;
				state.pagination = action.payload.pagination;
			})
			.addCase(createPopup.rejected, (state, action) => {
				state.loadingForm = false;
				state.error = action.payload;
			})

			.addCase(updatePopup.pending, (state) => {
				state.loadingForm = true;
				state.error = null;
			})
			.addCase(updatePopup.fulfilled, (state, action) => {
				state.loadingForm = false;
				state.popups = action.payload.data;
				state.pagination = action.payload.pagination;
			})
			.addCase(updatePopup.rejected, (state, action) => {
				state.loadingForm = false;
				state.error = action.payload;
			})

			.addCase(deletePopup.pending, (state) => {
				state.loadingForm = true;
				state.error = null;
			})
			.addCase(deletePopup.fulfilled, (state, action) => {
				state.loadingForm = false;
				state.popups = action.payload.data;
				state.pagination = action.payload.pagination;
			})
			.addCase(deletePopup.rejected, (state, action) => {
				state.loadingForm = false;
				state.error = action.payload;
			});
	},
});

export const { setFilters } = popupsSlice.actions;
export default popupsSlice.reducer;
