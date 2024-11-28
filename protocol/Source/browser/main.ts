/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { createMessageConnection } from "vscode-jsonrpc/browser";

import {
	ConnectionOptions,
	ConnectionStrategy,
	Logger,
	MessageReader,
	MessageWriter,
	ProtocolConnection,
} from "../common/api";

export * from "vscode-jsonrpc/browser";

export * from "../common/api";

export function createProtocolConnection(
	reader: MessageReader,
	writer: MessageWriter,
	logger?: Logger,
	options?: ConnectionStrategy | ConnectionOptions,
): ProtocolConnection {
	return createMessageConnection(reader, writer, logger, options);
}
