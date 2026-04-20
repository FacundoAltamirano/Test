import { useState } from 'react';
import { Stack, Switch, Tab, Tabs, TextField, Typography } from '@mui/material';
import UploadImageForm from './UploadImageForm';
import { inputStyle } from '../../../components/general/styles';
import CustomTabs from '../../../components/CustomTabs/customTabs';

const ImageSelector = ({ data = {}, setData, showTextBlock = false }) => {
	const [tab, setTab] = useState(0);
	const [includeTextBlock, setIncludeTextBlock] = useState(
		!!(data?.title || data?.description || data?.buttonText),
	);

	const [previewDesktop, setPreviewDesktop] = useState(data.desktop ?? '');
	const [previewMobile, setPreviewMobile] = useState(data.mobile ?? '');

	const update = (field, value) => {
		setData({ ...data, [field]: value });
	};

	const handleSetImageDesktop = (base64) => {
		setPreviewDesktop(base64 ? `data:image/webp;base64,${base64}` : '');
		update('desktop', base64);
	};

	const handleSetImageMobile = (base64) => {
		setPreviewMobile(base64 ? `data:image/webp;base64,${base64}` : '');
		update('mobile', base64);
	};

	const handleToggleTextBlock = (checked) => {
		setIncludeTextBlock(checked);
		if (!checked) {
			setData({
				...data,
				title: null,
				description: null,
				buttonText: null,
			});
		}
	};

	return (
		<Stack spacing={2}>
			<Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 36 }}>
				<Tab label='Desktop' sx={{ minHeight: 36 }} />
				<Tab label='Mobile' sx={{ minHeight: 36 }} />
			</Tabs>
			<UploadImageForm
				key={tab}
				setBase64File={tab === 0 ? handleSetImageDesktop : handleSetImageMobile}
				mode={tab === 0 ? 'desktop' : 'mobile'}
				initialPreview={tab === 0 ? previewDesktop : previewMobile}
			/>
			<TextField
				fullWidth
				label='Texto alternativo de la imagen'
				placeholder='Ej: Promo Navidad'
				value={data?.alt ?? ''}
				onChange={(e) => update('alt', e.target.value)}
				size='small'
				sx={inputStyle}
			/>
			{showTextBlock && (
				<>
					<Stack direction='row' alignItems='center' spacing={1}>
						<Switch
							checked={includeTextBlock}
							onChange={(e) => handleToggleTextBlock(e.target.checked)}
						/>
						<Typography sx={{ fontSize: 13 }}>Incluir bloque de texto</Typography>
					</Stack>
					{includeTextBlock && (
						<Stack spacing={2}>
							<TextField
								fullWidth
								label='Título del Pop Up'
								value={data?.title ?? ''}
								onChange={(e) => update('title', e.target.value)}
								size='small'
								sx={inputStyle}
							/>
							<Stack>
								<TextField
									fullWidth
									label='Descripción/Copy del Pop Up'
									multiline
									minRows={3}
									value={data?.description ?? ''}
									onChange={(e) => update('description', e.target.value)}
									inputProps={{ maxLength: 100 }}
									size='small'
									sx={inputStyle}
								/>
								<Typography
									sx={{
										fontSize: 12,
										textAlign: 'right',
										color:
											(data?.description ?? '').length >= 90
												? 'error.main'
												: 'text.disabled',
										mt: 0.5,
									}}
								>
									{`${(data?.description ?? '').length}/100`}
								</Typography>
							</Stack>
							<TextField
								fullWidth
								label='Texto del botón / CTA'
								value={data?.buttonText ?? ''}
								onChange={(e) => update('buttonText', e.target.value)}
								size='small'
								sx={inputStyle}
							/>
						</Stack>
					)}
				</>
			)}
		</Stack>
	);
};

export default ImageSelector;
