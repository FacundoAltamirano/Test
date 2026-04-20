import CustomRangeDateTime from '../../../../../components/CustomRangeDateTime/CustomRangeDateTime';

const VigenciaStep = ({ data, update }) => {
	return (
		<CustomRangeDateTime
			startDate={data?.fromDate}
			endDate={data?.toDate}
			setStartDate={(v) => update('fromDate', v)}
			setEndDate={(v) => update('toDate', v)}
		/>
	);
};

export default VigenciaStep;
