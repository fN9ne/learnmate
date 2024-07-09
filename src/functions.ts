export const generateId = <T extends { id: number }>(array: T[]): number => {
	return array.length > 0 ? Math.max(...array.map((item) => item.id)) + 1 : 0;
};
export const isWidthInViewport = (width: number): boolean => {
	return window.innerWidth <= width;
};
