import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import CustomTitle from '../../components/CustomTitle/CustomTitle';
import SearchBar from '../../components/SearchBar/SearchBar';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomButton from '../../components/CustomButtons/CustomButton';
import CreatePopupModal from './components/CreatePopupModal';
import EditPopupModal from './components/EditPopupModal';
import Loading from '../../components/general/Loading';
import { inputStyle } from '../../components/general/styles';
import { ICONS } from '../../constants/icons';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { globalFormatDate } from '../../utils/functions';
import {
	fetchInitialPopups,
	setFilters,
	createPopup,
	updatePopup,
	searchPopups,
} from './slices/popupsSlice';
import { showSnackbar } from '../../store/slices/notifications/slice';
import { validatePopupData } from '../utils/validatePopupData';
import PopupStatusChip from './components/PopupsStatusChip';

const searchOptions = [
	{ value: 'name', label: 'Nombre' },
	{ value: 'idpdv', label: 'Idpdv' },
];

const filterStatusOptions = [
	{ value: 'status', status: 'all', label: 'Todos' },
	{ value: 'status', status: 'Activo', label: 'Activo' },
	{ value: 'status', status: 'Pausado', label: 'Pausado' },
	{ value: 'status', status: 'Programado', label: 'Programado' },
	{ value: 'status', status: 'Finalizado', label: 'Finalizado' },
];

const EMPTY_POPUP = {
	name: '',
	fromDate: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
	toDate: dayjs().add(1, 'month').format('YYYY-MM-DDTHH:mm:ssZ'),
	images: { desktop: '', mobile: '', alt: '' },
	content: { title: '', description: '', buttonText: '' },
	segmentation: {
		sellers: [],
		segment2: [],
		segment5: [],
		commercialAgreements: [],
		idpdvs: [],
	},
	productSegmentation: {
		collections: [],
		categories: [],
		brands: [],
		products: [],
		skus: [],
		promotions: [],
	},
	locations: [],
	link: '',
	showEvery: 24,
	maxView: 4,
};

