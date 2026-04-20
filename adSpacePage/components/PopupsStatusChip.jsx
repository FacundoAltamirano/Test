import { Chip } from '@mui/material';

const statusConfig = {
	activo: { color: 'success', label: 'Activo' },
	pausado: { color: 'warning', label: 'Pausado' },
	programado: { color: 'info', label: 'Programado' },
	finalizado: { color: 'secondary', label: 'Finalizado' },
};

const PopupStatusChip = ({ status, sx = {} }) => {
	const key = status?.toLowerCase();
	const config = statusConfig[key] ?? { color: 'default', label: status ?? 'Desconocido' };

	return (
		<Chip
			label={config.label}
			color={config.color}
			size='small'
			sx={{ ...sx, fontWeight: 'bold', borderRadius: 3 }}
		/>
	);
};

export default PopupStatusChip;
