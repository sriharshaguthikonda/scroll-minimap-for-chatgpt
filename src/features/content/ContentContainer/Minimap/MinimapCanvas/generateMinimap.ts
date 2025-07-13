import html2canvas from 'html2canvas-pro';
import { Options } from "html2canvas-pro";


/**
 * Returns image of element passed in.
 *
 * @param elementToRender - The element to render as a minimap containing chat messages.
 * @returns A Promise that resolves to void.
 */
export default async function generateMinimapCanvas(
  elementToRender: HTMLElement,
  renderOptions: Partial<Options> = {}
): Promise<HTMLCanvasElement> {

  const rootElement = document.documentElement;
  const rootBackgroundColor = window.getComputedStyle(rootElement).backgroundColor;

  const options: Partial<Options> = {
    ...renderOptions,
    scrollX: 0,
    scrollY: 0,
    scale: 0.25,
    backgroundColor: rootBackgroundColor,
    onclone: (_document: Document, element: HTMLElement) => {
      removeOverflowRestriction(element);
    },
  };

  // Generate the canvas
  const canvas = await html2canvas(elementToRender, options);
  return canvas;
}


function removeOverflowRestriction(element: HTMLElement) {
  // Set the element to show its full height
  element.style.height = "auto";
  element.style.overflow = "visible";
}