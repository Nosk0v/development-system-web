import SvgCollection from '../SvgCollection';

class DOM {
	/**
     * Вставляет SVG изображение в HTMLElement.
     * @param element Элемент, в который будет вставлен svg.
     * @param svgText SVG изображение из коллекции.
     */
	public injectSVG = (element: HTMLElement, svgText: SvgCollection) => {
		element.insertAdjacentHTML('beforeend', svgText);
	};

	/**
     * Возвращает HTMLElement из его текстового представления.
     * @param str Текстовое представление HTMLElement.
     */
	public stringToElement = (str: string): HTMLElement => {
		const template = document.createElement('template');
		template.innerHTML = str.trim();
		const node = template.content.firstChild;
		return node as HTMLElement;
	};
}

export default DOM;
