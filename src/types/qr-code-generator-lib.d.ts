declare module "qr-code-generator-lib" {
    function getMatrix(content: string, eLevel?: any): (boolean | null)[][];
    function render(matrix: (boolean | null)[][], color: string): string;
    export { getMatrix, render };
}
