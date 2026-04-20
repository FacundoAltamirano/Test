import { Button, Stack, Typography } from '@mui/material';
import BaseModal from '../../../components/BaseModal/BaseModal';
import CreateAdSpace from './CreateAdSpace';

const CreatePopupModal = ({ open, onClose, onCreate, loading = false, data, setData }) => {
	return (
		<BaseModal
			open={open}
			onClose={onClose}
			title='Nuevo Espacio Publicitario'
			size='md'
			sx={{ bgcolor: '#FAFAFA', maxHeight: '85vh' }}
			contentMaxHeight='65vh'
			showActions={false}
			renderFooter={() => (
				<Stack direction='row' justifyContent='flex-end' spacing={2} pt={2}>
					<Button variant='outlined' onClick={onClose} disabled={loading}>
						Cancelar
					</Button>
					<Button variant='contained' onClick={onCreate} disabled={loading}>
						{loading ? 'Creando...' : 'Guardar y Publicar'}
					</Button>
				</Stack>
			)}
		>
			<Typography fontSize={13} color='text.secondary' mb={2}>
				Configurá todos los parámetros del espacio publicitario.
			</Typography>
			<CreateAdSpace data={data} setData={setData} />
		</BaseModal>
	);
};

export default CreatePopupModal;
