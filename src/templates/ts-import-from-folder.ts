
export function importServicesFromFolder(servicesNames: string[], folderName: string, surfix?: string) {
    return servicesNames.map(name => {
        return "import {" + name.replace(name.charAt(0), name.charAt(0).toUpperCase()) + surfix + "} from './" + folderName + "'" + ';\n';
    }).join('')
}