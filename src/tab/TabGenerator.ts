// Copyright (c) Wictor Wilén. All rights reserved. 
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as Generator from 'yeoman-generator';
import * as lodash from 'lodash';
import * as chalk from 'chalk';
import { GeneratorTeamsAppOptions } from './../app/GeneratorTeamsAppOptions';
import { Yotilities } from './../app/Yotilities';
import { ManifestGeneratorFactory } from '../app/manifestGeneration/ManifestGeneratorFactory';
<<<<<<< HEAD
import { IManifestGenerator } from '../app/manifestGeneration/IManifestGenerator';

=======
>>>>>>> upstream/preview

let yosay = require('yosay');
let path = require('path');
let Guid = require('guid');


export class TabGenerator extends Generator {
    options: GeneratorTeamsAppOptions;

    public constructor(args: any, opts: any) {
        super(args, opts);
        opts.force = true;
        this.options = opts.options;
        this.desc('Adds a tab to a Teams project.');
    }
    public prompting() {
        if (this.options.tab) {
            return this.prompt(
                [
                    {
                        type: 'input',
                        name: 'tabTitle',
                        message: 'Default Tab name? (max 16 characters)',
                        default: this.options.title + ' Tab',
                        validate: (input) => {
                            return input.length > 0 && input.length <= 16;
                        }
                    }
                ]
            ).then((answers: any) => {
                this.options.tabTitle = answers.tabTitle;
                this.options.tabName = lodash.camelCase(this.options.tabTitle);
                if (!this.options.tabName.endsWith('Tab')) {
                    this.options.tabName = this.options.tabName + 'Tab';
                }
                this.options.tabReactComponentName = this.options.tabName.charAt(0).toUpperCase() + this.options.tabName.slice(1);
                this.options.reactComponents = true;
            });
        }
    }
    public writing() {
        if (this.options.tab) {
            let templateFiles = [
                "src/app/scripts/{tabName}/{tabReactComponentName}Config.tsx",
                "src/app/scripts/{tabName}/{tabReactComponentName}.tsx",
                "src/app/scripts/{tabName}/{tabReactComponentName}Remove.tsx",
                "src/app/{tabName}/{tabReactComponentName}.ts",
                "src/app/web/{tabName}/index.html",
                "src/app/web/{tabName}/remove.html",
                "src/app/web/{tabName}/config.html",
            ];

            if(this.options.unitTestsEnabled) {
                templateFiles.push(
                    "src/app/scripts/{tabName}/__tests__/{tabReactComponentName}Config.spec.tsx",
                    "src/app/scripts/{tabName}/__tests__/{tabReactComponentName}.spec.tsx",
                    "src/app/scripts/{tabName}/__tests__/{tabReactComponentName}Remove.spec.tsx",
                );
            } 

            this.sourceRoot()

            templateFiles.forEach(t => {
                this.fs.copyTpl(
                    this.templatePath(t),
                    Yotilities.fixFileNames(t, this.options),
                    this.options);
            });


            // Update manifest
            const manifestGeneratorFactory = new ManifestGeneratorFactory();
            const manifestGenerator = manifestGeneratorFactory.createManifestGenerator(this.options.manifestVersion);
            let manifestPath = "src/manifest/manifest.json";
            var manifest: any = this.fs.readJSON(manifestPath);
   
            manifestGenerator.updateTabManifest(manifest, this.options);
            
            this.fs.writeJSON(manifestPath, manifest);

            Yotilities.addAdditionalDeps([
                ["msteams-ui-components-react", "^0.8.1"],
                ["react", "^16.8.4"],
                ["@types/react", "16.8.8"],
                ["react-dom", "^16.8.4"],
                ["file-loader", "1.1.11"],
                ["typestyle", "2.0.1"]
            ], this.fs);

            // update client.ts
            Yotilities.insertTsExportDeclaration(
                "src/app/scripts/client.ts",
                `./${this.options.tabName}/${this.options.tabReactComponentName}`,
                `Automatically added for the ${this.options.tabName} tab`,
                this.fs
            );
            Yotilities.insertTsExportDeclaration(
                "src/app/scripts/client.ts",
                `./${this.options.tabName}/${this.options.tabReactComponentName}Config`,
                undefined,
                this.fs
            );
            Yotilities.insertTsExportDeclaration(
                "src/app/scripts/client.ts",
                `./${this.options.tabName}/${this.options.tabReactComponentName}Remove`,
                undefined,
                this.fs
            );

            Yotilities.insertTsExportDeclaration(
                "src/app/TeamsAppsComponents.ts",
                `./${this.options.tabName}/${this.options.tabReactComponentName}`,
                `Automatically added for the ${this.options.tabName} tab`,
                this.fs
            );
        }
    }
}