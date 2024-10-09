/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as ic from "./inlineCompletion.proposed";
import { NotebookDocuments } from "./notebook";
import type {
	ResultProgressReporter,
	WorkDoneProgressReporter,
	WorkDoneProgressServerReporter,
} from "./progress";
import { SemanticTokensBuilder } from "./semanticTokens";
import { _, _Connection, _LanguagesImpl, Features } from "./server";
import * as tdc from "./textDocumentContent";
import {
	TextDocumentChangeEvent,
	TextDocuments,
	TextDocumentsConfiguration,
	TextDocumentWillSaveEvent,
} from "./textDocuments";

export * from "vscode-languageserver-protocol";
export {
	WorkDoneProgressReporter,
	WorkDoneProgressServerReporter,
	ResultProgressReporter,
};
export { SemanticTokensBuilder };

export {
	TextDocuments,
	TextDocumentsConfiguration,
	TextDocumentChangeEvent,
	TextDocumentWillSaveEvent,
};

export { NotebookDocuments };
export * from "./server";

export namespace ProposedFeatures {
	export const all: Features<
		_,
		_,
		_,
		_,
		_,
		tdc.TextDocumentContentFeatureShape,
		ic.InlineCompletionFeatureShape,
		_
	> = {
		__brand: "features",
		workspace: tdc.TextDocumentContentFeature,
		languages: ic.InlineCompletionFeature,
	};

	export type Connection = _Connection<
		_,
		_,
		_,
		_,
		_,
		tdc.TextDocumentContentFeatureShape,
		ic.InlineCompletionFeatureShape,
		_
	>;
}
