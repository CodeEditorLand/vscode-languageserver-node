/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

// @ts-check
'use strict';

const { CompilerOptions } = require('@vscode/tsconfig-gen');
const { webworker } = require('webpack');

/**
 * @typedef {import('@vscode/tsconfig-gen').SharableOptions} SharableOptions
 * @typedef {import('@vscode/tsconfig-gen').ProjectDescription} ProjectDescription
 * @typedef {import('@vscode/tsconfig-gen').ProjectOptions} ProjectOptions
 * @typedef {import('@vscode/tsconfig-gen').Projects} Projects
 */

/**
 * Creates a publish project description from a normal project description by removing
 * any project reference from it since it has to come via a npm dependency during publish.
 *
 * @param {ProjectDescription} projectDescription The project description
 * @returns {ProjectDescription} The project description without project references
 */
function createPublishProjectDescription(projectDescription) {
	const result = Object.assign({}, projectDescription);
	delete result.references;
	return result;
}


const general = {
	/**
	 * Even under browser we compile to node and commonjs and
	 * rely on webpack to package everything correctly.
	 */
	compilerOptions: {
		module: 'commonjs',
		moduleResolution: 'node'
	}
};


const testMixin = {
	compilerOptions: {
		types: ['mocha']
	}
};


const vscodeMixin = {
	compilerOptions: {
		types: ['vscode']
	}
};


const common = {
	extends: [ general ],
	compilerOptions: {
		rootDir: '.',
		types: [],
	},
	include: ['.']
};


const browser = {
	extends: [ general ],
	compilerOptions: {
		rootDir: '.',
		types: [],
		lib: [ 'webworker' ]
	},
	include: ['.']
};


const node = {
	extends: [ general ],
	compilerOptions: {
		rootDir: '.',
		types: ['node']
	},
	include: ['.']
};


const textDocument = {
	name: 'textDocument',
	path: './textDocument',
	sourceFolders: [
		{
			path: './src',
			extends: [ common ],
			out: {
				dir: '../lib/${target}',
				buildInfoFile: '../lib/${target}/${buildInfoFile}.tsbuildInfo'
			},
			exclude: [ 'test' ]
		},
		{
			path: './src/test',
			extends: [ common, testMixin ],
			out: {
				dir: '../../lib/${target}/test',
				buildInfoFile: '../../lib/${target}/test/${buildInfoFile}.tsbuildInfo'
			},
			references: [ '..' ]
		}
	]
};


const textDocument_publish = {
	name: 'textDocument_publish',
	path: './textDocument',
	references: [ './tsconfig.esm.publish.json', './tsconfig.umd.publish.json' ]
};



const types = {
	name: 'types',
	path: './types',
	sourceFolders: [
		{
			path: './src',
			extends: [ common ],
			out: {
				dir: '../lib/${target}',
				buildInfoFile: '../lib/${target}/${buildInfoFile}.tsbuildInfo'
			},
			exclude: [ 'test' ]
		},
		{
			path: './src/test',
			extends: [ common, testMixin ],
			out: {
				dir: '../../lib/${target}/test',
				buildInfoFile: '../../lib/${target}/test/${buildInfoFile}.tsbuildInfo'
			},
			references: [ '..' ]
		}
	]
};


const types_publish = {
	name: 'types_publish',
	path: './types',
	references: [ './tsconfig.esm.publish.json', './tsconfig.umd.publish.json' ]
};


const jsonrpc = {
	name: 'jsonrpc',
	path: './jsonrpc',
	out: {
		dir: './lib',
		buildInfoFile: '${buildInfoFile}.tsbuildInfo'
	},
	sourceFolders: [
		{
			path: './src/common',
			extends: [ common ],
			exclude: [ 'test' ],
		},
		{
			path: './src/common/test',
			extends: [ common, testMixin ],
			references: [ '..' ]
		},
		{
			path: './src/browser',
			extends: [ browser ],
			exclude: [ 'test' ],
			references: [ '../common' ]
		},
		{
			path: './src/browser/test',
			extends: [ browser, testMixin ],
			references: [ '..' ]
		},
		{
			path: './src/node',
			extends: [ node ],
			exclude: [ 'test' ],
			references: [ '../common' ]
		},
		{
			path: './src/node/test',
			extends: [ node, testMixin ],
			references: [ '..' ]
		}
	]
};


