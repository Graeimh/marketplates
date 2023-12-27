/**
   * Turns a string value into a hexadecimal color value string
   *
   * 
   * @param {string} color - The received string to be converted
   * 
   * @returns An hexadecimal color value string
*/
export function hexifyColors(color: string): string {
    let hexifiedColor = color;
    if (hexifiedColor.charAt(0) !== "#") {
        hexifiedColor = `#${hexifiedColor}`;
    }
    if (hexifiedColor.length > 7) {
        hexifiedColor = hexifiedColor.slice(0, 7 - hexifiedColor.length);
    }
    hexifiedColor = hexifiedColor.slice(1, hexifiedColor.length)

    //Replaces any non hexadecimal characters with a 0
    hexifiedColor = hexifiedColor.replace(/[^A-Fa-f0-9]/, '0')

    return `#${hexifiedColor}`;
}