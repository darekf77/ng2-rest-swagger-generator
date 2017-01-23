import { expect } from 'chai';

import { SwaggerModel } from '../../swagger';
import { SwaggerHelpers } from './swagger-helpers';

export function clean(s: any) {
    return s.trim().replace(/\s/g, '');
}

describe('Swagger SwaggerHelpers', () => {


    it('Should return proper interface', () => {
        expect(clean(SwaggerHelpers.getObjectDefinition('#/definitions/ViaAgentDTO',
            <any>swag())))
            .to.be.eq(clean(`
                enable:boolean;
                id?:number;
                viaAgentViaGroupDTOs:{
                    priority:number;
                    viaAgentId:number;
                    viaGroupId:number;
                };
    `))


    });

});


function swag() {
    return ({
        "definitions": {
            "ViaAgentViaGroupDTO": {
                "type": "object",
                "required": [
                    "priority",
                    "viaAgentId",
                    "viaGroupId"
                ],
                "properties": {
                    "priority": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "viaAgentId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "viaGroupId": {
                        "type": "integer",
                        "format": "int64"
                    }
                }
            },
            "AgentGroupLink": {
                "type": "object",
                "properties": {
                    "priority": {
                        "type": "integer",
                        "format": "int32"
                    }
                }
            },
            "WebcallbackDTO": {
                "type": "object",
                "required": [
                    "cli",
                    "firstPool",
                    "numDisplayed",
                    "recordFormat",
                    "recorded",
                    "secondPool",
                    "welcome"
                ],
                "properties": {
                    "aep": {
                        "type": "string"
                    },
                    "cli": {
                        "type": "string",
                        "enum": [
                            "NONE",
                            "ANONYMOUS",
                            "FORCED",
                            "THRU"
                        ]
                    },
                    "clinum": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 20
                    },
                    "firstPool": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 50
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "isReversed": {
                        "type": "boolean"
                    },
                    "listenable": {
                        "type": "boolean"
                    },
                    "numDisplayed": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 20
                    },
                    "open": {
                        "type": "boolean"
                    },
                    "profile": {
                        "type": "string"
                    },
                    "recordFormat": {
                        "type": "string",
                        "enum": [
                            "GSM",
                            "MP3"
                        ]
                    },
                    "recorded": {
                        "type": "boolean"
                    },
                    "secondPool": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 50
                    },
                    "serviceId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "timeout": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "vadAck": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 50
                    },
                    "vadDeposit": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 50
                    },
                    "vadDtmfs": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 12
                    },
                    "vadWaitingDuration": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "welcome": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 50
                    }
                }
            },
            "ViaAgentDTO": {
                "type": "object",
                "required": [
                    "enable"
                ],
                "properties": {
                    "enable": {
                        "type": "boolean"
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "viaAgentViaGroupDTOs": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/ViaAgentViaGroupDTO"
                        }
                    }
                }
            },
            "ViaGroupDTO": {
                "type": "object",
                "required": [
                    "enable",
                    "label",
                    "music",
                    "primaryGroup",
                    "priority",
                    "qMaxDuration",
                    "qMaxSize",
                    "wrapUp"
                ],
                "properties": {
                    "dissuasion": {
                        "type": "string"
                    },
                    "enable": {
                        "type": "boolean"
                    },
                    "enableExternalTransfert": {
                        "type": "boolean"
                    },
                    "handoff": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 255
                    },
                    "hldMusic": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 64
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "label": {
                        "type": "string"
                    },
                    "music": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 64
                    },
                    "overflowId": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "primaryGroup": {
                        "type": "boolean"
                    },
                    "priority": {
                        "type": "integer",
                        "format": "int32",
                        "minimum": 0.0,
                        "maximum": 9.0,
                        "exclusiveMinimum": false,
                        "exclusiveMaximum": false
                    },
                    "prompt": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 64
                    },
                    "qMaxDuration": {
                        "type": "integer",
                        "format": "int32",
                        "minimum": 0.0,
                        "exclusiveMinimum": false
                    },
                    "qMaxSize": {
                        "type": "integer",
                        "format": "int32",
                        "minimum": 0.0,
                        "exclusiveMinimum": false
                    },
                    "tmc": {
                        "type": "boolean"
                    },
                    "tmcMax": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "tmcMin": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "tmcResolution": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "treshold": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "viaAgentViaGroupDTOs": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/ViaAgentViaGroupDTO"
                        }
                    },
                    "viaServices": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/ViaServiceDTO"
                        }
                    },
                    "wrapUp": {
                        "type": "integer",
                        "format": "int32",
                        "minimum": 0.0,
                        "exclusiveMinimum": false
                    }
                }
            },
            "CompanyDTO": {
                "type": "object",
                "required": [
                    "enable",
                    "name"
                ],
                "properties": {
                    "enable": {
                        "type": "boolean"
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string",
                        "minLength": 4,
                        "maxLength": 2147483647
                    }
                }
            },
            "ViaCallDTO": {
                "type": "object",
                "required": [
                    "cli",
                    "firstPool",
                    "numDisplayed",
                    "recordFormat",
                    "recorded",
                    "secondPool"
                ],
                "properties": {
                    "cli": {
                        "type": "string",
                        "enum": [
                            "NONE",
                            "ANONYMOUS",
                            "FORCED",
                            "THRU"
                        ]
                    },
                    "clinum": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 20
                    },
                    "firstPool": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 50
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "isAgentCliMatchAlias": {
                        "type": "boolean"
                    },
                    "isAgentCliMatchLogin": {
                        "type": "boolean"
                    },
                    "listenable": {
                        "type": "boolean"
                    },
                    "numDisplayed": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 20
                    },
                    "open": {
                        "type": "boolean"
                    },
                    "recordFormat": {
                        "type": "string",
                        "enum": [
                            "GSM",
                            "MP3"
                        ]
                    },
                    "recorded": {
                        "type": "boolean"
                    },
                    "secondPool": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 50
                    },
                    "serviceId": {
                        "type": "integer",
                        "format": "int64"
                    }
                }
            },
            "TelSviDTO": {
                "type": "object",
                "required": [
                    "commercial",
                    "handoff",
                    "noir",
                    "technique"
                ],
                "properties": {
                    "commercial": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 20
                    },
                    "handoff": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 128
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "noir": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 20
                    },
                    "technique": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 20
                    },
                    "viacontactId": {
                        "type": "integer",
                        "format": "int64"
                    }
                }
            },
            "ViaAdminDTO": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "userId": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "viaServices": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/ViaServiceDTO"
                        }
                    }
                }
            },
            "ViaAdminPojo": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "userId": {
                        "type": "integer",
                        "format": "int32"
                    }
                }
            },
            "ProfileInfoResponse": {
                "type": "object",
                "properties": {
                    "activeProfiles": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "ribbonEnv": {
                        "type": "string"
                    }
                }
            },
            "ViaServiceDTO": {
                "type": "object",
                "required": [
                    "enable",
                    "label",
                    "product"
                ],
                "properties": {
                    "enable": {
                        "type": "boolean"
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "label": {
                        "type": "string"
                    },
                    "product": {
                        "type": "string",
                        "enum": [
                            "FREE",
                            "VIACONTACT",
                            "VIACALL",
                            "WEBCALLBACK",
                            "PREDICTIVE_DIALING",
                            "E_MAILS",
                            "VIACHAT",
                            "VOICEBROADCAST",
                            "VIATRACKER",
                            "WHOLESALES",
                            "SIP_DIRECT",
                            "ECOUTE_DISCRETE"
                        ]
                    },
                    "viaAdmins": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/ViaAdminPojo"
                        }
                    }
                }
            },
            "ViaContactDTO": {
                "type": "object",
                "required": [
                    "cli",
                    "recordFormat",
                    "recorded"
                ],
                "properties": {
                    "cli": {
                        "type": "string",
                        "enum": [
                            "NONE",
                            "ANONYMOUS",
                            "FORCED",
                            "THRU"
                        ]
                    },
                    "clinum": {
                        "type": "string",
                        "minLength": 0,
                        "maxLength": 20
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "listenable": {
                        "type": "boolean"
                    },
                    "open": {
                        "type": "boolean"
                    },
                    "recordFormat": {
                        "type": "string",
                        "enum": [
                            "GSM",
                            "MP3"
                        ]
                    },
                    "recorded": {
                        "type": "boolean"
                    },
                    "serviceId": {
                        "type": "integer",
                        "format": "int64"
                    }
                }
            }
        }
    })
}