import { Stack, Typography, Box, IconButton, Alert } from '@mui/material';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomButton from '../../../components/CustomButtons/CustomButton';
import UploadIcon from '@mui/icons-material/Upload';
import { ICONS } from '../../../constants/icons';
import { mapped } from '../../../utils/themeMUI';

const ACCEPTED_TYPES = {
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'image/webp': ['.webp'],
};

const DIMENSIONS = {
	desktop: { width: 1200, height: 675 },
	mobile: { width: 675, height: 1200 },
};

const resizeImage = (file, targetWidth, targetHeight) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const objectUrl = URL.createObjectURL(file);

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = targetWidth;
			canvas.height = targetHeight;

			const ctx = canvas.getContext('2d');

			const srcRatio = img.width / img.height;
			const dstRatio = targetWidth / targetHeight;

			let sx = 0,
				sy = 0,
				sw = img.width,
				sh = img.height;

			if (srcRatio > dstRatio) {
				sw = img.height * dstRatio;
				sx = (img.width - sw) / 2;
			} else {
				sh = img.width / dstRatio;
				sy = (img.height - sh) / 2;
			}

			ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
			URL.revokeObjectURL(objectUrl);

			const base64 = canvas.toDataURL('image/webp', 0.85).split(',')[1];
			resolve(base64);
		};

		img.onerror = reject;
		img.src = objectUrl;
	});
};

const UploadImageForm = ({ setBase64File, mode = 'desktop', initialPreview = null }) => {
	const [isDragActive, setIsDragActive] = useState(false);
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(initialPreview);
	const [error, setError] = useState(null);

	const { width, height } = DIMENSIONS[mode];

	const onDrop = useCallback(
		async (acceptedFiles) => {
			setError(null);

			if (acceptedFiles.length === 0) {
				setError('No se seleccionó ningún archivo.');
				return;
			}

			const uploadedFile = acceptedFiles[0];

			const isImage = Object.keys(ACCEPTED_TYPES).includes(uploadedFile.type);
			if (!isImage) {
				setError('Formato no válido. Solo se permiten archivos .jpg, .png o .webp.');
				return;
			}

			try {
				const previewUrl = URL.createObjectURL(uploadedFile);
				const base64 = await resizeImage(uploadedFile, width, height);

				setFile(uploadedFile);
				setPreview(previewUrl);
				setBase64File(base64);
				setIsDragActive(false);
			} catch (err) {
				console.error('Error al procesar imagen:', err);
				setError('Error al procesar la imagen.');
			}
		},
		[setBase64File, width, height],
	);

	const {
		getRootProps,
		getInputProps,
		isDragActive: dropzoneActive,
	} = useDropzone({
		onDrop,
		accept: ACCEPTED_TYPES,
		onDragEnter: () => setIsDragActive(true),
		onDragLeave: () => setIsDragActive(false),
	});

	const removeFile = () => {
		if (preview && file) URL.revokeObjectURL(preview);
		setFile(null);
		setPreview(null);
		setBase64File(null);
		setError(null);
	};

	return (
		<Stack gap={2}>
			{!preview && (
				<Box {...getRootProps()} sx={{ width: '100%', cursor: 'pointer' }}>
					<input {...getInputProps()} />
					<Box
						sx={{
							border: '2px dashed gray',
							borderRadius: '27px',
							padding: '20px',
							textAlign: 'center',
							backgroundColor: dropzoneActive ? 'lightgray' : 'white',
						}}
					>
						{isDragActive ? (
							<Typography>¡Suelta la imagen aquí!</Typography>
						) : (
							<Stack alignItems='center' justifyContent='center' gap={1}>
								<CloudUploadIcon />
								<Typography>
									Arrastra el archivo .jpg, .png o .webp acá
								</Typography>
								<Typography variant='caption' color='text.secondary'>
									{`Resolución recomendada: ${width}x${height}px`}
								</Typography>
								<Typography>O</Typography>
								<CustomButton
									icon={<UploadIcon sx={{ color: mapped.text.invert }} />}
									label='Subir Archivo'
								/>
							</Stack>
						)}
					</Box>
				</Box>
			)}

			{error && (
				<Alert severity='error' sx={{ mt: 1 }}>
					{error}
				</Alert>
			)}

			{preview && (
				<Stack alignItems='center' gap={1}>
					<Box
						component='img'
						src={preview}
						alt={file?.name ?? 'imagen actual'}
						sx={{
							width: '100%',
							maxHeight: '150px',
							objectFit: 'contain',
							borderRadius: 2,
							border: '1px solid',
							borderColor: 'divider',
						}}
					/>
					<Stack direction='row' alignItems='center' gap={1}>
						<ICONS.CUSTOM.UPLOADED_FILE_ICON />
						<Typography variant='body2'>
							{file?.name ?? 'Imagen cargada'}
						</Typography>
						<IconButton
							onClick={removeFile}
							color='error'
							aria-label='Eliminar imagen'
						>
							<DeleteIcon />
						</IconButton>
					</Stack>
					{file && (
						<Typography variant='caption' color='text.secondary'>
							{`Procesada a ${width}x${height}px (${mode})`}
						</Typography>
					)}
				</Stack>
			)}
		</Stack>
	);
};

export default UploadImageForm;
