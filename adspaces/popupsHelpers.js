export const parseListResponse = (responseData) => {
	const rawList = responseData.content ?? responseData.popups ?? responseData ?? [];

	const pagination = {
		totalElements: responseData.totalElements ?? rawList.length,
		totalPages: responseData.totalPages ?? 1,
		pageNumber: responseData.pageNumber ?? 1,
		pageSize: responseData.pageSize ?? rawList.length,
	};

	const data = rawList.map((popup) => ({
		...popup,
		startDate: popup.fromDate,
		endDate: popup.toDate,
		maxView: popup.max_view,
	}));

	return { data, pagination };
};

export const buildPopupBody = (popupData, country) => {
	const hasProductSegmentation =
		(popupData.productSegmentation?.collections?.length ?? 0) > 0 ||
		(popupData.productSegmentation?.categories?.length ?? 0) > 0 ||
		(popupData.productSegmentation?.brands?.length ?? 0) > 0 ||
		(popupData.productSegmentation?.products?.length ?? 0) > 0 ||
		(popupData.productSegmentation?.skus?.length ?? 0) > 0 ||
		(popupData.productSegmentation?.promotions?.length ?? 0) > 0;

	return {
		name: popupData.name,
		fromDate: popupData.fromDate ?? null,
		toDate: popupData.toDate ?? null,
		active: true,
		country: country?.toUpperCase() ?? 'AR',
		images: {
			desktopBase64: popupData.images?.desktop?.startsWith('http')
				? null
				: popupData.images?.desktop || null,
			mobileBase64: popupData.images?.mobile?.startsWith('http')
				? null
				: popupData.images?.mobile || null,
			alt: popupData.images?.alt || '',
		},
		content: {
			title: popupData.content?.title || '',
			description: popupData.content?.description || '',
			buttonText: popupData.content?.buttonText || '',
		},
		locations: popupData.locations ?? [],
		link: hasProductSegmentation ? '' : (popupData.link ?? ''),
		showEvery: popupData.showEvery ?? 24,
		max_view: popupData.maxView ?? 4,
		segmentation: {
			sellers: popupData.segmentation?.sellers ?? [],
			segment2: popupData.segmentation?.segment2 ?? [],
			segment5: popupData.segmentation?.segment5 ?? [],
			commercialAgreements: popupData.segmentation?.commercialAgreements ?? [],
			idpdvs: (popupData.segmentation?.idpdvs ?? []).map((item) =>
				typeof item === 'object' ? item.id : item,
			),
		},
		productSegmentation: {
			collections: popupData.productSegmentation?.collections?.map((c) => c.id) ?? [],
			categories: popupData.productSegmentation?.categories?.map((c) => c.id) ?? [],
			brands: popupData.productSegmentation?.brands?.map((b) => b.id) ?? [],
			products: popupData.productSegmentation?.products?.map((p) => p.id) ?? [],
			skus: popupData.productSegmentation?.skus ?? [],
			promotions: popupData.productSegmentation?.promotions?.map((p) => p.id) ?? [],
		},
	};
};
