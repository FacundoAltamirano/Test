import { Button, Stack } from '@mui/material';
import BaseModal from '../../../components/BaseModal/BaseModal';
import CreateAdSpace from './CreateAdSpace';

const EditPopupModal = ({ open, onClose, onEdit, loading = false, data, setData }) => {
	return (
		<BaseModal
			open={open}
			onClose={onClose}
			title='Editar Pop Up'
			size='md'
			sx={{ bgcolor: '#FAFAFA', maxHeight: '85vh' }}
			contentMaxHeight='65vh'
			showActions={false}
			renderFooter={() => (
				<Stack direction='row' justifyContent='flex-end' spacing={2} pt={2}>
					<Button variant='outlined' onClick={onClose} disabled={loading}>
						Cancelar
					</Button>
					<Button variant='contained' onClick={onEdit} disabled={loading}>
						{loading ? 'Guardando...' : 'Guardar cambios'}
					</Button>
				</Stack>
			)}
		>
			<CreateAdSpace key={data?.id} data={data} setData={setData} />
		</BaseModal>
	);
};

export default EditPopupModal;
