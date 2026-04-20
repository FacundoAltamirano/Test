import SegmentationSelector from '../../SegmentationSelector';

const SegmentationStep = ({ data, update }) => {
	return (
		<SegmentationSelector
			data={data?.segmentation ?? {}}
			setData={(vals) => update('segmentation', vals)}
		/>
	);
};

export default SegmentationStep;
