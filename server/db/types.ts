export type TableSchemaField =
    | "ascii"
    | "text"
    | "varchar"
    | "bigint"
    | "counter"
    | "decimal"
    | "double"
    | "float"
    | "int"
    | "varint"
    | "blob"
    | "boolean"
    | "date"
    | "timestamp"
    | "timeuuid"
    | "list"
    | "map"
    | "set";

export type TableColumn = {
    name: string;
    type: TableSchemaField;
};

export type Table = {
    name: string;
    schema: TableColumn[];
};
