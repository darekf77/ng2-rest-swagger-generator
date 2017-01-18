export interface ng2restInstanceTemplate {
    singleModelType: string;
    queryModelType: string;
    restPramsType: string;
    queryPramType: string;
    endpointType: string;
    endpointSelected: string;
    model: string;
}

export function n2RestObject(instance: ng2restInstanceTemplate) {
    return `<
    ${instance.endpointType},
    ${instance.singleModelType},
    ${instance.queryModelType},
    ${instance.restPramsType},
    ${instance.queryPramType}
    >( '${instance.endpointSelected}' ,  '${instance.model}' );` + '\n';
}