const AdSpacesPage = () => {
	const dispatch = useDispatch();

	const { selectedCountry } = useSelector((state) => state.global);
	const { popups, pagination, loadingPage, loadingTable, loadingForm, filters } =
		useSelector((state) => state.popups);

	const [filterStatus, setFilterStatus] = useState(filterStatusOptions[0]);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [popupToCreate, setPopupToCreate] = useState(EMPTY_POPUP);
	const [popupToEdit, setPopupToEdit] = useState(null);

	const country = selectedCountry?.toLowerCase() ?? 'ar';

	useEffect(() => {
		dispatch(fetchInitialPopups({ country }));
	}, [dispatch, selectedCountry]);

	const columns = [
		{
			field: 'name',
			label: 'Nombre',
			render: (value, row) => (
				<Stack>
					<Typography sx={{ fontSize: 13, fontWeight: 600 }}>{value}</Typography>
					<Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
						ID: {row.id}
					</Typography>
				</Stack>
			),
		},
		{ field: 'type', label: 'Tipo', render: (value) => value ?? 'Pop Up' },
		{
			field: 'status',
			label: 'Estado',
			render: (value) => <PopupStatusChip status={value} />,
		},

		{
			field: 'startDate',
			label: 'Vigencia',
			render: (value, row) => (
				<Stack>
					<Typography sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
						Desde: {value ? dayjs(value).format('DD/MM/YY HH:mm') : '---'}
					</Typography>
					<Typography sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
						Hasta:{' '}
						{row.endDate ? dayjs(row.endDate).format('DD/MM/YY HH:mm') : '---'}
					</Typography>
				</Stack>
			),
		},

		{
			field: 'segmentation',
			label: 'Segmentación',
			render: (value) => {
				if (!value) return '---';
				return value.segment2?.join(', ') || '---';
			},
		},
	];

	const actions = [
		{
			icon: <ICONS.PENCIL />,
			handler: (row) => {
				setPopupToEdit({
					...row,
					showEvery: row.showEvery ?? 24,
					maxView: row.maxView ?? 4,
					locations: row.locations ?? [],
					segmentation: row.segmentation ?? {
						sellers: [],
						segment2: [],
						segment5: [],
						commercialAgreements: [],
						idpdvs: [],
					},
					productSegmentation: row.productSegmentation ?? {
						collections: [],
						categories: [],
						brands: [],
						products: [],
						skus: [],
						promotionId: [],
					},
				});
				setOpenEditModal(true);
			},
			color: 'blueDark',
		},
	];

	const dispatchFiltered = (newFilters) => {
		dispatch(setFilters(newFilters));
		dispatch(searchPopups({ country, filters: newFilters }));
	};

	const handleChangePage = ({ page }) => {
		dispatchFiltered({ ...filters, page });
	};

	const handleSwitchStatus = (newStatus) => {
		setFilterStatus(newStatus);
		dispatchFiltered({ ...filters, status: newStatus.status, page: 1 });
	};

	const handleSearch = (newFilters) => {
		let updatedFilters;

		if (newFilters.clearSearchOnly) {
			const { name, idpdv, ...nonSearchFilters } = filters;
			updatedFilters = nonSearchFilters;
		} else {
			const { name, idpdv, ...nonSearchFilters } = filters;
			updatedFilters = { ...nonSearchFilters, ...newFilters };
		}

		dispatch(setFilters(updatedFilters));
		dispatch(
			searchPopups({
				country,
				filters: { ...updatedFilters, status: filterStatus.status, page: 1 },
			}),
		);
	};

	const handleCreate = () => {
		const validation = validatePopupData(popupToCreate);
		if (!validation.valid) {
			dispatch(showSnackbar({ message: validation.message, type: 'warning' }));
			return;
		}
		dispatch(createPopup({ popupData: popupToCreate }))
			.unwrap()
			.then(() => {
				setOpenCreateModal(false);
				setPopupToCreate(EMPTY_POPUP);
				dispatch(
					showSnackbar({ message: 'Pop up creado exitosamente.', type: 'success' }),
				);
			})
			.catch((error) => {
				dispatch(
					showSnackbar({
						message: error || 'Error al crear el pop up.',
						type: 'error',
					}),
				);
			});
	};

	const handleEdit = () => {
		const validation = validatePopupData(popupToEdit);
		if (!validation.valid) {
			dispatch(showSnackbar({ message: validation.message, type: 'warning' }));
			return;
		}
		dispatch(updatePopup({ id: popupToEdit.id, popupData: popupToEdit }))
			.unwrap()
			.then(() => {
				setOpenEditModal(false);
				setPopupToEdit(null);
				dispatch(
					showSnackbar({
						message: 'Pop up actualizado exitosamente.',
						type: 'success',
					}),
				);
			})
			.catch((error) => {
				dispatch(
					showSnackbar({
						message: error || 'Error al actualizar el pop up.',
						type: 'error',
					}),
				);
			});
	};

	const handleOpenCreate = () => {
		setPopupToCreate(EMPTY_POPUP);
		setOpenCreateModal(true);
	};

	const handleCloseEdit = () => {
		setOpenEditModal(false);
		setPopupToEdit(null);
	};

	if (loadingPage) return <Loading />;

	return (
		<>
			<CustomTitle
				title='Espacios 
Publicitarios'
			/>

			<Stack
				gap={2}
				direction='row'
				justifyContent='space-between'
				sx={{ marginBottom: '20px', width: '100%' }}
			>
				<Stack direction='row' gap={2}>
					<SearchBar searchOptions={searchOptions} onSearch={handleSearch} />
					<Autocomplete
						size='small'
						disableClearable
						disablePortal
						options={filterStatusOptions}
						value={filterStatus}
						onChange={(_, newValue) => handleSwitchStatus(newValue)}
						getOptionLabel={(option) => option.label}
						isOptionEqualToValue={(option, value) =>
							option.status === value.status
						}
						renderInput={(params) => (
							<TextField {...params} label='Estado' sx={{ width: '250px' }} />
						)}
						sx={{ ...inputStyle }}
					/>
				</Stack>
				<CustomButton label='Crear Pop Up' handleEvent={handleOpenCreate} />
			</Stack>

			<CreatePopupModal
				open={openCreateModal}
				onClose={() => setOpenCreateModal(false)}
				onCreate={handleCreate}
				loading={loadingForm}
				data={popupToCreate}
				setData={setPopupToCreate}
			/>

			{popupToEdit && (
				<EditPopupModal
					open={openEditModal}
					onClose={handleCloseEdit}
					onEdit={handleEdit}
					loading={loadingForm}
					data={popupToEdit}
					setData={setPopupToEdit}
				/>
			)}

			<CustomTable
				columns={columns}
				data={popups}
				isLoading={loadingTable}
				actions={actions}
				pagination={pagination}
				tableStyle={{ height: '65vh' }}
				onChangePage={handleChangePage}
			/>
		</>
	);
};

export default AdSpacesPage;
