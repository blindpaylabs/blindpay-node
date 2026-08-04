export type SchemaLocator = {
    schema: string;
    property?: string;
    itemsEnum?: boolean;
};

export type PathLocator = {
    path: string;
    method: string;
    location: "requestBody" | "response:200" | "parameters";
};

export type SpecLocator = SchemaLocator | PathLocator;

export function isPathLocator(loc: SpecLocator): loc is PathLocator {
    return "path" in loc;
}

export type SdkSite = {
    file: string;
    symbol: string;
};

export type EnumMapEntry = {
    spec: SchemaLocator;
    sdk: SdkSite[];
    notes?: string | null;
};

export type TypeMapEntry = {
    spec: SpecLocator;
    sdk: SdkSite[];
    notes?: string | null;
};

export type IgnoreEntry = {
    name: string;
    reason: string;
};

export type SpecMap = {
    notes?: string[];
    enums: EnumMapEntry[];
    types: TypeMapEntry[];
    ignore: {
        schemas: IgnoreEntry[];
    };
};

export type UnmodeledPropertyEntry = {
    kind: "property";
    schema: string;
    field: string;
    property?: string;
    reason: string;
    owner: string;
};

export type KnownDivergenceEnumEntry = {
    kind: "enum";
    schema: string;
    enumProperty: string;
    member?: string;
    reason: string;
    owner: string;
};

export type KnownDivergencePropertyEntry = {
    kind: "property";
    schema: string;
    field: string;
    property?: string;
    reason: string;
    owner: string;
};

export type KnownDivergenceTypeMismatchEntry = {
    kind: "type-mismatch";
    schema: string;
    field: string;
    reason: string;
    owner: string;
};

export type KnownDivergenceEntry =
    | KnownDivergenceEnumEntry
    | KnownDivergencePropertyEntry
    | KnownDivergenceTypeMismatchEntry;

export type EnumPropertyOmissionEntry = {
    schema: string;
    property: string;
    reason: string;
    owner: string;
};

export type NestedShapeOmissionEntry = {
    schema: string;
    path: string;
    reason: string;
    owner: string;
};

export type UnmodeledFile = {
    properties: UnmodeledPropertyEntry[];
    knownDivergences: KnownDivergenceEntry[];
    /** Enum-constrained properties intentionally not (yet) covered by spec-map.json's enums[]
     * or by the ordinary field-type comparison; see enum-coverage.ts. */
    enumPropertyOmissions: EnumPropertyOmissionEntry[];
    /** Inline nested object/array-item shapes intentionally not (yet) modeled; see nested-coverage.ts. */
    nestedShapeOmissions: NestedShapeOmissionEntry[];
};

export type ApplicableChange =
    | {
          kind: "enum-insert";
          schema: string;
          property: string;
          member: string;
          site: SdkSite;
      }
    | {
          kind: "field-insert";
          schema: string;
          property?: string;
          field: string;
          tsType: string;
          site: SdkSite;
      };

export type NeedsHumanIssue = {
    message: string;
};

export type BumpType = "minor" | "patch" | "none";

export type SyncReport = {
    applied: string[];
    needsHuman: string[];
    knownDivergences: string[];
    bump: BumpType;
    previousVersion: string | null;
    newVersion: string | null;
    coverageGaps: string[];
};
