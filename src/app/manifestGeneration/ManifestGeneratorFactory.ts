// Copyright (c) Wictor Wilén. All rights reserved. 
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { ManifestVersions } from "./ManifestVersions";
import { ManifestGenerator as ManifestGenerator13 }  from "./manifestGenerators/generator13/ManifestGenerator";
import { ManifestGenerator as ManifestGeneratorDevPreview} from "./manifestGenerators/generatorDevPreview/ManifestGenerator";
import { BaseManifestGenerator } from "./BaseManifestGenerator";

export class ManifestGeneratorFactory {

    public static supportedManifestVersions = [
        {
            manifestVersion: ManifestVersions.v13,
            schemaUrl: "https://developer.microsoft.com/en-us/json-schemas/teams/v1.3/MicrosoftTeams.schema.json"
        },
        {
            manifestVersion: ManifestVersions.devPreview,
            schemaUrl: "https://raw.githubusercontent.com/OfficeDev/microsoft-teams-app-schema/preview/DevPreview/MicrosoftTeams.schema.json"
        }
    ]
   
    constructor() {
       
    }

    public createManifestGenerator(manifestVersion: string): BaseManifestGenerator {
        if(manifestVersion == ManifestVersions.v13) {
            return new ManifestGenerator13();
        } else if(manifestVersion == ManifestVersions.devPreview) {
            return new ManifestGeneratorDevPreview();
        } else {
            throw new Error("Invalid manifest version.");
        }
    }

    static isSchemaVersionValid(existingManifest: any): boolean {
        if (existingManifest) {
            let retval = false;
            this.supportedManifestVersions.forEach(manifestVersionItem => {
                if (existingManifest["$schema"] == manifestVersionItem.schemaUrl) {
                    retval = true;
                    return;
                }
            });
            return retval;
        } else {
            return true;
        }
    }
}