const protocol = {
	name: 'protocol',
	path: './protocol',
	out: {
		dir: './lib',
		buildInfoFile: '${buildInfoFile}.tsbuildInfo'
	},
	sourceFolders: [
		{
			path: './src/common',
			extends: [ common ]
		},
		{
			path: './src/browser',
			extends: [ browser ],
			exclude: [ 'test' ],
			references: [ '../common' ]
		},
		{
			path: './src/browser/test',
			extends: [ browser, testMixin ],
			references: [ '..' ]
		},
		{
			path: './src/node',
			extends: [ node ],
			exclude: [ 'test' ],
			references: [ '../common' ]
		},
		{
			path: './src/node/test',
			extends: [ node, testMixin ],
			references: [ '..' ]
		}
	],
	references: [
		types, jsonrpc
	]
};


const server = {
	name: 'server',
	path: './server',
	out: {
		dir: './lib',
		buildInfoFile: '${buildInfoFile}.tsbuildInfo'
	},
	sourceFolders: [
		{
			path: './src/common',
			extends: [ common ]
		},
		{
			path: './src/browser',
			extends: [ browser ],
			references: [ '../common' ]
		},
		{
			path: './src/node',
			extends: [ node ],
			exclude: [ 'test' ],
			references: [ '../common' ]
		},
		{
			path: './src/node/test',
			extends: [ node, testMixin ],
			references: [ '..' ]
		}
	],
	references: [ protocol ]
};


const client = {
	name: 'client',
	path: './client',
	out: {
		dir: './lib',
		buildInfoFile: '${buildInfoFile}.tsbuildInfo'
	},
	sourceFolders: [
		{
			path: './src/common',
			extends: [ common, vscodeMixin ]
		},
		{
			path: './src/browser',
			extends: [ browser, vscodeMixin ],
			references: [ '../common' ]
		},
		{
			path: './src/node',
			extends: [ node, vscodeMixin ],
			references: [ '../common' ]
		}
	],
	references: [ protocol ]
};



const client_node_tests = {
	name: 'client-node-tests',
	path: './client-node-tests',
	out: {
		dir: './lib',
		buildInfoFile: '${buildInfoFile}.tsbuildInfo'
	},
	sourceFolders: [
		{
			path: './src',
			extends: [ node, vscodeMixin, testMixin, browser ],
		}
	],
	references: [ protocol, client, server ]
};


const tools = {
	name: 'tools',
	path: './tools',
	extends: [ node ],
	out: {
		dir: './lib',
		buildInfoFile: '${buildInfoFile}.tsbuildInfo'
	},
	compilerOptions: {
		rootDir: './src'
	}
};


const tsconfig_gen = {
	name: 'tsconfig-gen',
	path: './tsconfig-gen',
	extends: [ node ],
	out: {
		dir: './lib',
		buildInfoFile: '${buildInfoFile}.tsbuildInfo'
	},
	compilerOptions: {
		rootDir: './src'
	}
};


const root = {
	name: 'root',
	path: './',
	references: [ textDocument, types, jsonrpc, protocol, client, server, client_node_tests, tools, tsconfig_gen ]
};


const defaultCompilerOptions = {
	strict: true,
	noImplicitAny: true,
	noImplicitReturns: true,
	noImplicitThis: true,
	declaration: true,
	stripInternal: true
};


const compileCompilerOptions = CompilerOptions.assign(defaultCompilerOptions, {
	sourceMap: true,
	declarationMap: true,
	noUnusedLocals: true,
	noUnusedParameters: true,
	target: 'es2020',
	lib: [ 'es2020' ],
});


const compileProjectOptions = {
	tags: ['compile'],
	tsconfig: 'tsconfig.json',
	variables: new Map([['buildInfoFile', 'compile']]),
	compilerOptions: compileCompilerOptions
};


const watchCompilerOptions = CompilerOptions.assign(defaultCompilerOptions, {
	sourceMap: true,
	declarationMap: true,
	noUnusedLocals: false,
	noUnusedParameters: false,
	assumeChangesOnlyAffectDirectDependencies: true,
	target: 'es2020',
	lib: [ 'es2020' ],
});


