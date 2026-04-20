import { Stack, Typography } from '@mui/material';
import ImageSelector from '../../ImageSelector';

const ContentStep = ({ data, setData }) => {
	return (
		<Stack>
			<Typography fontWeight={600} fontSize={14} mb={1}>
				Imagen
			</Typography>
			<ImageSelector
				data={{ ...data?.images, ...data?.content }}
				setData={(vals) =>
					setData((prev) => ({
						...prev,
						images: { desktop: vals.desktop, mobile: vals.mobile, alt: vals.alt },
						content: {
							title: vals.title,
							description: vals.description,
							buttonText: vals.buttonText,
						},
					}))
				}
				showTextBlock
			/>
		</Stack>
	);
};

export default ContentStep;
