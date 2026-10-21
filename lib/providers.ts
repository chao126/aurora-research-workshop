export interface ProviderResult<T> {
  data?: T;
  error?: { code: string; message: string; retryable: boolean };
  retrievedAt: string;
  provider: string;
}

export interface LLMProvider {
  readonly name: string;
  extractStructured<T>(input: { content: string; schemaName: string; promptVersion: string }): Promise<ProviderResult<T>>;
  synthesize<T>(input: { sourceIds: string[]; evidenceIds: string[]; schemaName: string; promptVersion: string }): Promise<ProviderResult<T>>;
}

export interface LiteratureQuery {
  researchQuestion: string;
  dateFrom?: number;
  dateTo?: number;
  languages?: string[];
  publicationTypes?: string[];
  disciplines?: string[];
  authors?: string[];
  methods?: string[];
  regions?: string[];
  anchorExternalIds?: string[];
}

export interface LiteratureIdentity {
  externalId: string;
  title: string;
  authors: string[];
  year?: number;
  doi?: string;
  isbn?: string;
  venue?: string;
  publicationStatus?: string;
  rawMetadata: Record<string, unknown>;
}

export interface LiteratureProvider {
  readonly name: string;
  search(query: LiteratureQuery): Promise<ProviderResult<LiteratureIdentity[]>>;
  verify(identity: Partial<LiteratureIdentity>): Promise<ProviderResult<LiteratureIdentity>>;
}

export interface ZoteroProvider {
  readonly name: string;
  listCollections(): Promise<ProviderResult<Array<{ key: string; name: string }>>>;
  importItems(keys: string[]): Promise<ProviderResult<Array<{ zoteroKey: string; metadata: Record<string, unknown> }>>>;
  findDuplicate(input: { doi?: string; isbn?: string; normalizedTitle: string; authors: string[]; year?: number }): Promise<ProviderResult<{ likelyDuplicate: boolean; zoteroKey?: string }>>;
  saveReviewedAsset(input: { metadata: Record<string, unknown>; collectionKey?: string; researchNote?: string }): Promise<ProviderResult<{ zoteroKey: string }>>;
}

export interface FileParser {
  readonly supportedMimeTypes: string[];
  fingerprint(file: ArrayBuffer): Promise<{ hash: string }>;
  parse(file: ArrayBuffer, mimeType: string): Promise<ProviderResult<{ text: string; pageCount?: number; headings: Array<{ title: string; level: number; locator?: string }> }>>;
}
