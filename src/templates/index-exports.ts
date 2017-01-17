
export function indexExportsTmpl(fileNames: string[]) {
    return fileNames.map(name => {
        return "export * from './" + name + "';";
    }).join('\n');
}