const watchProjectOptions = {
	tags: ['watch'],
	tsconfig: 'tsconfig.watch.json',
	variables: new Map([['buildInfoFile', 'watch']]),
	compilerOptions: watchCompilerOptions
};


const publishCompilerOptions = CompilerOptions.assign(defaultCompilerOptions, {
	sourceMap: false,
	declarationMap: false,
	noUnusedLocals: true,
	noUnusedParameters: true,
	target: 'es2020',
	lib: [ 'es2020' ]

});


const publishProjectOptions = {
	tags: ['publish'],
	tsconfig: 'tsconfig.publish.json',
	variables: new Map([['buildInfoFile', 'publish']]),
	compilerOptions: publishCompilerOptions
};


const umdCompilerOptions = CompilerOptions.assign(defaultCompilerOptions, {
	sourceMap: true,
	declarationMap: true,
	noUnusedLocals: true,
	noUnusedParameters: true,
	target: 'es5',
	module: 'umd',
	lib: [ 'es2015' ],
});


const umdProjectOptions = {
	tags: ['umd', 'compile'],
	tsconfig: 'tsconfig.json',
	variables: new Map([['target', 'umd'], ['buildInfoFile', 'compile']]),
	compilerOptions: umdCompilerOptions
};


const umdWatchCompilerOptions = CompilerOptions.assign(umdCompilerOptions, {
	noUnusedLocals: false,
	noUnusedParameters: false,
	assumeChangesOnlyAffectDirectDependencies: true,
});


const umdWatchProjectOptions = {
	tags: ['umd', 'watch'],
	tsconfig: 'tsconfig.watch.json',
	variables: new Map([['target', 'umd'], ['buildInfoFile', 'watch']]),
	compilerOptions: umdCompilerOptions
};


const umdPublishCompilerOptions = CompilerOptions.assign(umdCompilerOptions, {
	sourceMap: false,
	declarationMap: false
});


const umdPublishProjectOptions = {
	tags: ['umd', 'publish'],
	tsconfig: 'tsconfig.umd.publish.json',
	variables: new Map([['target', 'umd'], ['buildInfoFile', 'publish']]),
	compilerOptions: umdPublishCompilerOptions
};



const esmPublishCompilerOptions = CompilerOptions.assign(defaultCompilerOptions, {
	sourceMap: false,
	target: 'es6',
	module: 'es6',
	lib: [ 'es2015' ]
});


const esmPublishProjectOptions = {
	tags: ['esm', 'publish'],
	tsconfig: 'tsconfig.esm.publish.json',
	variables: new Map([['target', 'esm'], ['buildInfoFile', 'publish']]),
	compilerOptions: esmPublishCompilerOptions
};


const projects = [
	[ textDocument, [ umdProjectOptions, umdWatchProjectOptions, esmPublishProjectOptions, umdPublishProjectOptions ] ],
	[ textDocument_publish, [ publishProjectOptions ] ],
	[ types, [ umdProjectOptions, umdWatchProjectOptions, esmPublishProjectOptions, umdPublishProjectOptions ] ],
	[ types_publish, [ publishProjectOptions ]],
	[ jsonrpc, [ compileProjectOptions, watchProjectOptions ] ],
	[ createPublishProjectDescription(jsonrpc), [ publishProjectOptions ] ],
	[ protocol, [ compileProjectOptions, watchProjectOptions ] ],
	[ createPublishProjectDescription(protocol), [ publishProjectOptions ] ],
	[ server, [ compileProjectOptions, watchProjectOptions ] ],
	[ createPublishProjectDescription(server), [ publishProjectOptions ] ],
	[ client, [ compileProjectOptions, watchProjectOptions ] ],
	[ createPublishProjectDescription(client), [ publishProjectOptions ] ],
	[ client_node_tests, [ compileProjectOptions, watchProjectOptions ] ],
	[ createPublishProjectDescription(client_node_tests), [ publishProjectOptions ] ],
	[ tools, [ compileProjectOptions, watchProjectOptions ] ],
	[ tsconfig_gen, [ compileProjectOptions, watchProjectOptions ] ],
	[ createPublishProjectDescription(tsconfig_gen), [ publishProjectOptions ] ],
	[ root, [ compileProjectOptions, watchProjectOptions ] ],
];

module.exports = projects;
